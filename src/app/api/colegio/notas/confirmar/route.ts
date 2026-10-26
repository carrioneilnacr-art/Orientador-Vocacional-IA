import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gradeImports, gradeImportRows, academicRecords, students, auditLog } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { ValidatedGradeRow } from '@/lib/gradeValidator';
import { getActiveStaffSessionFromRequest, hasStaffPermission } from '@/lib/staffAuth';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const session = await getActiveStaffSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Inicia sesión para continuar.' }, { status: 401 });
    if (!hasStaffPermission(session.role, 'grades:confirm')) {
      return NextResponse.json({ error: 'No tienes permiso para confirmar calificaciones.' }, { status: 403 });
    }
    const body = await req.json().catch(() => null);
    const rowSchema = z.object({
      originalRowIndex: z.number().int().positive(),
      studentCode: z.string().max(100),
      rawName: z.string().max(200).optional(),
      matchedStudentId: z.string().uuid().optional(),
      matchedStudentName: z.string().max(200).optional(),
      subject: z.string().max(200),
      area: z.string().max(100),
      period: z.string().max(30),
      rawGrade: z.string().max(30),
      parsedGrade: z.number().min(0).max(20).nullable(),
      gradeScale: z.enum(['VIGESIMAL', 'LITERAL', 'UNKNOWN']),
      status: z.enum(['OK', 'WARNING', 'ERROR']),
      issues: z.array(z.object({
        field: z.enum(['studentCode', 'rawName', 'subject', 'period', 'rawGrade', 'parsedGrade', 'general']),
        severity: z.enum(['ERROR', 'WARNING']),
        message: z.string().max(500),
        code: z.string().max(100),
      })).max(20),
      confidence: z.number().min(0).max(1),
    });
    const parsed = z.object({ importId: z.string().uuid(), rows: z.array(rowSchema).max(5000).optional() }).safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Datos de importación inválidos.' }, { status: 400 });
    const { importId, rows: providedRows } = parsed.data;

    if (!importId) {
      return NextResponse.json(
        { error: 'El identificador de importación (importId) es obligatorio.' },
        { status: 400 }
      );
    }

    // 1. Obtener la importación en base de datos
    const [existingImport] = await db
      .select()
      .from(gradeImports)
      .where(and(eq(gradeImports.id, importId), eq(gradeImports.schoolId, session.schoolId)))
      .limit(1);

    if (!existingImport) {
      return NextResponse.json(
        { error: 'No se encontró la importación o no tienes acceso.' },
        { status: 404 }
      );
    }
    const schoolId = session.schoolId;

    // 2. Determinar las filas a confirmar (si se enviaron filas editadas o si leemos de grade_import_rows)
    let rowsToProcess: ValidatedGradeRow[] = [];

    if (Array.isArray(providedRows) && providedRows.length > 0) {
      rowsToProcess = providedRows;
    } else {
      const dbRows = await db
        .select()
        .from(gradeImportRows)
        .where(eq(gradeImportRows.importId, importId));

      rowsToProcess = dbRows.map((r, idx) => ({
        originalRowIndex: idx + 1,
        studentCode: r.rawStudentCode || '',
        rawName: r.rawName || undefined,
        subject: r.subject || '',
        area: '',
        period: r.period || '2025-1',
        rawGrade: r.rawGrade || '',
        parsedGrade: r.parsedGrade ? Number(r.parsedGrade) : null,
        gradeScale: 'VIGESIMAL',
        status: (r.status as any) || 'OK',
        issues: (r.issues as any) || [],
        confidence: Number(r.confidence || '1.0'),
      }));
    }

    // Filtrar solo filas válidas (OK o WARNING sin errores fatales)
    const validRows = rowsToProcess.filter(
      (r) => r.status !== 'ERROR' && r.parsedGrade !== null && r.studentCode
    );

    if (validRows.length === 0) {
      return NextResponse.json(
        { error: 'No hay filas válidas para confirmar o todas presentan errores pendientes de corrección.' },
        { status: 400 }
      );
    }

    // 3. Cachear o buscar estudiantes existentes del colegio
    const existingStudents = await db
      .select()
      .from(students)
      .where(eq(students.schoolId, schoolId));

    const studentMap = new Map<string, string>();
    for (const s of existingStudents) {
      studentMap.set(s.studentCode.trim().toUpperCase(), s.id);
    }

    // 4. Asegurar que cada estudiante exista o crearlo
    const recordsToInsert = [];

    for (const row of validRows) {
      const normCode = row.studentCode.trim().toUpperCase();
      let studentId = studentMap.get(normCode);

      if (!studentId) {
        // Crear estudiante si no existía previamente
        const [newStudent] = await db
          .insert(students)
          .values({
            schoolId,
            studentCode: normCode,
            fullName: row.rawName?.trim() || `Estudiante ${normCode}`,
            consentStatus: 'PENDING',
          })
          .returning();

        studentId = newStudent.id;
        studentMap.set(normCode, studentId);
      }

      recordsToInsert.push({
        id: crypto.randomUUID(),
        studentId,
        importId,
        period: row.period,
        subject: row.subject,
        area: row.area || 'General',
        grade: String(row.parsedGrade),
        confirmedAt: new Date(),
      });
    }

    // 5. Insertar registros académicos en chunks
    const chunkSize = 100;
    for (let i = 0; i < recordsToInsert.length; i += chunkSize) {
      await db.insert(academicRecords).values(recordsToInsert.slice(i, i + chunkSize));
    }

    // 6. Actualizar estado de la importación a CONFIRMED
    await db
      .update(gradeImports)
      .set({
        status: 'CONFIRMED',
        confirmedAt: new Date(),
        stats: {
          confirmedRows: recordsToInsert.length,
          totalProvided: rowsToProcess.length,
        },
      })
      .where(eq(gradeImports.id, importId));

    // 7. Registro de auditoría
    await db.insert(auditLog).values({
      id: crypto.randomUUID(),
      action: 'IMPORT_CONFIRMED',
      targetType: 'grade_imports',
      targetId: importId,
      metadata: {
        schoolId,
        confirmedRows: recordsToInsert.length,
      },
    });

    return NextResponse.json({
      success: true,
      importId,
      confirmedCount: recordsToInsert.length,
      message: `Se han integrado exitosamente ${recordsToInsert.length} calificaciones en los expedientes académicos.`,
    });
  } catch (error: any) {
    console.error('[API Confirmar Notas] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al confirmar las notas escolares.' },
      { status: 500 }
    );
  }
}
