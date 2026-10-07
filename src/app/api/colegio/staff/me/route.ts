import { NextRequest, NextResponse } from 'next/server';
import { verifyStaffSession, STAFF_COOKIE_NAME } from '@/lib/staffAuth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(STAFF_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const payload = verifyStaffSession(token);
    if (!payload) {
      const response = NextResponse.json({ authenticated: false });
      response.cookies.delete(STAFF_COOKIE_NAME);
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      staff: {
        userId: payload.userId,
        schoolId: payload.schoolId,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role,
        schoolName: payload.schoolName,
        classroomAssigned: payload.classroomAssigned,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
