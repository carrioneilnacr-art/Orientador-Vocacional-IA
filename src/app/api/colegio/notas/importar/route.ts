import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students, gradeImports, gradeImportRows } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { parseGradeCSV, ParsedGradeRow } from '@/lib/gradeParser';
import { MAX_GRADE_FILE_BYTES, parseGradeFile, type GradeFileType } from '@/lib/gradeFileParser';
import { validateGradeRows, ExistingStudentInfo } from '@/lib/gradeValidator';
import { getActiveStaffSessionFromRequest, hasStaffPermission } from '@/lib/staffAuth';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await getActiveStaffSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Inicia sesión para continuar.' }, { status: 401 });
    if (!hasStaffPermission(session.role, 'grades:import')) {
      return NextResponse.json({ error: 'No tienes permiso para importar calificaciones.' }, { status: 403 });
    }
    let rowsToValidate: ParsedGradeRow[] = [];
    let detectedHeaders: string[] = [];
    let parseErrors: string[] = [];
    let fileType: GradeFileType = 'CSV';
    let sourceLabel = 'Contenido CSV';
    let fileName: string | null = null;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const fileEntry = formData.get('file');

      if (!(fileEntry instanceof File)) {
        return NextResponse.json(
          { error: 'No se ha proporcionado ningún archivo para importar.' },
          { status: 400 }
        );
      }
      if (fileEntry.size > MAX_GRADE_FILE_BYTES) {
        return NextResponse.json({ error: 'El archivo supera el límite de 5 MB.' }, { status: 413 });
      }
      fileName = fileEntry.name.slice(0, 255);

      try {
        const parsedFile = await parseGradeFile({
          fileName: fileEntry.name,
          mimeType: fileEntry.type,
          bytes: new Uint8Array(await fileEntry.arrayBuffer()),
        });
        rowsToValidate = parsedFile.rows;
        detectedHeaders = parsedFile.headers;
        parseErrors = parsedFile.errors;
        fileType = parsedFile.fileType;
        sourceLabel = parsedFile.sourceLabel;
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'No se pudo leer el archivo.' },
          { status: 400 }
        );
      }
    } else {
      const payload = z.object({ fileContent: z.string().max(MAX_GRADE_FILE_BYTES).optional() }).safeParse(await req.json());
      if (!payload.success) return NextResponse.json({ error: 'Formato de importación inválido.' }, { status: 400 });
      const fileContent = payload.data.fileContent || '';
      if (fileContent) {
        const parseResult = parseGradeCSV(fileContent);
        rowsToValidate = parseResult.rows;
        detectedHeaders = parseResult.headers;
        parseErrors = parseResult.errors;
      }
    }

    const targetSchoolId = session.schoolId;

    // 2. Rechazar entradas ambiguas antes de crear una vista previa.
    if (parseErrors.length > 0 || rowsToValidate.length === 0) {
      return NextResponse.json(
        { error: parseErrors.join(' ') || 'El archivo está vacío o no contiene filas con datos de notas.' },
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
      } catch {
        return NextResponse.json({ error: 'No se pudo consultar la matrícula del colegio.' }, { status: 503 });
      }
    }

    // 4. Validar filas con el validador oficial
    const summary = validateGradeRows(rowsToValidate, {
      existingStudents: existingStudentsList,
      requireKnownStudents: true,
    });

    // 5. Persistir en grade_imports y grade_import_rows si hay targetSchoolId
    const importId = crypto.randomUUID();
    try {
      await db.transaction(async (tx) => {
        await tx.insert(gradeImports).values({
          id: importId,
          schoolId: targetSchoolId,
          uploadedBy: session.userId,
          fileType,
          fileName,
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
      fileType,
      sourceLabel,
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
