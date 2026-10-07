import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { students, schools, classrooms, userSessions, auditLog } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { hashAccessCode, signStudentSession, STUDENT_COOKIE_NAME } from '@/lib/studentAuth';
import { checkRateLimit } from '@/lib/rateLimit';

const accessSchema = z.object({
  accessCode: z.string().min(4, 'El código debe tener al menos 4 caracteres').max(30),
  testId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting por IP (30 req/min)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera un momento antes de volver a intentar.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } }
      );
    }

    // 2. Validación de payload
    const body = await req.json();
    const parsed = accessSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Datos de acceso inválidos' },
        { status: 400 }
      );
    }

    const { accessCode, testId } = parsed.data;
    const codeHash = hashAccessCode(accessCode);

    // 3. Búsqueda en base de datos
    let studentResult: any = null;
    let schoolResult: any = null;
    let classroomResult: any = null;

    try {
      const foundStudents = await db
        .select()
        .from(students)
        .where(eq(students.accessCodeHash, codeHash))
        .limit(1);

      if (foundStudents.length > 0) {
        studentResult = foundStudents[0];

        // Obtener colegio
        const foundSchools = await db
          .select()
          .from(schools)
          .where(eq(schools.id, studentResult.schoolId))
          .limit(1);
        schoolResult = foundSchools[0] || null;

        // Obtener aula si existe
        if (studentResult.classroomId) {
          const foundClassrooms = await db
            .select()
            .from(classrooms)
            .where(eq(classrooms.id, studentResult.classroomId))
            .limit(1);
          classroomResult = foundClassrooms[0] || null;
        }
      }
    } catch (dbError) {
      console.warn('[Acceso Alumno] Error al consultar base de datos, usando simulación segura:', dbError);
    }

    // Si no se encuentra en BD
    if (!studentResult) {
      return NextResponse.json(
        { error: 'Código de acceso no reconocido. Verifica el código entregado por tu colegio.' },
        { status: 401 }
      );
    }

    // 4. Vincular test previo si existe testId (Modo Invitado -> Alumno Vinculado)
    let linkedTest = false;
    if (testId) {
      try {
        await db
          .update(userSessions)
          .set({
            studentId: studentResult.id,
            schoolId: studentResult.schoolId,
          })
          .where(or(eq(userSessions.sessionToken, testId), eq(userSessions.id, testId)));
        linkedTest = true;
      } catch (linkError) {
        console.warn('[Acceso Alumno] No se pudo vincular la sesión previa:', linkError);
      }
    }

    // 5. Registrar en Audit Log (Cumplimiento Ley 29733)
    try {
      await db.insert(auditLog).values({
        actorId: studentResult.id,
        action: 'STUDENT_LOGIN_ACCESS_CODE',
        targetType: 'STUDENT',
        targetId: studentResult.id,
        metadata: {
          studentCode: studentResult.studentCode,
          schoolId: studentResult.schoolId,
          linkedTest,
          ipAnonymized: ip.substring(0, 7) + '***',
        },
      });
    } catch (auditError) {
      console.warn('[Acceso Alumno] Error al registrar auditoría:', auditError);
    }

    // 6. Firmar Cookie de Sesión segura (httpOnly)
    const classroomName = classroomResult
      ? `${classroomResult.grade}° "${classroomResult.section}" (${classroomResult.year})`
      : undefined;

    const token = signStudentSession({
      studentId: studentResult.id,
      schoolId: studentResult.schoolId,
      studentCode: studentResult.studentCode,
      fullName: studentResult.fullName,
      consentStatus: studentResult.consentStatus as 'PENDING' | 'GRANTED' | 'REVOKED',
      schoolName: schoolResult?.name || 'Colegio',
      classroom: classroomName,
    });

    const response = NextResponse.json({
      success: true,
      student: {
        id: studentResult.id,
        fullName: studentResult.fullName,
        studentCode: studentResult.studentCode,
        consentStatus: studentResult.consentStatus,
        schoolName: schoolResult?.name || 'Colegio',
        classroom: classroomName,
      },
      linkedTest,
    });

    // Configurar cookie de sesión (7 días)
    response.cookies.set({
      name: STUDENT_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('[Acceso Alumno Error]', error);
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado al procesar tu código.' },
      { status: 500 }
    );
  }
}
