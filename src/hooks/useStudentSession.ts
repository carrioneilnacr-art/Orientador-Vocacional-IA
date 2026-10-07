'use client';

import { useState, useEffect, useCallback } from 'react';

export interface StudentProfile {
  id: string;
  schoolId: string;
  studentCode: string;
  fullName: string;
  consentStatus: 'PENDING' | 'GRANTED' | 'REVOKED';
  schoolName?: string;
  classroom?: string;
}

export interface UseStudentSessionReturn {
  student: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useStudentSession(): UseStudentSessionReturn {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/colegio/sesion', { cache: 'no-store' });
      if (!res.ok) {
        setStudent(null);
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (data.authenticated && data.student) {
        setStudent(data.student);
        setIsAuthenticated(true);
      } else {
        setStudent(null);
        setIsAuthenticated(false);
      }
    } catch {
      setStudent(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/colegio/sesion', { method: 'DELETE' });
    setStudent(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { student, isAuthenticated, isLoading, refresh, logout };
}
