import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { students, schools, classrooms, userSessions, auditLog } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import {
  GUEST_TEST_COOKIE_NAME,
  hashAccessCode,
  signStudentSession,
  STUDENT_COOKIE_NAME,
  verifyGuestTestSession,
} from '@/lib/studentAuth';
import { checkRateLimit } from '@/lib/rateLimit';
import {linkGuestExploration} from '@/modules/adventure/infrastructure/linkGuestExploration';

const accessSchema = z.object({
  accessCode: z.string().min(4, 'El código debe tener al menos 4 caracteres').max(30),
}).strict();

export async function POST(req: NextRequest) {
  try {
    // Shared school NAT: coarse burst limit; each credential has its own quota.
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = await checkRateLimit(`student_access:ip:${ip}`,300,60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera un momento antes de volver a intentar.' },
        { status: rateCheck.status, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } }
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

    const { accessCode } = parsed.data;
    const guestTest = verifyGuestTestSession(req.cookies.get(GUEST_TEST_COOKIE_NAME)?.value);
    const codeHash = hashAccessCode(accessCode);
    const credentialLimit=await checkRateLimit(`student_access:credential:${codeHash}`,5,60);
    if(!credentialLimit.allowed)return NextResponse.json({error:'Demasiados intentos para este código. Inténtalo en unos momentos.'},{status:credentialLimit.status,headers:{'Retry-After':String(credentialLimit.retryAfter||60)}});

    // 3. Búsqueda en base de datos
    let studentResult: typeof students.$inferSelect | null = null;
    let schoolResult: typeof schools.$inferSelect | null = null;
    let classroomResult: typeof classrooms.$inferSelect | null = null;

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
    } catch {
      console.warn('[Acceso Alumno] Consulta no disponible');
      return NextResponse.json({error:'No pudimos validar el acceso. Inténtalo nuevamente.'},{status:503});
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
    if (guestTest) {
      try {
        const linkedSession = await db
          .update(userSessions)
          .set({
            studentId: studentResult.id,
            schoolId: studentResult.schoolId,
          })
          .where(and(
            eq(userSessions.sessionToken, guestTest.testId),
            isNull(userSessions.studentId),
            isNull(userSessions.schoolId)
          ))
          .returning({ id: userSessions.id });
        linkedTest = linkedSession.length > 0;
      } catch (linkError) {
        console.warn('[Acceso Alumno] No se pudo vincular la sesión previa:', linkError);
      }
    }

    let linkedAdventure=false;
    try{linkedAdventure=await linkGuestExploration(req,studentResult.id,studentResult.schoolId);}catch{console.warn('[Acceso Alumno] No se pudo vincular el recorrido de aventura.');}
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
          linkedAdventure,
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
      linkedAdventure,
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
    response.cookies.delete(GUEST_TEST_COOKIE_NAME);

    return response;
  } catch {
    console.error('[Acceso Alumno] Request unavailable');
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado al procesar tu código.' },
      { status: 503 }
    );
  }
}
