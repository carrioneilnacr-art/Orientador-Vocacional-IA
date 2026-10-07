import { describe, it, expect } from 'vitest';
import {
  hashAccessCode,
  generateAccessCode,
  signStudentSession,
  verifyStudentSession,
} from '../lib/studentAuth';

describe('Student Access Code & Auth Security (Fase 2)', () => {
  it('normaliza y calcula hash SHA-256 de forma determinista e insensible a mayúsculas/espacios', () => {
    const hash1 = hashAccessCode('hon-7k9p');
    const hash2 = hashAccessCode('  HON-7K9P  ');
    const hash3 = hashAccessCode('HON-7K9P');

    expect(hash1).toBe(hash2);
    expect(hash2).toBe(hash3);
    expect(hash1.length).toBe(64); // SHA-256 produce 64 caracteres hex
  });

  it('diferentes códigos generan diferentes hashes', () => {
    const hashA = hashAccessCode('HON-1111');
    const hashB = hashAccessCode('HON-2222');
    expect(hashA).not.toBe(hashB);
  });

  it('genera códigos con formato y prefijo correctos sin caracteres ambiguos', () => {
    const code = generateAccessCode('HON');
    expect(code).toMatch(/^HON-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/);
    // Verificar que la parte aleatoria generada no contiene 0, O, 1, I para evitar confusión al estudiante
    const suffix = code.split('-')[1];
    expect(suffix).not.toMatch(/[01OI]/);
  });

  it('firma y verifica un token de sesión de alumno correctamente', () => {
    const payload = {
      studentId: '11111111-1111-1111-1111-111111111111',
      schoolId: '22222222-2222-2222-2222-222222222222',
      studentCode: 'HON-2026-001',
      fullName: 'Carlos Mendoza',
      consentStatus: 'GRANTED' as const,
      schoolName: 'Colegio Matemático Honores',
      classroom: '5° "A" (2026)',
    };

    const token = signStudentSession(payload, 24);
    expect(typeof token).toBe('string');
    expect(token.includes('.')).toBe(true);

    const verified = verifyStudentSession(token);
    expect(verified).not.toBeNull();
    expect(verified?.studentId).toBe(payload.studentId);
    expect(verified?.studentCode).toBe(payload.studentCode);
    expect(verified?.fullName).toBe(payload.fullName);
    expect(verified?.consentStatus).toBe('GRANTED');
    expect(verified?.schoolName).toBe('Colegio Matemático Honores');
  });

  it('rechaza tokens manipulados o alterados (anti-tampering)', () => {
    const payload = {
      studentId: '33333333-3333-3333-3333-333333333333',
      schoolId: '44444444-4444-4444-4444-444444444444',
      studentCode: 'HON-2026-002',
      fullName: 'Ana Torres',
      consentStatus: 'PENDING' as const,
    };

    const token = signStudentSession(payload);
    const [body, sig] = token.split('.');

    // Alterar el payload decodificado
    const forgedBody = Buffer.from(
      JSON.stringify({ ...payload, fullName: 'Hacker User' })
    ).toString('base64url');

    const forgedToken = `${forgedBody}.${sig}`;
    const result = verifyStudentSession(forgedToken);
    expect(result).toBeNull();
  });

  it('rechaza tokens con expiración vencida', () => {
    const payload = {
      studentId: '55555555-5555-5555-5555-555555555555',
      schoolId: '66666666-6666-6666-6666-666666666666',
      studentCode: 'HON-2026-003',
      fullName: 'Lucía Díaz',
      consentStatus: 'REVOKED' as const,
    };

    // Crear token expirado (-1 hora)
    const token = signStudentSession(payload, -1);
    const result = verifyStudentSession(token);
    expect(result).toBeNull();
  });

  it('rechaza strings vacíos o tokens malformados', () => {
    expect(verifyStudentSession('')).toBeNull();
    expect(verifyStudentSession('invalid.token.extra')).toBeNull();
    expect(verifyStudentSession('singlepart')).toBeNull();
  });
});
