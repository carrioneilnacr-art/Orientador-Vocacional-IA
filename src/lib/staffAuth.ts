import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { schoolStaff } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export const STAFF_COOKIE_NAME = 'chaski_staff_session';

function getAuthSecret(): string | null {
  const secret = process.env.STAFF_AUTH_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

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
 * Cuentas de personal de prueba del Colegio Matemático Honores
 * Diseñadas para evaluación y demostración guiada
 */
/**
 * Firma un payload de sesión con HMAC-SHA256 para el personal del colegio.
 * Por defecto dura 8 horas (jornada laboral escolar).
 */
export function signStaffSession(
  payload: Omit<StaffSessionPayload, 'issuedAt' | 'expiresAt'>,
  expiresInHours = 8
): string {
  const authSecret = getAuthSecret();
  if (!authSecret) {
    throw new Error('STAFF_AUTH_SECRET must be configured with at least 32 characters.');
  }
  const issuedAt = Date.now();
  const expiresAt = issuedAt + expiresInHours * 60 * 60 * 1000;

  const fullPayload: StaffSessionPayload = {
    ...payload,
    issuedAt,
    expiresAt,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', authSecret)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifica y decodifica un token de sesión de personal escolar.
 * Retorna null si la firma es inválida, si expiró o está corrupto.
 */
export function verifyStaffSession(token: string): StaffSessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const authSecret = getAuthSecret();
  if (!authSecret) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', authSecret)
    .update(payloadBase64)
    .digest('base64url');

  // Comparación segura en tiempo constante contra timing attacks
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr) as StaffSessionPayload;

    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return null;
    }

    if (
      !payload.userId || !payload.schoolId || !payload.email || !payload.fullName ||
      !payload.schoolName || !payload.role ||
      !['ADMIN', 'PSICOLOGO', 'TUTOR', 'DIRECTOR'].includes(payload.role) ||
      !payload.issuedAt || payload.issuedAt > Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extrae y valida la sesión de personal a partir de una solicitud HTTP entrante.
 */
export function getStaffSessionFromRequest(req: NextRequest): StaffSessionPayload | null {
  const cookie = req.cookies.get(STAFF_COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifyStaffSession(cookie.value);
}

/** Rechecks the current school and role so removed staff access expires immediately. */
export async function getActiveStaffSessionFromRequest(
  req: NextRequest
): Promise<StaffSessionPayload | null> {
  const session = getStaffSessionFromRequest(req);
  if (!session) return null;

  try {
    const [membership] = await db
      .select({ role: schoolStaff.role })
      .from(schoolStaff)
      .where(and(
        eq(schoolStaff.userId, session.userId),
        eq(schoolStaff.schoolId, session.schoolId)
      ))
      .limit(1);

    if (!membership || !['ADMIN', 'PSICOLOGO', 'TUTOR', 'DIRECTOR'].includes(membership.role)) {
      return null;
    }
    return { ...session, role: membership.role as StaffRole };
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
