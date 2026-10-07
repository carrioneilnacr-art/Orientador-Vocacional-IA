import crypto from 'crypto';
import { NextRequest } from 'next/server';

export const STAFF_COOKIE_NAME = 'chaski_staff_session';

const AUTH_SECRET =
  process.env.STAFF_AUTH_SECRET ||
  process.env.STUDENT_AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'chaski-staff-secret-salt-2026-peru';

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
export interface DemoStaffUser {
  userId: string;
  schoolId: string;
  email: string;
  password: string; // En producción gestionado por Supabase Auth
  fullName: string;
  role: StaffRole;
  schoolName: string;
  classroomAssigned?: string;
  avatarUrl?: string;
}

export const DEMO_STAFF_ACCOUNTS: DemoStaffUser[] = [
  {
    userId: '11111111-aaaa-1111-aaaa-111111111111',
    schoolId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    email: 'admin@honores.edu.pe',
    password: 'admin123',
    fullName: 'Ing. Miguel Ángel Ramos',
    role: 'ADMIN',
    schoolName: 'Colegio Matemático Honores',
  },
  {
    userId: '22222222-bbbb-2222-bbbb-222222222222',
    schoolId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    email: 'psicologo@honores.edu.pe',
    password: 'psico123',
    fullName: 'Lic. Valeria Torres Salazar',
    role: 'PSICOLOGO',
    schoolName: 'Colegio Matemático Honores',
  },
  {
    userId: '33333333-cccc-3333-cccc-333333333333',
    schoolId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    email: 'tutor@honores.edu.pe',
    password: 'tutor123',
    fullName: 'Prof. Roberto Sánchez Vega',
    role: 'TUTOR',
    schoolName: 'Colegio Matemático Honores',
    classroomAssigned: '5° "A" Secundaria',
  },
  {
    userId: '44444444-dddd-4444-dddd-444444444444',
    schoolId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    email: 'director@honores.edu.pe',
    password: 'director123',
    fullName: 'Dr. Fernando Morales Castro',
    role: 'DIRECTOR',
    schoolName: 'Colegio Matemático Honores',
  },
];

/**
 * Busca credenciales demo de personal escolar
 */
export function findStaffByDemoCredentials(
  email: string,
  plainPassword: string
): DemoStaffUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const staff = DEMO_STAFF_ACCOUNTS.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (!staff) return null;
  if (staff.password !== plainPassword) return null;
  return staff;
}

/**
 * Firma un payload de sesión con HMAC-SHA256 para el personal del colegio.
 * Por defecto dura 8 horas (jornada laboral escolar).
 */
export function signStaffSession(
  payload: Omit<StaffSessionPayload, 'issuedAt' | 'expiresAt'>,
  expiresInHours = 8
): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + expiresInHours * 60 * 60 * 1000;

  const fullPayload: StaffSessionPayload = {
    ...payload,
    issuedAt,
    expiresAt,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
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

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', AUTH_SECRET)
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

    if (!payload.role || !['ADMIN', 'PSICOLOGO', 'TUTOR', 'DIRECTOR'].includes(payload.role)) {
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
