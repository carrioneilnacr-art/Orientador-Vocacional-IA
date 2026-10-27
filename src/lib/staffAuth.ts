import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { schoolStaff, schools } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const STAFF_COOKIE_NAME = 'chaski_staff_session';

export type StaffRole = 'ADMIN' | 'PSICOLOGO' | 'TUTOR' | 'DIRECTOR';

export interface StaffSessionPayload {
  userId: string;
  schoolId: string;
  email: string;
  fullName: string;
  role: StaffRole;
  schoolName: string;
  classroomAssigned?: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Matriz de capacidades RBAC por rol
 */
export const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  ADMIN: [
    'staff:manage',
    'students:manage',
    'grades:import',
    'grades:confirm',
    'audit:view',
    'profiles:view_all',
    'metrics:view',
    'reports:export',
  ],
  DIRECTOR: [
    'metrics:view',
    'metrics:executive',
    'profiles:view_aggregated',
    'audit:summary',
    'reports:export',
  ],
  PSICOLOGO: [
    'profiles:view_all',
    'alerts:manage',
    'tutoring:manage',
    'notes:write',
    'academic:view',
  ],
  TUTOR: [
    'classroom:view_roster',
    'classroom:view_progress',
    'classroom:view_profiles',
    'grades:report_discrepancy',
  ],
};

/**
 * Verifica el access token directamente con Supabase Auth y vuelve a consultar
 * el colegio y el rol. De esta forma una baja o cambio de rol aplica de inmediato.
 */
export async function getActiveStaffSessionFromRequest(
  req: NextRequest
): Promise<StaffSessionPayload | null> {
  const accessToken = req.cookies.get(STAFF_COOKIE_NAME)?.value;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!accessToken || !supabaseUrl || !supabaseAnonKey) return null;

  try {
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data, error } = await supabaseAuth.auth.getUser(accessToken);
    if (error || !data.user?.email) return null;

    const [membership] = await db
      .select({
        schoolId: schoolStaff.schoolId,
        role: schoolStaff.role,
        schoolName: schools.name,
      })
      .from(schoolStaff)
      .innerJoin(schools, eq(schools.id, schoolStaff.schoolId))
      .where(eq(schoolStaff.userId, data.user.id))
      .limit(1);

    if (!membership || !['ADMIN', 'PSICOLOGO', 'TUTOR', 'DIRECTOR'].includes(membership.role)) {
      return null;
    }

    const now = Date.now();
    return {
      userId: data.user.id,
      schoolId: membership.schoolId,
      email: data.user.email,
      fullName: typeof data.user.user_metadata?.full_name === 'string'
        ? data.user.user_metadata.full_name
        : data.user.email,
      role: membership.role as StaffRole,
      schoolName: membership.schoolName,
      issuedAt: now,
      expiresAt: now + 60 * 60 * 1000,
    };
  } catch {
    return null;
  }
}

/**
 * Verifica si un rol específico cumple con los roles requeridos.
 */
export function hasStaffRole(
  userRole: StaffRole,
  requiredRole: StaffRole | StaffRole[]
): boolean {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

/**
 * Helper de autorización RBAC para APIs o Server Components.
 * Devuelve un objeto con bandera de autorización y mensaje si falla.
 */
export function requireStaffRole(
  session: StaffSessionPayload | null,
  allowedRoles: StaffRole | StaffRole[]
): {
  authorized: boolean;
  status: number;
  error?: string;
} {
  if (!session) {
    return {
      authorized: false,
      status: 401,
      error: 'Sesión no iniciada o credenciales vencidas. Por favor inicia sesión.',
    };
  }

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!allowed.includes(session.role)) {
    return {
      authorized: false,
      status: 403,
      error: `Acceso denegado. Se requiere uno de los siguientes roles: ${allowed.join(', ')}`,
    };
  }

  return {
    authorized: true,
    status: 200,
  };
}

export function hasStaffPermission(role: StaffRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Evalúa si un rol puede acceder a un módulo específico del dashboard escolar.
 */
export function canAccessModule(
  role: StaffRole,
  moduleName: 'importador' | 'auditoria' | 'alertas' | 'tutorias' | 'metricas' | 'aula'
): boolean {
  switch (moduleName) {
    case 'importador':
      return role === 'ADMIN';
    case 'auditoria':
      return role === 'ADMIN' || role === 'DIRECTOR';
    case 'alertas':
      return role === 'PSICOLOGO' || role === 'ADMIN';
    case 'tutorias':
      return role === 'PSICOLOGO' || role === 'TUTOR' || role === 'ADMIN';
    case 'metricas':
      return role === 'DIRECTOR' || role === 'ADMIN';
    case 'aula':
      return role === 'TUTOR' || role === 'PSICOLOGO' || role === 'ADMIN';
    default:
      return false;
  }
}
