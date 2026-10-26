import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { students, auditLog } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { verifyStudentSession, signStudentSession, STUDENT_COOKIE_NAME } from '@/lib/studentAuth';

const consentSchema = z.object({
  consentGranted: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const session = verifyStudentSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Sesión expirada o inválida' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = consentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos de consentimiento inválidos' }, { status: 400 });
    }

    const newStatus = parsed.data.consentGranted ? 'GRANTED' : 'REVOKED';

    try {
      const updated = await db
        .update(students)
        .set({
          consentStatus: newStatus,
          consentAt: new Date(),
        })
        .where(and(eq(students.id, session.studentId), eq(students.schoolId, session.schoolId)))
        .returning({ id: students.id });

      if (updated.length === 0) {
        return NextResponse.json({ error: 'No se encontró el registro del estudiante.' }, { status: 404 });
      }

      await db.insert(auditLog).values({
        actorId: session.studentId,
        action: 'PARENTAL_CONSENT_UPDATED',
        targetType: 'STUDENT',
        targetId: session.studentId,
        metadata: {
          consentStatus: newStatus,
          studentCode: session.studentCode,
          schoolId: session.schoolId,
        },
      });
    } catch (dbErr) {
      console.error('[Consentimiento] Error al actualizar BD:', dbErr instanceof Error ? dbErr.message : 'unknown error');
      return NextResponse.json({ error: 'No se pudo guardar el consentimiento. Inténtalo nuevamente.' }, { status: 503 });
    }

    // Actualizar cookie con nuevo consentStatus
    const updatedToken = signStudentSession({
      ...session,
      consentStatus: newStatus,
    });

    const res = NextResponse.json({
      success: true,
      consentStatus: newStatus,
      message: parsed.data.consentGranted
        ? 'Consentimiento registrado exitosamente.'
        : 'Consentimiento revocado.',
    });

    res.cookies.set({
      name: STUDENT_COOKIE_NAME,
      value: updatedToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error('[Consentimiento Error]', err instanceof Error ? err.message : 'unknown error');
    return NextResponse.json({ error: 'Error al actualizar consentimiento' }, { status: 500 });
  }
}
