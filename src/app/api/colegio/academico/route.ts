import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import {
  academicPeriods,
  academicRecords,
  classrooms,
  studentPeriodSummaries,
  students,
} from '@/db/schema';
import { getActiveStaffSessionFromRequest, hasStaffPermission } from '@/lib/staffAuth';

const PERIODS = ['B1', 'B2', 'B3', 'B4'] as const;
type Period = typeof PERIODS[number];

function percentage(numerator: number, denominator: number) {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function numeric(value: string | null) {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET(req: NextRequest) {
  const session = await getActiveStaffSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Sesión no iniciada.' }, { status: 401 });
  }
  if (!['ADMIN', 'DIRECTOR'].includes(session.role)) {
    return NextResponse.json({ error: 'Tu rol no permite consultar el historial académico.' }, { status: 403 });
  }

  const requested = req.nextUrl.searchParams.get('period')?.toUpperCase();
  if (!requested || !PERIODS.includes(requested as Period)) {
    return NextResponse.json({ error: 'Selecciona un bimestre válido entre B1 y B4.' }, { status: 400 });
  }
  const period = requested as Period;
  const bimester = Number(period.slice(1));

  try {
    const [academicPeriod] = await db
      .select({
        id: academicPeriods.id,
        academicYear: academicPeriods.academicYear,
      })
      .from(academicPeriods)
      .where(and(
        eq(academicPeriods.schoolId, session.schoolId),
        eq(academicPeriods.bimester, bimester)
      ))
      .orderBy(desc(academicPeriods.academicYear))
      .limit(1);

    const roster = await db
      .select({
        id: students.id,
        studentCode: students.studentCode,
        isDemo: students.isDemo,
        fullName: students.fullName,
        grade: classrooms.grade,
        section: classrooms.section,
      })
      .from(students)
      .leftJoin(classrooms, eq(classrooms.id, students.classroomId))
      .where(and(eq(students.schoolId, session.schoolId), eq(students.active, true)))
      .orderBy(students.fullName);

    if (!academicPeriod) {
      return NextResponse.json({
        period,
        schoolName: session.schoolName,
        academicYear: new Date().getFullYear(),
        totalStudents: roster.length,
        classroomAverage: null,
        attendanceAverage: null,
        canImport: hasStaffPermission(session.role, 'grades:import'),
        students: [],
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const summaries = await db
      .select({
        studentId: studentPeriodSummaries.studentId,
        average: studentPeriodSummaries.average,
        classRank: studentPeriodSummaries.classRank,
        attendanceDays: studentPeriodSummaries.attendanceDays,
        absenceDays: studentPeriodSummaries.absenceDays,
        lateCount: studentPeriodSummaries.lateCount,
        punctualityRating: studentPeriodSummaries.punctualityRating,
        uniformRating: studentPeriodSummaries.uniformRating,
        behaviorRating: studentPeriodSummaries.behaviorRating,
        responsibilityRating: studentPeriodSummaries.responsibilityRating,
        observation: studentPeriodSummaries.observation,
      })
      .from(studentPeriodSummaries)
      .where(eq(studentPeriodSummaries.periodId, academicPeriod.id));

    const gradeRows = await db
      .select({
        studentId: academicRecords.studentId,
        subject: academicRecords.subject,
        area: academicRecords.area,
        grade: academicRecords.grade,
      })
      .from(academicRecords)
      .where(eq(academicRecords.periodId, academicPeriod.id))
      .orderBy(academicRecords.area, academicRecords.subject);

    const summariesByStudent = new Map(summaries.map((summary) => [summary.studentId, summary]));
    const gradesByStudent = new Map<string, Array<{ subject: string; area: string; grade: number | null }>>();
    for (const row of gradeRows) {
      const current = gradesByStudent.get(row.studentId) ?? [];
      current.push({ subject: row.subject, area: row.area, grade: numeric(row.grade) });
      gradesByStudent.set(row.studentId, current);
    }

    const studentRows = roster.map((student) => {
      const summary = summariesByStudent.get(student.id);
      const attendanceDays = summary?.attendanceDays ?? 0;
      const absenceDays = summary?.absenceDays ?? 0;
      return {
        id: student.id,
        studentCode: student.studentCode,
        isDemo: student.isDemo,
        fullName: student.fullName,
        classroom: student.grade && student.section ? `${student.grade}.º ${student.section}` : 'Sin aula',
        average: numeric(summary?.average ?? null),
        rank: summary?.classRank ?? null,
        attendancePercentage: percentage(attendanceDays, attendanceDays + absenceDays),
        punctualityPercentage: percentage(Math.max(0, attendanceDays - (summary?.lateCount ?? 0)), attendanceDays),
        presentationRating: summary?.uniformRating ?? null,
        conductRating: summary?.behaviorRating ?? null,
        responsibilityRating: summary?.responsibilityRating ?? null,
        lateCount: summary?.lateCount ?? null,
        absenceDays: summary?.absenceDays ?? null,
        observation: summary?.observation ?? null,
        grades: gradesByStudent.get(student.id) ?? [],
      };
    }).sort((left, right) => (left.rank ?? Number.MAX_SAFE_INTEGER) - (right.rank ?? Number.MAX_SAFE_INTEGER));

    const averages = studentRows.map((student) => student.average).filter((value): value is number => value !== null);
    const attendance = studentRows.map((student) => student.attendancePercentage).filter((value): value is number => value !== null);

    return NextResponse.json({
      period,
      schoolName: session.schoolName,
      academicYear: academicPeriod.academicYear,
      totalStudents: studentRows.length,
      classroomAverage: averages.length ? Math.round((averages.reduce((sum, value) => sum + value, 0) / averages.length) * 10) / 10 : null,
      attendanceAverage: attendance.length ? Math.round((attendance.reduce((sum, value) => sum + value, 0) / attendance.length) * 10) / 10 : null,
      canImport: hasStaffPermission(session.role, 'grades:import'),
      students: studentRows,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[Academic History] Read failed:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ error: 'No pudimos consultar el historial académico.' }, { status: 503 });
  }
}
