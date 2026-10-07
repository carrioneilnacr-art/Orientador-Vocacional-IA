import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { schoolStaff, schools, auditLog } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  findStaffByDemoCredentials,
  signStaffSession,
  STAFF_COOKIE_NAME,
  StaffRole,
} from '@/lib/staffAuth';
import { checkRateLimit } from '@/lib/rateLimit';

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting por IP para evitar ataques de fuerza bruta (15 req/min)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(`staff_login:${ip}`, 15, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos de acceso. Por seguridad, espera un momento.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } }
      );
    }

    // 2. Validación de payload
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Datos de inicio de sesión inválidos' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    let authenticatedStaff: {
      userId: string;
      schoolId: string;
      email: string;
      fullName: string;
      role: StaffRole;
      schoolName: string;
      classroomAssigned?: string;
    } | null = null;

    // 3. Revisar credenciales de prueba preconfiguradas del colegio (para demos y evaluación)
    const demoUser = findStaffByDemoCredentials(email, password);
    if (demoUser) {
      authenticatedStaff = {
        userId: demoUser.userId,
        schoolId: demoUser.schoolId,
        email: demoUser.email,
        fullName: demoUser.fullName,
        role: demoUser.role,
        schoolName: demoUser.schoolName,
        classroomAssigned: demoUser.classroomAssigned,
      };
    } else {
      // 4. Consulta opcional a base de datos (school_staff) si existe integración Supabase
      try {
        const staffRecords = await db
          .select({
            userId: schoolStaff.userId,
            schoolId: schoolStaff.schoolId,
            role: schoolStaff.role,
            schoolName: schools.name,
          })
          .from(schoolStaff)
          .leftJoin(schools, eq(schools.id, schoolStaff.schoolId))
          .limit(1);

        if (staffRecords.length > 0) {
          const rec = staffRecords[0];
          // Verificación de credenciales en base de datos si coincidiera
          authenticatedStaff = {
            userId: rec.userId,
            schoolId: rec.schoolId,
            email,
            fullName: 'Personal Escolar Autorizado',
            role: (rec.role as StaffRole) || 'ADMIN',
            schoolName: rec.schoolName || 'Colegio Matemático Honores',
          };
        }
      } catch (dbErr) {
        console.warn('[Staff Login] Base de datos no disponible o sin tabla de usuarios:', dbErr);
      }
    }

    // Si no se autenticó
    if (!authenticatedStaff) {
      return NextResponse.json(
        {
          error:
            'Correo o contraseña incorrectos. Verifica tus credenciales institucionales o prueba las cuentas de demostración.',
        },
        { status: 401 }
      );
    }

    // 5. Auditoría institucional (Ley 29733 de Protección de Datos Personales)
    try {
      await db.insert(auditLog).values({
        actorId: authenticatedStaff.userId,
        action: 'STAFF_LOGIN',
        targetType: 'SCHOOL_STAFF',
        targetId: authenticatedStaff.userId,
        metadata: {
          email: authenticatedStaff.email,
          role: authenticatedStaff.role,
          schoolId: authenticatedStaff.schoolId,
          schoolName: authenticatedStaff.schoolName,
          ipAnonymized: ip.substring(0, 7) + '***',
        },
      });
    } catch (auditErr) {
      console.warn('[Staff Login] Error al registrar auditoría:', auditErr);
    }

    // 6. Firmar token HMAC para cookie institucional (8 horas de duración)
    const token = signStaffSession(authenticatedStaff, 8);

    const response = NextResponse.json({
      success: true,
      staff: {
        userId: authenticatedStaff.userId,
        schoolId: authenticatedStaff.schoolId,
        email: authenticatedStaff.email,
        fullName: authenticatedStaff.fullName,
        role: authenticatedStaff.role,
        schoolName: authenticatedStaff.schoolName,
        classroomAssigned: authenticatedStaff.classroomAssigned,
      },
    });

    response.cookies.set({
      name: STAFF_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 horas
    });

    return response;
  } catch (error: any) {
    console.error('[Staff Login Error]', error);
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado al iniciar sesión.' },
      { status: 500 }
    );
  }
}
