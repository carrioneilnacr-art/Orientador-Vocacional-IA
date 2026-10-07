import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { schools, students, gradeImports, gradeImportRows } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { parseGradeCSV, ParsedGradeRow } from '@/lib/gradeParser';
import { validateGradeRows, ExistingStudentInfo } from '@/lib/gradeValidator';

export async function POST(req: NextRequest) {
  try {
    let fileContent = '';
    let schoolId = req.headers.get('x-school-id') || undefined;
    let providedRows: ParsedGradeRow[] | undefined;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const formSchoolId = formData.get('schoolId') as string | null;
      if (formSchoolId) schoolId = formSchoolId;

      if (!file) {
        return NextResponse.json(
          { error: 'No se ha proporcionado ningún archivo para importar.' },
          { status: 400 }
        );
      }

      fileContent = await file.text();
    } else {
      const jsonBody = await req.json();
      if (jsonBody.schoolId) schoolId = jsonBody.schoolId;
      if (jsonBody.fileContent) fileContent = jsonBody.fileContent;
      if (Array.isArray(jsonBody.rows)) providedRows = jsonBody.rows;
    }

    // 1. Obtener o resolver schoolId
    let targetSchoolId = schoolId;
    if (!targetSchoolId) {
      try {
        const foundSchools = await db.select().from(schools).limit(1);
        if (foundSchools.length > 0) {
          targetSchoolId = foundSchools[0].id;
        } else {
          // Crear un colegio por defecto si la base está limpia
          const [newSchool] = await db
            .insert(schools)
            .values({
              name: 'Colegio Nacional Ejemplo',
              slug: 'colegio-nacional-ejemplo',
              gradeScale: 'VIGESIMAL',
            })
            .returning();
          targetSchoolId = newSchool.id;
        }
      } catch (dbErr) {
        console.warn('[Importar Notas] Error consultando escuelas:', dbErr);
      }
    }

    // 2. Parsear el archivo o usar filas provistas
    let rowsToValidate: ParsedGradeRow[] = [];
    let detectedHeaders: string[] = [];
    let parseErrors: string[] = [];

    if (fileContent) {
      const parseResult = parseGradeCSV(fileContent);
      rowsToValidate = parseResult.rows;
      detectedHeaders = parseResult.headers;
      parseErrors = parseResult.errors;

      if (parseErrors.length > 0 && rowsToValidate.length === 0) {
        return NextResponse.json(
          { error: parseErrors.join(' ') },
          { status: 400 }
        );
      }
    } else if (providedRows && providedRows.length > 0) {
      rowsToValidate = providedRows;
    } else {
      return NextResponse.json(
        { error: 'El archivo está vacío o no contiene filas con datos de notas.' },
        { status: 400 }
      );
    }

    // 3. Consultar alumnos existentes del colegio para matching
    let existingStudentsList: ExistingStudentInfo[] = [];
    if (targetSchoolId) {
      try {
        const dbStudents = await db
          .select({
            id: students.id,
            studentCode: students.studentCode,
            fullName: students.fullName,
          })
          .from(students)
          .where(eq(students.schoolId, targetSchoolId));

        existingStudentsList = dbStudents;
      } catch (stErr) {
        console.warn('[Importar Notas] No se pudieron cargar los estudiantes para matching:', stErr);
      }
    }

    // 4. Validar filas con el validador oficial
    const summary = validateGradeRows(rowsToValidate, {
      existingStudents: existingStudentsList,
      requireKnownStudents: false, // Permite advertencia en lugar de error si aún no se registró
    });

    // 5. Persistir en grade_imports y grade_import_rows si hay targetSchoolId
    let importId = crypto.randomUUID();

    if (targetSchoolId) {
      try {
        const [insertedImport] = await db
          .insert(gradeImports)
          .values({
            id: importId,
            schoolId: targetSchoolId,
            fileType: 'CSV',
            status: 'NEEDS_REVIEW',
            stats: {
              totalRows: summary.totalRows,
              okCount: summary.okCount,
              warningCount: summary.warningCount,
              errorCount: summary.errorCount,
            },
          })
          .returning();

        if (insertedImport) {
          importId = insertedImport.id;
        }

        // Insertar filas individuales en grade_import_rows
        if (summary.rows.length > 0) {
          const rowsToInsert = summary.rows.map((row) => ({
            id: crypto.randomUUID(),
            importId,
            rawStudentCode: row.studentCode,
            rawName: row.rawName || null,
            subject: row.subject,
            period: row.period,
            rawGrade: row.rawGrade,
            parsedGrade: row.parsedGrade !== null ? String(row.parsedGrade) : null,
            status: row.status,
            issues: row.issues,
            confidence: String(row.confidence),
          }));

          // Insertar en chunks de 100 para evitar límites de parámetros
          const chunkSize = 100;
          for (let i = 0; i < rowsToInsert.length; i += chunkSize) {
            await db.insert(gradeImportRows).values(rowsToInsert.slice(i, i + chunkSize));
          }
        }
      } catch (dbInsertErr) {
        console.error('[Importar Notas] Error guardando registros en base de datos:', dbInsertErr);
      }
    }

    return NextResponse.json({
      success: true,
      importId,
      schoolId: targetSchoolId,
      headers: detectedHeaders,
      summary,
    });
  } catch (error: any) {
    console.error('[API Importar Notas] Error general:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al procesar la importación de calificaciones.' },
      { status: 500 }
    );
  }
}
