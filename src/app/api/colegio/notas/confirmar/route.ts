import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { academicPeriods, academicRecords, auditLog, gradeImportChanges, gradeImportRows, gradeImports, studentPeriodSummaries, students } from '@/db/schema';
import { mapSubjectToArea, normalizeGrade, type ParsedGradeRow } from '@/lib/gradeParser';
import { validateGradeRows } from '@/lib/gradeValidator';
import { getActiveStaffSessionFromRequest, hasStaffPermission } from '@/lib/staffAuth';
import { z } from 'zod';

export const maxDuration = 60;

const inputSchema = z.object({
  importId: z.string().uuid(),
  rows: z.array(z.object({
    originalRowIndex: z.number().int().positive(),
    studentCode: z.string().max(100), rawName: z.string().max(200).optional(),
    subject: z.string().max(200), period: z.string().max(30), rawGrade: z.string().max(30),
  })).min(1).max(5000),
});

function periodParts(value: string): { year: number; bimester: number } | null {
  const match = value.trim().toUpperCase().match(/^(20\d{2})[-_ ]?B([1-4])$/);
  return match ? { year: Number(match[1]), bimester: Number(match[2]) } : null;
}

export async function POST(req: NextRequest) {
  const session = await getActiveStaffSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Inicia sesión para continuar.' }, { status: 401 });
  if (!hasStaffPermission(session.role, 'grades:confirm')) return NextResponse.json({ error: 'No tienes permiso para confirmar calificaciones.' }, { status: 403 });
  const parsed = inputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Datos de importación inválidos.' }, { status: 400 });
  const { importId, rows } = parsed.data;
  const [existingImport] = await db.select().from(gradeImports).where(and(eq(gradeImports.id, importId), eq(gradeImports.schoolId, session.schoolId))).limit(1);
  if (!existingImport) return NextResponse.json({ error: 'Importación no encontrada.' }, { status: 404 });
  if (existingImport.status !== 'NEEDS_REVIEW') return NextResponse.json({ error: 'Esta importación ya fue procesada.' }, { status: 409 });

  const storedRows = await db.select({ id: gradeImportRows.id }).from(gradeImportRows).where(eq(gradeImportRows.importId, importId));
  const positions = rows.map((row) => row.originalRowIndex);
  if (rows.length > storedRows.length || new Set(positions).size !== rows.length) return NextResponse.json({ error: 'La vista previa no coincide con el archivo cargado.' }, { status: 400 });

  const roster = await db.select({ id: students.id, studentCode: students.studentCode, fullName: students.fullName })
    .from(students).where(eq(students.schoolId, session.schoolId));
  const normalized: ParsedGradeRow[] = rows.map((row) => {
    const grade = normalizeGrade(row.rawGrade);
    return { ...row, area: mapSubjectToArea(row.subject), parsedGrade: grade.grade, gradeScale: grade.scale };
  });
  const validation = validateGradeRows(normalized, { existingStudents: roster, requireKnownStudents: true });
  if (!validation.canConfirm) return NextResponse.json({ error: 'Corrige las filas con errores antes de confirmar.', summary: validation }, { status: 400 });

  const knownStudents = new Map(roster.map((student) => [student.studentCode.trim().toUpperCase(), student.id]));
  const periods = await db.select().from(academicPeriods).where(eq(academicPeriods.schoolId, session.schoolId));
  const periodMap = new Map(periods.map((period) => [`${period.academicYear}-B${period.bimester}`, period.id]));
  const records = validation.rows.map((row) => {
    const parts = periodParts(row.period);
    return { studentId: knownStudents.get(row.studentCode.toUpperCase()),
      periodId: parts ? periodMap.get(`${parts.year}-B${parts.bimester}`) : undefined,
      subject: row.subject.trim(), area: row.area, grade: row.parsedGrade,
      period: parts ? `${parts.year}-B${parts.bimester}` : row.period };
  });
  if (records.some((row) => !row.studentId || !row.periodId || row.grade === null)) return NextResponse.json({ error: 'Usa códigos matriculados y periodos del año actual (por ejemplo, 2026-B1).' }, { status: 400 });
  const keys = records.map((row) => `${row.studentId}|${row.periodId}|${row.subject.toLowerCase()}`);
  if (new Set(keys).size !== keys.length) return NextResponse.json({ error: 'Hay notas repetidas para un mismo estudiante, bimestre y curso.' }, { status: 400 });

  try {
    await db.transaction(async (tx) => {
      const [lockedImport] = await tx.select().from(gradeImports).where(eq(gradeImports.id, importId)).for('update');
      if (lockedImport?.status !== 'NEEDS_REVIEW') throw new Error('IMPORT_ALREADY_PROCESSED');
      const touchedPeriods = new Set<string>();
      for (const row of records) {
        const studentId = row.studentId!;
        const periodId = row.periodId!;
        touchedPeriods.add(periodId);
        const [previous] = await tx.select().from(academicRecords).where(and(eq(academicRecords.studentId, studentId), eq(academicRecords.periodId, periodId), eq(academicRecords.subject, row.subject))).limit(1);
        await tx.insert(gradeImportChanges).values({ importId, studentId, periodId, subject: row.subject,
          wasExisting: Boolean(previous), previousGrade: previous?.grade ?? null,
          previousArea: previous?.area ?? null, previousImportId: previous?.importId ?? null });
        if (previous) await tx.update(academicRecords).set({ grade: String(row.grade), area: row.area, importId, confirmedAt: new Date() }).where(eq(academicRecords.id, previous.id));
        else await tx.insert(academicRecords).values({ studentId, periodId, importId, period: row.period,
          subject: row.subject, area: row.area, grade: String(row.grade), confirmedAt: new Date() });
      }
      for (const periodId of touchedPeriods) {
        const allGrades = await tx.select({ studentId: academicRecords.studentId, grade: academicRecords.grade }).from(academicRecords).where(eq(academicRecords.periodId, periodId));
        const grouped = new Map<string, number[]>();
        for (const grade of allGrades) {
          const list = grouped.get(grade.studentId) ?? [];
          if (grade.grade !== null) list.push(Number(grade.grade));
          grouped.set(grade.studentId, list);
        }
        const averages = [...grouped].filter(([, grades]) => grades.length).map(([studentId, grades]) => ({ studentId,
          average: grades.reduce((sum, grade) => sum + grade, 0) / grades.length })).sort((a, b) => b.average - a.average);
        for (const item of averages) {
          const rank = averages.findIndex((candidate) => candidate.average === item.average) + 1;
          await tx.insert(studentPeriodSummaries).values({ studentId: item.studentId, periodId,
            average: item.average.toFixed(2), classRank: rank })
            .onConflictDoUpdate({ target: [studentPeriodSummaries.studentId, studentPeriodSummaries.periodId],
              set: { average: item.average.toFixed(2), classRank: rank, confirmedAt: new Date() } });
        }
      }
      await tx.update(gradeImports).set({ status: 'CONFIRMED', confirmedAt: new Date(),
        stats: { confirmedRows: records.length, totalProvided: rows.length } }).where(eq(gradeImports.id, importId));
      await tx.insert(auditLog).values({ actorId: session.userId, action: 'IMPORT_CONFIRMED', targetType: 'grade_imports',
        targetId: importId, metadata: { schoolId: session.schoolId, confirmedRows: records.length } });
    });
    return NextResponse.json({ success: true, importId, confirmedCount: records.length,
      message: `Se integraron ${records.length} calificaciones al historial académico.` });
  } catch (error) {
    console.error('[Confirmar Notas]', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'No se pudo confirmar la importación.' }, { status: 409 });
  }
}
