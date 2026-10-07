import crypto from 'crypto';

export const STUDENT_COOKIE_NAME = 'chaski_student_session';

const AUTH_SECRET = process.env.STUDENT_AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'chaski-secret-salt-key-2026-peru';

export interface StudentSessionPayload {
  studentId: string;
  schoolId: string;
  studentCode: string;
  fullName: string;
  consentStatus: 'PENDING' | 'GRANTED' | 'REVOKED';
  schoolName?: string;
  classroom?: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Normaliza y calcula el hash criptográfico SHA-256 de un código de acceso.
 * Se guarda únicamente el hash en la base de datos (seguridad zero-leak).
 */
export function hashAccessCode(code: string): string {
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Genera un código de acceso legible y seguro para el alumno (ej. HON-7K9P).
 */
export function generateAccessCode(prefix = 'HON'): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluye caracteres ambiguos (0, O, 1, I)
  let randomPart = '';
  const bytes = crypto.randomBytes(4);
  for (let i = 0; i < 4; i++) {
    randomPart += chars[bytes[i] % chars.length];
  }
  return `${prefix.toUpperCase()}-${randomPart}`;
}

/**
 * Firma un payload de sesión con HMAC-SHA256 para almacenamiento en cookie httpOnly.
 */
export function signStudentSession(
  payload: Omit<StudentSessionPayload, 'issuedAt' | 'expiresAt'>,
  expiresInHours = 24 * 7 // 7 días de sesión por defecto
): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + expiresInHours * 60 * 60 * 1000;

  const fullPayload: StudentSessionPayload = {
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
 * Verifica y decodifica un token de sesión de estudiante.
 * Retorna null si la firma es inválida o si expiró.
 */
export function verifyStudentSession(token: string): StudentSessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  // Comparación resistente a timing attacks
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr) as StudentSessionPayload;

    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return null; // Token expirado
    }

    return payload;
  } catch {
    return null;
  }
}
