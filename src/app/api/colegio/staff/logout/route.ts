import { NextRequest, NextResponse } from 'next/server';
import { verifyStaffSession, STAFF_COOKIE_NAME } from '@/lib/staffAuth';
import { db } from '@/db';
import { auditLog } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(STAFF_COOKIE_NAME)?.value;
    if (token) {
      const payload = verifyStaffSession(token);
      if (payload) {
        try {
          await db.insert(auditLog).values({
            actorId: payload.userId,
            action: 'STAFF_LOGOUT',
            targetType: 'SCHOOL_STAFF',
            targetId: payload.userId,
            metadata: {
              email: payload.email,
              role: payload.role,
              schoolId: payload.schoolId,
            },
          });
        } catch (auditErr) {
          console.warn('[Staff Logout] No se pudo registrar auditoría:', auditErr);
        }
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Sesión del personal cerrada exitosamente',
    });

    response.cookies.delete(STAFF_COOKIE_NAME);
    return response;
  } catch (error) {
    const response = NextResponse.json({ success: true, message: 'Sesión finalizada' });
    response.cookies.delete(STAFF_COOKIE_NAME);
    return response;
  }
}
