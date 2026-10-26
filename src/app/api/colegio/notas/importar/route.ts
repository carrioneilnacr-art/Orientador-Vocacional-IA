import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students, gradeImports, gradeImportRows } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { parseGradeCSV, ParsedGradeRow } from '@/lib/gradeParser';
import { validateGradeRows, ExistingStudentInfo } from '@/lib/gradeValidator';
import { getActiveStaffSessionFromRequest, hasStaffPermission } from '@/lib/staffAuth';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const session = await getActiveStaffSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Inicia sesión para continuar.' }, { status: 401 });
    if (!hasStaffPermission(session.role, 'grades:import')) {
      return NextResponse.json({ error: 'No tienes permiso para importar calificaciones.' }, { status: 403 });
    }
    let fileContent = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { error: 'No se ha proporcionado ningún archivo para importar.' },
          { status: 400 }
        );
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'El archivo supera el límite de 5 MB.' }, { status: 413 });
      }

      fileContent = await file.text();
    } else {
      const payload = z.object({ fileContent: z.string().max(5 * 1024 * 1024).optional() }).safeParse(await req.json());
      if (!payload.success) return NextResponse.json({ error: 'Formato de importación inválido.' }, { status: 400 });
      fileContent = payload.data.fileContent || '';
    }

    const targetSchoolId = session.schoolId;

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
    const importId = crypto.randomUUID();
    try {
      await db.transaction(async (tx) => {
        await tx.insert(gradeImports).values({
          id: importId,
          schoolId: targetSchoolId,
          uploadedBy: session.userId,
          fileType: 'CSV',
          status: 'NEEDS_REVIEW',
          stats: {
            totalRows: summary.totalRows,
            okCount: summary.okCount,
            warningCount: summary.warningCount,
            errorCount: summary.errorCount,
          },
        });
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
        const chunkSize = 100;
        for (let i = 0; i < rowsToInsert.length; i += chunkSize) {
          await tx.insert(gradeImportRows).values(rowsToInsert.slice(i, i + chunkSize));
        }
      });
    } catch (dbInsertErr) {
      console.error('[Importar Notas] Error guardando importación:', dbInsertErr instanceof Error ? dbInsertErr.message : 'unknown error');
      return NextResponse.json({ error: 'No se pudo guardar la importación. Inténtalo nuevamente.' }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      importId,
      schoolId: targetSchoolId,
      headers: detectedHeaders,
      summary,
    });
  } catch (error) {
    console.error('[API Importar Notas] Error general:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json(
      { error: 'Error al procesar la importación de calificaciones.' },
      { status: 500 }
    );
  }
}
