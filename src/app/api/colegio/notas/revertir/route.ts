import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { academicRecords, auditLog, gradeImportChanges, gradeImports, studentPeriodSummaries } from '@/db/schema';
import { getActiveStaffSessionFromRequest, hasStaffPermission } from '@/lib/staffAuth';

export async function POST(req: NextRequest) {
  const session = await getActiveStaffSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Inicia sesión para continuar.' }, { status: 401 });
  if (!hasStaffPermission(session.role, 'grades:confirm')) return NextResponse.json({ error: 'No tienes permiso para revertir importaciones.' }, { status: 403 });
  const parsed = z.object({ importId: z.string().uuid() }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Identificador inválido.' }, { status: 400 });
  const importId = parsed.data.importId;
  const [record] = await db.select().from(gradeImports).where(and(eq(gradeImports.id, importId), eq(gradeImports.schoolId, session.schoolId))).limit(1);
  if (!record) return NextResponse.json({ error: 'Importación no encontrada.' }, { status: 404 });
  if (record.status !== 'CONFIRMED') return NextResponse.json({ error: 'Solo se puede revertir una importación confirmada.' }, { status: 409 });

  try {
    const revertedCount = await db.transaction(async (tx) => {
      const [locked] = await tx.select().from(gradeImports).where(eq(gradeImports.id, importId)).for('update');
      if (locked?.status !== 'CONFIRMED') throw new Error('IMPORT_ALREADY_PROCESSED');
      const changes = await tx.select().from(gradeImportChanges).where(eq(gradeImportChanges.importId, importId));
      const touched = new Set<string>();
      for (const change of changes) {
        touched.add(change.periodId);
        const [current] = await tx.select().from(academicRecords).where(and(
          eq(academicRecords.studentId, change.studentId), eq(academicRecords.periodId, change.periodId), eq(academicRecords.subject, change.subject))).limit(1);
        if (!current || current.importId !== importId) throw new Error('GRADE_CHANGED_AFTER_IMPORT');
        if (change.wasExisting) await tx.update(academicRecords).set({ grade: change.previousGrade,
          area: change.previousArea ?? current.area, importId: change.previousImportId, confirmedAt: new Date() })
          .where(eq(academicRecords.id, current.id));
        else await tx.delete(academicRecords).where(eq(academicRecords.id, current.id));
      }
      for (const periodId of touched) {
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
      await tx.update(gradeImports).set({ status: 'REVERTED' }).where(eq(gradeImports.id, importId));
      await tx.insert(auditLog).values({ actorId: session.userId, action: 'IMPORT_REVERTED', targetType: 'grade_imports',
        targetId: importId, metadata: { schoolId: session.schoolId, revertedCount: changes.length } });
      return changes.length;
    });
    return NextResponse.json({ success: true, importId, revertedCount,
      message: `Se revirtieron ${revertedCount} calificaciones.` });
  } catch (error) {
    console.error('[Revertir Notas]', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'No se pudo revertir. Comprueba si alguna nota fue modificada después.' }, { status: 409 });
  }
}
