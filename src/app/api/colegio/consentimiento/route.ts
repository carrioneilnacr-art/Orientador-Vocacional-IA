import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { students, auditLog } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
      await db
        .update(students)
        .set({
          consentStatus: newStatus,
          consentAt: new Date(),
        })
        .where(eq(students.id, session.studentId));

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
      console.warn('[Consentimiento] Error al actualizar BD:', dbErr);
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
  } catch (err: any) {
    console.error('[Consentimiento Error]', err);
    return NextResponse.json({ error: 'Error al actualizar consentimiento' }, { status: 500 });
  }
}
