import { describe, it, expect } from 'vitest';
import {
  signStaffSession,
  verifyStaffSession,
  hasStaffRole,
  requireStaffRole,
  canAccessModule,
  findStaffByDemoCredentials,
  DEMO_STAFF_ACCOUNTS,
  StaffRole,
} from '../lib/staffAuth';

describe('Staff Auth & RBAC Security (Fase 3)', () => {
  describe('Cuentas Demo y Búsqueda de Credenciales', () => {
    it('contiene las 4 cuentas de rol del Colegio Matemático Honores', () => {
      const roles: StaffRole[] = ['ADMIN', 'PSICOLOGO', 'TUTOR', 'DIRECTOR'];
      roles.forEach((role) => {
        const found = DEMO_STAFF_ACCOUNTS.find((a) => a.role === role);
        expect(found).toBeDefined();
        expect(found?.email).toContain('@honores.edu.pe');
        expect(found?.password).toBeTruthy();
      });
    });

    it('autentica correctamente credenciales válidas de prueba', () => {
      const admin = findStaffByDemoCredentials('admin@honores.edu.pe', 'admin123');
      expect(admin).not.toBeNull();
      expect(admin?.role).toBe('ADMIN');
      expect(admin?.fullName).toContain('Miguel Ángel Ramos');

      const psicologo = findStaffByDemoCredentials('psicologo@honores.edu.pe', 'psico123');
      expect(psicologo).not.toBeNull();
      expect(psicologo?.role).toBe('PSICOLOGO');

      const tutor = findStaffByDemoCredentials('tutor@honores.edu.pe', 'tutor123');
      expect(tutor).not.toBeNull();
      expect(tutor?.role).toBe('TUTOR');
      expect(tutor?.classroomAssigned).toBe('5° "A" Secundaria');

      const director = findStaffByDemoCredentials('director@honores.edu.pe', 'director123');
      expect(director).not.toBeNull();
      expect(director?.role).toBe('DIRECTOR');
    });

    it('es insensible a mayúsculas y espacios en el correo', () => {
      const user = findStaffByDemoCredentials('  ADMIN@HONORES.EDU.PE  ', 'admin123');
      expect(user).not.toBeNull();
      expect(user?.role).toBe('ADMIN');
    });

    it('rechaza contraseñas incorrectas o correos inexistentes', () => {
      expect(findStaffByDemoCredentials('admin@honores.edu.pe', 'wrongpass')).toBeNull();
      expect(findStaffByDemoCredentials('desconocido@honores.edu.pe', 'admin123')).toBeNull();
    });
  });

  describe('Firma y Verificación HMAC de Tokens de Sesión', () => {
    const basePayload = {
      userId: '11111111-aaaa-1111-aaaa-111111111111',
      schoolId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
      email: 'psicologo@honores.edu.pe',
      fullName: 'Lic. Valeria Torres Salazar',
      role: 'PSICOLOGO' as StaffRole,
      schoolName: 'Colegio Matemático Honores',
    };

    it('firma y verifica un token de sesión con rol correctamente', () => {
      const token = signStaffSession(basePayload, 8);
      expect(typeof token).toBe('string');
      expect(token).toContain('.');

      const verified = verifyStaffSession(token);
      expect(verified).not.toBeNull();
      expect(verified?.userId).toBe(basePayload.userId);
      expect(verified?.email).toBe(basePayload.email);
      expect(verified?.fullName).toBe(basePayload.fullName);
      expect(verified?.role).toBe('PSICOLOGO');
      expect(verified?.schoolName).toBe('Colegio Matemático Honores');
    });

    it('rechaza tokens manipulados o alterados (anti-tampering)', () => {
      const token = signStaffSession(basePayload);
      const [payloadPart, sig] = token.split('.');

      // Intentar escalar privilegios de PSICOLOGO a ADMIN alterando el payload
      const tamperedJson = JSON.stringify({
        ...basePayload,
        role: 'ADMIN',
        issuedAt: Date.now(),
        expiresAt: Date.now() + 8 * 3600 * 1000,
      });
      const tamperedPayloadPart = Buffer.from(tamperedJson).toString('base64url');
      const forgedToken = `${tamperedPayloadPart}.${sig}`;

      const verified = verifyStaffSession(forgedToken);
      expect(verified).toBeNull();
    });

    it('rechaza tokens vencidos', () => {
      // Expiración en el pasado (-1 hora)
      const token = signStaffSession(basePayload, -1);
      const verified = verifyStaffSession(token);
      expect(verified).toBeNull();
    });

    it('rechaza strings vacíos, no delimitados o malformados', () => {
      expect(verifyStaffSession('')).toBeNull();
      expect(verifyStaffSession('invalid-token-no-dot')).toBeNull();
      expect(verifyStaffSession('too.many.dots.in.token')).toBeNull();
      expect(verifyStaffSession('invalidBase64.invalidSig')).toBeNull();
    });
  });

  describe('Control de Acceso Basado en Roles (RBAC)', () => {
    it('hasStaffRole valida rol simple o lista de roles permitidos', () => {
      expect(hasStaffRole('ADMIN', 'ADMIN')).toBe(true);
      expect(hasStaffRole('PSICOLOGO', 'ADMIN')).toBe(false);
      expect(hasStaffRole('TUTOR', ['TUTOR', 'ADMIN'])).toBe(true);
      expect(hasStaffRole('DIRECTOR', ['PSICOLOGO', 'TUTOR'])).toBe(false);
    });

    it('requireStaffRole rechaza sesiones nulas con status 401', () => {
      const check = requireStaffRole(null, 'ADMIN');
      expect(check.authorized).toBe(false);
      expect(check.status).toBe(401);
      expect(check.error).toContain('Sesión no iniciada');
    });

    it('requireStaffRole rechaza rol insuficiente con status 403', () => {
      const tutorSession = {
        userId: '33333333-cccc-3333-cccc-333333333333',
        schoolId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
        email: 'tutor@honores.edu.pe',
        fullName: 'Prof. Roberto Sánchez',
        role: 'TUTOR' as StaffRole,
        schoolName: 'Colegio Matemático Honores',
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      const check = requireStaffRole(tutorSession, 'ADMIN');
      expect(check.authorized).toBe(false);
      expect(check.status).toBe(403);
      expect(check.error).toContain('Acceso denegado');
    });

    it('requireStaffRole autoriza cuando el rol coincide', () => {
      const adminSession = {
        userId: '11111111-aaaa-1111-aaaa-111111111111',
        schoolId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
        email: 'admin@honores.edu.pe',
        fullName: 'Ing. Miguel Ángel Ramos',
        role: 'ADMIN' as StaffRole,
        schoolName: 'Colegio Matemático Honores',
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      const check = requireStaffRole(adminSession, ['ADMIN', 'DIRECTOR']);
      expect(check.authorized).toBe(true);
      expect(check.status).toBe(200);
    });

    it('canAccessModule aplica la matriz de permisos por módulo', () => {
      // Importador SIAGIE exclusivo para ADMIN
      expect(canAccessModule('ADMIN', 'importador')).toBe(true);
      expect(canAccessModule('DIRECTOR', 'importador')).toBe(false);
      expect(canAccessModule('PSICOLOGO', 'importador')).toBe(false);
      expect(canAccessModule('TUTOR', 'importador')).toBe(false);

      // Alertas vocacionales para PSICOLOGO y ADMIN
      expect(canAccessModule('PSICOLOGO', 'alertas')).toBe(true);
      expect(canAccessModule('ADMIN', 'alertas')).toBe(true);
      expect(canAccessModule('TUTOR', 'alertas')).toBe(false);

      // Métricas institucionales para DIRECTOR y ADMIN
      expect(canAccessModule('DIRECTOR', 'metricas')).toBe(true);
      expect(canAccessModule('ADMIN', 'metricas')).toBe(true);
      expect(canAccessModule('TUTOR', 'metricas')).toBe(false);

      // Vista de aula para TUTOR, PSICOLOGO y ADMIN
      expect(canAccessModule('TUTOR', 'aula')).toBe(true);
      expect(canAccessModule('PSICOLOGO', 'aula')).toBe(true);
      expect(canAccessModule('DIRECTOR', 'aula')).toBe(false);
    });
  });
});
