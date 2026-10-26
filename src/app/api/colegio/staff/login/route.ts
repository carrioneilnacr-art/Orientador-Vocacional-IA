import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { auditLog, schoolStaff, schools } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rateLimit';
import { signStaffSession, STAFF_COOKIE_NAME, StaffRole } from '@/lib/staffAuth';
import { resolveStaffLoginEmail } from '@/lib/staffLoginIdentity';

const loginSchema = z.object({
  identifier: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(256),
});

const isStaffRole = (role: string): role is StaffRole =>
  ['ADMIN', 'PSICOLOGO', 'TUTOR', 'DIRECTOR'].includes(role);

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateCheck = checkRateLimit(`staff_login:${ip}`, 10, 60);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera un momento antes de volver a intentar.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse({
    identifier: body?.identifier ?? body?.email,
    password: body?.password,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Usuario o contraseña inválidos.' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey || !process.env.STAFF_AUTH_SECRET || process.env.STAFF_AUTH_SECRET.length < 32) {
    return NextResponse.json({ error: 'El acceso institucional no está configurado.' }, { status: 503 });
  }

  try {
    let loginEmail = resolveStaffLoginEmail(parsed.data.identifier);
    if (!loginEmail && /^[a-z0-9._-]{3,64}$/i.test(parsed.data.identifier)) {
      const [identity] = await db
        .select({ loginEmail: schoolStaff.loginEmail })
        .from(schoolStaff)
        .where(eq(schoolStaff.username, parsed.data.identifier.toLowerCase()))
        .limit(1);
      loginEmail = identity?.loginEmail ?? null;
    }
    if (!loginEmail) {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 });
    }
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
      email: loginEmail,
      password: parsed.data.password,
    });
    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 });
    }

    const [staff] = await db
      .select({
        userId: schoolStaff.userId,
        schoolId: schoolStaff.schoolId,
        role: schoolStaff.role,
        schoolName: schools.name,
      })
      .from(schoolStaff)
      .innerJoin(schools, eq(schools.id, schoolStaff.schoolId))
      .where(eq(schoolStaff.userId, authData.user.id))
      .limit(1);

    if (!staff || !isStaffRole(staff.role)) {
      return NextResponse.json({ error: 'Esta cuenta no tiene acceso al portal escolar.' }, { status: 403 });
    }

    const email = authData.user.email ?? loginEmail;
    const sessionPayload = {
      userId: staff.userId,
      schoolId: staff.schoolId,
      email,
      fullName: typeof authData.user.user_metadata?.full_name === 'string'
        ? authData.user.user_metadata.full_name
        : email,
      role: staff.role,
      schoolName: staff.schoolName,
    };
    const token = signStaffSession(sessionPayload, 8);

    await db.insert(auditLog).values({
      actorId: staff.userId,
      action: 'STAFF_LOGIN',
      targetType: 'SCHOOL_STAFF',
      targetId: staff.userId,
      metadata: { role: staff.role, schoolId: staff.schoolId },
    });

    const response = NextResponse.json({ success: true, staff: sessionPayload });
    response.cookies.set({
      name: STAFF_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.error('[Staff Login] Authentication failed:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ error: 'No se pudo iniciar sesión. Inténtalo más tarde.' }, { status: 503 });
  }
}
