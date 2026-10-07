import { NextRequest, NextResponse } from 'next/server';
import { verifyStudentSession, STUDENT_COOKIE_NAME } from '@/lib/studentAuth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const payload = verifyStudentSession(token);
    if (!payload) {
      const response = NextResponse.json({ authenticated: false });
      response.cookies.delete(STUDENT_COOKIE_NAME);
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      student: {
        id: payload.studentId,
        schoolId: payload.schoolId,
        studentCode: payload.studentCode,
        fullName: payload.fullName,
        consentStatus: payload.consentStatus,
        schoolName: payload.schoolName,
        classroom: payload.classroom,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada correctamente' });
  response.cookies.delete(STUDENT_COOKIE_NAME);
  return response;
}
