import { describe, it, expect } from 'vitest';
import {
  hasStaffRole,
  requireStaffRole,
  canAccessModule,
  hasStaffPermission,
  StaffRole,
} from '../lib/staffAuth';

describe('Staff Auth & RBAC Security (Fase 3)', () => {
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

    it('asigna la importación y confirmación de notas solo al administrador', () => {
      expect(hasStaffPermission('ADMIN', 'grades:import')).toBe(true);
      expect(hasStaffPermission('ADMIN', 'grades:confirm')).toBe(true);
      expect(hasStaffPermission('PSICOLOGO', 'grades:confirm')).toBe(false);
      expect(hasStaffPermission('TUTOR', 'grades:import')).toBe(false);
      expect(hasStaffPermission('DIRECTOR', 'grades:confirm')).toBe(false);
    });
  });
});
