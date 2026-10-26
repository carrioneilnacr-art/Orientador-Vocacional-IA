import crypto from 'crypto';

export const STUDENT_COOKIE_NAME = 'chaski_student_session';
export const GUEST_TEST_COOKIE_NAME = 'chaski_guest_test';

function getAuthSecret(): string | null {
  const secret = process.env.STUDENT_AUTH_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

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

interface GuestTestSessionPayload {
  testId: string;
  issuedAt: number;
  expiresAt: number;
}

export function signGuestTestSession(testId: string, expiresInDays = 30): string | null {
  const authSecret = getAuthSecret();
  if (!authSecret || !testId) return null;
  const issuedAt = Date.now();
  const payload: GuestTestSessionPayload = {
    testId,
    issuedAt,
    expiresAt: issuedAt + expiresInDays * 24 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', authSecret).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyGuestTestSession(token: string | undefined): GuestTestSessionPayload | null {
  const authSecret = getAuthSecret();
  if (!authSecret || !token) return null;
  const [encoded, signature, ...extra] = token.split('.');
  if (!encoded || !signature || extra.length > 0) return null;

  const expected = crypto.createHmac('sha256', authSecret).update(encoded).digest('base64url');
  const signatureBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (signatureBytes.length !== expectedBytes.length || !crypto.timingSafeEqual(signatureBytes, expectedBytes)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as GuestTestSessionPayload;
    if (
      !payload.testId ||
      !payload.issuedAt || payload.issuedAt > Date.now() ||
      !payload.expiresAt || Date.now() > payload.expiresAt
    ) return null;
    return payload;
  } catch {
    return null;
  }
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
  const authSecret = getAuthSecret();
  if (!authSecret) throw new Error('STUDENT_AUTH_SECRET must be configured with at least 32 characters.');
  const issuedAt = Date.now();
  const expiresAt = issuedAt + expiresInHours * 60 * 60 * 1000;

  const fullPayload: StudentSessionPayload = {
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
 * Verifica y decodifica un token de sesión de estudiante.
 * Retorna null si la firma es inválida o si expiró.
 */
export function verifyStudentSession(token: string): StudentSessionPayload | null {
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

  // Comparación resistente a timing attacks
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr) as StudentSessionPayload;

    if (
      !payload.studentId || !payload.schoolId || !payload.studentCode || !payload.fullName ||
      !['PENDING', 'GRANTED', 'REVOKED'].includes(payload.consentStatus) ||
      !payload.issuedAt || payload.issuedAt > Date.now() ||
      !payload.expiresAt || Date.now() > payload.expiresAt
    ) {
      return null; // Token expirado
    }

    return payload;
  } catch {
    return null;
  }
}
