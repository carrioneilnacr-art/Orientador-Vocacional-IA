'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Shield,
  LogOut,
  Users,
  FileSpreadsheet,
  AlertTriangle,
  GraduationCap,
  TrendingUp,
  Brain,
  Building2,
  FileCheck2,
  Download,
  Upload,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Eye,
  MessageSquare,
  Sparkles,
  BarChart3,
  School,
  BadgeCheck,
} from 'lucide-react';
import { StaffRole, StaffSessionPayload } from '@/lib/staffAuth';

// Datos de muestra institucionales para el Colegio Matemático Honores
interface SampleStudent {
  id: string;
  code: string;
  fullName: string;
  classroom: string;
  riasecPrimary: string;
  topCareer: string;
  academicAverage: number;
  testStatus: 'COMPLETADO' | 'EN_PROCESO' | 'PENDIENTE';
  consentStatus: 'GRANTED' | 'PENDING' | 'REVOKED';
  adjustmentBonus: string;
}

const SAMPLE_STUDENTS: SampleStudent[] = [
  {
    id: 's-01',
    code: 'HON-2026-001',
    fullName: 'Carlos Mendoza Paredes',
    classroom: '5° "A"',
    riasecPrimary: 'Investigativo (I)',
    topCareer: 'Ingeniería de Sistemas de Información',
    academicAverage: 17.8,
    testStatus: 'COMPLETADO',
    consentStatus: 'GRANTED',
    adjustmentBonus: '+12%',
  },
  {
    id: 's-02',
    code: 'HON-2026-002',
    fullName: 'Ana Torres Quispe',
    classroom: '5° "A"',
    riasecPrimary: 'Social (S)',
    topCareer: 'Medicina Humana',
    academicAverage: 18.2,
    testStatus: 'COMPLETADO',
    consentStatus: 'GRANTED',
    adjustmentBonus: '+15%',
  },
  {
    id: 's-03',
    code: 'HON-2026-003',
    fullName: 'Lucía Díaz Huamán',
    classroom: '5° "A"',
    riasecPrimary: 'Emprendedor (E)',
    topCareer: 'Administración y Marketing',
    academicAverage: 15.4,
    testStatus: 'COMPLETADO',
    consentStatus: 'GRANTED',
    adjustmentBonus: '+6%',
  },
  {
    id: 's-04',
    code: 'HON-2026-004',
    fullName: 'Mateo Rivas Benítez',
    classroom: '5° "A"',
    riasecPrimary: 'Artístico (A)',
    topCareer: 'Diseño Profesional Digital',
    academicAverage: 14.2,
    testStatus: 'COMPLETADO',
    consentStatus: 'PENDING',
    adjustmentBonus: '+0%',
  },
  {
    id: 's-05',
    code: 'HON-2026-005',
    fullName: 'Diego Salazar Cárdenas',
    classroom: '5° "A"',
    riasecPrimary: 'Realista (R)',
    topCareer: 'Ingeniería Mecatrónica',
    academicAverage: 16.5,
    testStatus: 'COMPLETADO',
    consentStatus: 'GRANTED',
    adjustmentBonus: '+9%',
  },
  {
    id: 's-06',
    code: 'HON-2026-006',
    fullName: 'Sofía Benavides Wong',
    classroom: '5° "A"',
    riasecPrimary: 'Pendiente',
    topCareer: 'En evaluación',
    academicAverage: 13.8,
    testStatus: 'EN_PROCESO',
    consentStatus: 'GRANTED',
    adjustmentBonus: '0%',
  },
  {
    id: 's-07',
    code: 'HON-2026-007',
    fullName: 'Renzo Carranza Ortiz',
    classroom: '5° "B"',
    riasecPrimary: 'Pendiente',
    topCareer: 'No iniciado',
    academicAverage: 12.0,
    testStatus: 'PENDIENTE',
    consentStatus: 'PENDING',
    adjustmentBonus: '0%',
  },
];

interface TutoringRequest {
  id: string;
  studentName: string;
  classroom: string;
  reason: string;
  date: string;
  status: 'PENDIENTE' | 'ATENDIDO';
}

const SAMPLE_TUTORING_REQUESTS: TutoringRequest[] = [
  {
    id: 'tr-01',
    studentName: 'Mateo Rivas Benítez',
    classroom: '5° "A"',
    reason: 'Duda vocacional entre Diseño Gráfico e Ingeniería de Software. Interés en becas.',
    date: 'Hoy, 09:15 AM',
    status: 'PENDIENTE',
  },
  {
    id: 'tr-02',
    studentName: 'Renzo Carranza Ortiz',
    classroom: '5° "B"',
    reason: 'Inseguridad ante exámenes de admisión de universidades públicas vs privadas.',
    date: 'Ayer, 04:30 PM',
    status: 'PENDIENTE',
  },
  {
    id: 'tr-03',
    studentName: 'Ana Torres Quispe',
    classroom: '5° "A"',
    reason: 'Orientación para postulación a Beca 18 / Beca Excelencia Académica.',
    date: '28 Sep, 11:20 AM',
    status: 'ATENDIDO',
  },
];

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
}

const SAMPLE_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'a-1',
    actor: 'admin@honores.edu.pe',
    action: 'CONFIRM_GRADE_IMPORT',
    target: 'SIAGIE_2026_Bimestre1.xlsx (142 notas)',
    time: 'Hoy, 10:14 AM',
  },
  {
    id: 'a-2',
    actor: 'psicologo@honores.edu.pe',
    action: 'VIEW_STUDENT_PROFILE',
    target: 'HON-2026-001 (Carlos Mendoza)',
    time: 'Hoy, 09:45 AM',
  },
  {
    id: 'a-3',
    actor: 'HON-2026-002',
    action: 'CONSENT_GRANTED',
    target: 'Consentimiento informado Ley 29733',
    time: 'Hoy, 08:30 AM',
  },
  {
    id: 'a-4',
    actor: 'director@honores.edu.pe',
    action: 'EXPORT_EXECUTIVE_SUMMARY',
    target: 'Reporte de Afinidad Universitaria 2026.pdf',
    time: 'Ayer, 05:00 PM',
  },
];

export default function ColegioDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<StaffSessionPayload | null>(null);
  const [activeRole, setActiveRole] = useState<StaffRole>('ADMIN');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [tutoringList, setTutoringList] = useState<TutoringRequest[]>(SAMPLE_TUTORING_REQUESTS);

  // Verificar sesión al cargar
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/colegio/staff/me');
        const data = await res.json();
        if (data.authenticated && data.staff) {
          setSession(data.staff);
          setActiveRole(data.staff.role);
        } else {
          // Sesión no encontrada -> Modo demo predeterminado como ADMIN para evaluación fluida
          setActiveRole('ADMIN');
        }
      } catch {
        setActiveRole('ADMIN');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/colegio/staff/logout', { method: 'POST' });
    } catch {
      // Ignorar error al cerrar
    }
    router.push('/colegio/login');
  };

  const handleResolveTutoring = (id: string) => {
    setTutoringList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'ATENDIDO' as const } : item))
    );
  };

  const filteredStudents = SAMPLE_STUDENTS.filter(
    (st) =>
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.topCareer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F5FAFD] text-[#0B2D4D] font-sans pb-16">
      {/* ── TOP NAV BAR ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#CBDDE6] shadow-[0_2px_12px_rgba(11,45,77,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-[#E8F8FA] border border-[#CBDDE6] flex items-center justify-center shadow-xs">
                <Image
                  src="/assets/chaski/chaski-10.png"
                  alt="Chaski"
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-sm text-[#0B2D4D] hidden sm:inline">
                Chaski Colegios
              </span>
            </Link>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-[#08BBD5]" />
              <span className="font-semibold text-xs sm:text-sm text-[#0B2D4D]">
                Colegio Matemático Honores
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ciclo 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Badge de usuario actual */}
            <div className="flex items-center gap-2.5 bg-[#F5FAFD] border border-[#CBDDE6] px-3 py-1.5 rounded-xl">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  activeRole === 'ADMIN'
                    ? 'bg-purple-600'
                    : activeRole === 'PSICOLOGO'
                    ? 'bg-[#08BBD5]'
                    : activeRole === 'TUTOR'
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-tight text-[#0B2D4D]">
                  {session?.fullName || 'Personal Autorizado'}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold">{activeRole}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-[0.96] border border-transparent hover:border-red-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── SUB-HEADER: ROLE ADAPTIVE SWITCHER ── */}
      <div className="bg-white border-b border-[#E1EDF3] py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              Vista por Rol:
            </span>
            <span className="text-slate-700">Explora las funciones específicas de cada rol:</span>
          </div>

          {/* Botones de cambio de rol para evaluación rápida (concentric radius: rounded-xl, active:scale-[0.96]) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveRole('ADMIN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-[0.96] flex items-center gap-1.5 cursor-pointer ${
                activeRole === 'ADMIN'
                  ? 'bg-[#0B2D4D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Admin TI</span>
            </button>

            <button
              onClick={() => setActiveRole('PSICOLOGO')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-[0.96] flex items-center gap-1.5 cursor-pointer ${
                activeRole === 'PSICOLOGO'
                  ? 'bg-[#08BBD5] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Psicólogo</span>
            </button>

            <button
              onClick={() => setActiveRole('TUTOR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-[0.96] flex items-center gap-1.5 cursor-pointer ${
                activeRole === 'TUTOR'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Tutor Aula</span>
            </button>

            <button
              onClick={() => setActiveRole('DIRECTOR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-[0.96] flex items-center gap-1.5 cursor-pointer ${
                activeRole === 'DIRECTOR'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Director</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── CUERPO PRINCIPAL DEL DASHBOARD ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* BANNER INFORMATIVO SEGÚN ROL */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-white via-white to-[#E8F8FA] border border-[#CBDDE6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#08BBD5]/10 border border-[#08BBD5]/20 flex items-center justify-center text-[#08BBD5] flex-shrink-0">
              {activeRole === 'ADMIN' && <Building2 className="w-5 h-5" />}
              {activeRole === 'PSICOLOGO' && <Brain className="w-5 h-5" />}
              {activeRole === 'TUTOR' && <GraduationCap className="w-5 h-5" />}
              {activeRole === 'DIRECTOR' && <BarChart3 className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0B2D4D] tracking-tight">
                {activeRole === 'ADMIN' && 'Panel de Administración y Control Escolar'}
                {activeRole === 'PSICOLOGO' && 'Gabinete Psicopedagógico y Acompañamiento'}
                {activeRole === 'TUTOR' && 'Tutoría de Aula — 5° Grado "A" de Secundaria'}
                {activeRole === 'DIRECTOR' && 'Dirección General — Resumen Ejecutivo y Métricas'}
              </h2>
              <p className="text-xs text-slate-600">
                {activeRole === 'ADMIN' &&
                  'Gestión de importaciones SIAGIE, auditoría legal Ley 29733 y accesos masivos.'}
                {activeRole === 'PSICOLOGO' &&
                  'Fichas vocacionales RIASEC, alertas de ajuste académico y solicitudes de orientación.'}
                {activeRole === 'TUTOR' &&
                  'Monitoreo de avance de cuestionarios vocacionales y rendimiento por competencias.'}
                {activeRole === 'DIRECTOR' &&
                  'Indicadores estratégicos de afinidad vocacional, tercio superior y convenios universitarios.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {activeRole === 'ADMIN' && (
              <button
                onClick={() => alert('Abriendo módulo de importador de calificaciones SIAGIE...')}
                className="px-4 py-2 bg-[#0B2D4D] hover:bg-[#08BBD5] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-[0.96] cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Importar Notas SIAGIE</span>
              </button>
            )}
            {activeRole === 'DIRECTOR' && (
              <button
                onClick={() => alert('Generando informe ejecutivo anual en formato PDF...')}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-[0.96] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Informe Anual (PDF)</span>
              </button>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VISTA 1: ADMIN (Importaciones, Auditoría, Gestión de Códigos)  */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'ADMIN' && (
          <div className="space-y-6">
            {/* KPI Cards (concentric radius: rounded-2xl interior) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Alumnos Registrados</span>
                  <Users className="w-4 h-4 text-[#08BBD5]" />
                </div>
                <p className="text-2xl font-bold text-[#0B2D4D] tabular-nums font-mono">142</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <span>100% códigos generados</span>
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Aulas Habilitadas</span>
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-[#0B2D4D] tabular-nums font-mono">6</p>
                <p className="text-[11px] text-slate-500 mt-1">3°, 4° y 5° de Secundaria</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Importaciones de Notas</span>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-[#0B2D4D] tabular-nums font-mono">4</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  Confirmadas (Bimestre I)
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Auditoría Ley 29733</span>
                  <Shield className="w-4 h-4 text-[#0B2D4D]" />
                </div>
                <p className="text-2xl font-bold text-[#0B2D4D] tabular-nums font-mono">100%</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Libro inmutable al día</p>
              </div>
            </div>

            {/* Accesos Rápidos del Administrador */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#CBDDE6] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0B2D4D]">Importador de Notas (Fase 4)</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Carga archivos Excel/CSV de SIAGIE o actas PDF para calcular el ajuste académico.
                  </p>
                </div>
                <button
                  onClick={() => alert('Redirigiendo al importador de notas...')}
                  className="mt-4 w-full py-2 bg-[#0B2D4D] hover:bg-[#08BBD5] text-white text-xs font-bold rounded-xl transition-all active:scale-[0.96] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Abrir Importador</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#CBDDE6] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                    <Download className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0B2D4D]">Hojas Imprimibles de Códigos</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Descarga en PDF las tiras de códigos de acceso (HON-XXXX) para repartir por aula.
                  </p>
                </div>
                <button
                  onClick={() => alert('Generando PDF de tiras de códigos para 5° "A" y "B"...')}
                  className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all active:scale-[0.96] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Exportar Códigos</span>
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#CBDDE6] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0B2D4D]">Consentimiento de Padres</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Registro de consentimientos firmados para cumplimiento de la Ley 29733.
                  </p>
                </div>
                <button
                  onClick={() => alert('Mostrando reporte de firmas de consentimiento...')}
                  className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all active:scale-[0.96] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ver Consentimientos</span>
                  <FileCheck2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tabla de Auditoría Inmutable (Ley 29733) */}
            <div className="bg-white rounded-2xl border border-[#E1EDF3] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#0B2D4D] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#08BBD5]" />
                    Registro de Auditoría en Tiempo Real (audit_log)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Traza completa de accesos a datos personales y consultas de fichas
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  table: audit_log
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2 px-3">Actor</th>
                      <th className="py-2 px-3">Acción Registrada</th>
                      <th className="py-2 px-3">Objetivo / Detalle</th>
                      <th className="py-2 px-3 text-right">Marca de Tiempo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SAMPLE_AUDIT_LOGS.map((log) => (
                      <tr key={log.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                          {log.actor}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{log.target}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-500">
                          {log.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VISTA 2: PSICÓLOGO (Alertas, Solicitudes de Tutoría, Fichas)   */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'PSICOLOGO' && (
          <div className="space-y-6">
            {/* KPI Psicología */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Alumnos Evaluados</span>
                  <Brain className="w-4 h-4 text-[#08BBD5]" />
                </div>
                <p className="text-2xl font-bold text-[#0B2D4D] tabular-nums font-mono">124 / 142</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">87.3% completitud</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Alertas Vocacionales</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-amber-600 tabular-nums font-mono">8</p>
                <p className="text-[11px] text-amber-600 font-semibold mt-1">Requieren atención</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Solicitudes de Cita</span>
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-[#0B2D4D] tabular-nums font-mono">
                  {tutoringList.filter((t) => t.status === 'PENDIENTE').length}
                </p>
                <p className="text-[11px] text-purple-600 font-semibold mt-1">Pendientes de reunión</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Perfil Dominante</span>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-lg font-bold text-[#0B2D4D]">Investigativo (I)</p>
                <p className="text-[11px] text-slate-500 mt-1">38% de la promoción</p>
              </div>
            </div>

            {/* Solicitudes de Tutoría Vocacional */}
            <div className="bg-white rounded-2xl border border-[#E1EDF3] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#0B2D4D] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#08BBD5]" />
                    Solicitudes de Orientación Vocacional del Alumnado
                  </h3>
                  <p className="text-xs text-slate-500">
                    Alumnos que solicitaron una sesión individual con el equipo de psicología
                  </p>
                </div>
                <span className="text-xs font-bold text-[#08BBD5] bg-[#E8F8FA] px-2.5 py-1 rounded-full">
                  {tutoringList.filter((t) => t.status === 'PENDIENTE').length} Pendientes
                </span>
              </div>

              <div className="space-y-3">
                {tutoringList.map((req) => (
                  <div
                    key={req.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      req.status === 'PENDIENTE'
                        ? 'bg-[#FDFBEE] border-amber-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#0B2D4D]">
                            {req.studentName}
                          </span>
                          <span className="text-[10px] font-semibold bg-white border px-1.5 py-0.5 rounded text-slate-600">
                            {req.classroom}
                          </span>
                          <span className="text-[10px] font-mono tabular-nums text-slate-500">
                            {req.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{req.reason}</p>
                      </div>

                      {req.status === 'PENDIENTE' ? (
                        <button
                          onClick={() => handleResolveTutoring(req.id)}
                          className="px-3 py-1.5 bg-[#08BBD5] hover:bg-[#0B2D4D] text-white text-xs font-bold rounded-lg transition-all active:scale-[0.96] flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Atender</span>
                        </button>
                      ) : (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md flex items-center gap-1 flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Atendido</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alertas Psicométricas y de Discrepancia */}
            <div className="bg-white rounded-2xl border border-[#E1EDF3] p-5 shadow-xs">
              <h3 className="text-sm font-bold text-[#0B2D4D] flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alertas de Discrepancia Notas vs. Afinidad (Ajuste Académico)
              </h3>
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0B2D4D]">
                      Discrepancia Académica en Área Científica — Renzo Carranza (5° "B")
                    </p>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      El estudiante muestra interés en Ingeniería de Sistemas (84%), pero su
                      promedio en Matemática y C.T. es de <span className="font-bold font-mono">11.4</span>.
                      Se recomienda refuerzo académico antes del proceso de admisión.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <Brain className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0B2D4D]">
                      Perfil Vocacional Plano / Indeciso — Sofía Benavides (5° "A")
                    </p>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Puntajes similares en todas las dimensiones RIASEC sin una preferencia clara.
                      Se sugiere entrevista vocacional complementaria con el psicólogo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VISTA 3: TUTOR (Avance de Aula, Estudiantes, Rendimiento)      */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'TUTOR' && (
          <div className="space-y-6">
            {/* KPI Tutor */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Aula Asignada</span>
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-[#0B2D4D]">5° "A"</p>
                <p className="text-[11px] text-slate-500 mt-1">28 alumnos matriculados</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Tests Completados</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-emerald-600 tabular-nums font-mono">
                  25 / 28
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">89.3% de avance</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Promedio General</span>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-[#0B2D4D] tabular-nums font-mono">16.2</p>
                <p className="text-[11px] text-blue-600 font-semibold mt-1">Escala vigesimal</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Top Carrera del Aula</span>
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm font-bold text-[#0B2D4D] truncate">Ingeniería / Tecnología</p>
                <p className="text-[11px] text-purple-600 font-semibold mt-1">36% de preferencia</p>
              </div>
            </div>

            {/* Barra de Progreso del Salón */}
            <div className="bg-white rounded-2xl border border-[#E1EDF3] p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#0B2D4D]">Avance de Cuestionarios en 5° "A"</span>
                <span className="font-mono tabular-nums text-slate-600">25 de 28 alumnos (89%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#08BBD5] to-emerald-500 rounded-full w-[89%]" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Faltan 3 alumnos por completar las 4 misiones de Chaski.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VISTA 4: DIRECTOR (Métricas Institucionales y Convenios)        */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'DIRECTOR' && (
          <div className="space-y-6">
            {/* KPI Director */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Cobertura Vocacional</span>
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-indigo-700 tabular-nums font-mono">91.4%</p>
                <p className="text-[11px] text-indigo-600 font-semibold mt-1">Secundaria completa</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Tercio Superior</span>
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-700 tabular-nums font-mono">48</p>
                <p className="text-[11px] text-purple-600 font-semibold mt-1">
                  Alumnos con promedio &gt; 16.5
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Convenios Sugeridos</span>
                  <Building2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums font-mono">4</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">UPC, UPN, UTP, USMP</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E1EDF3] shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-semibold">Satisfacción Alumno</span>
                  <BadgeCheck className="w-4 h-4 text-[#08BBD5]" />
                </div>
                <p className="text-2xl font-bold text-[#08BBD5] tabular-nums font-mono">4.9 / 5</p>
                <p className="text-[11px] text-[#08BBD5] font-semibold mt-1">Valoración Chaski</p>
              </div>
            </div>

            {/* Demanda Universitaria y Carreras */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-[#E1EDF3] p-5 shadow-xs">
                <h3 className="text-sm font-bold text-[#0B2D4D] mb-3 flex items-center gap-2">
                  <School className="w-4 h-4 text-indigo-600" />
                  Universidades con Mayor Preferencia
                </h3>
                <div className="space-y-2.5">
                  {[
                    { name: 'Universidad Peruana de Ciencias Aplicadas (UPC)', pct: '42%' },
                    { name: 'Universidad Tecnológica del Perú (UTP)', pct: '28%' },
                    { name: 'Universidad Privada del Norte (UPN)', pct: '18%' },
                    { name: 'Universidad de San Martín de Porres (USMP)', pct: '12%' },
                  ].map((uni, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">{uni.name}</span>
                      <span className="font-mono tabular-nums font-bold text-[#0B2D4D]">
                        {uni.pct}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E1EDF3] p-5 shadow-xs">
                <h3 className="text-sm font-bold text-[#0B2D4D] mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Áreas Vocacionales en Secundaria
                </h3>
                <div className="space-y-2.5">
                  {[
                    { area: 'Ingeniería y Tecnología', pct: '38%', color: 'bg-blue-500' },
                    { area: 'Ciencias de la Salud', pct: '24%', color: 'bg-emerald-500' },
                    { area: 'Gestión y Negocios', pct: '18%', color: 'bg-amber-500' },
                    { area: 'Arte, Diseño y Comunicaciones', pct: '12%', color: 'bg-purple-500' },
                    { area: 'Ciencias Sociales y Humanidades', pct: '8%', color: 'bg-rose-500' },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-700 font-medium">{item.area}</span>
                        <span className="font-mono tabular-nums font-bold text-slate-800">
                          {item.pct}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: item.pct }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* NÓMINA DE ESTUDIANTES Y FICHAS VOCACIONALES (COMÚN A ROLES)   */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="mt-8 bg-white rounded-2xl border border-[#CBDDE6] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E1EDF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B2D4D] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#08BBD5]" />
                Nómina Escolar y Fichas Vocacionales Chaski
              </h3>
              <p className="text-xs text-slate-500">
                Alumnos del ciclo 2026, código escolar, consentimiento y carreras recomendadas
              </p>
            </div>

            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por alumno o carrera..."
                className="w-full h-9 pl-8 pr-3 text-xs bg-[#F5FAFD] border border-[#CBDDE6] rounded-xl focus:border-[#08BBD5] focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4">Código</th>
                  <th className="py-2.5 px-4">Estudiante</th>
                  <th className="py-2.5 px-4">Aula</th>
                  <th className="py-2.5 px-4">Dimensión RIASEC</th>
                  <th className="py-2.5 px-4">Carrera Recomendada</th>
                  <th className="py-2.5 px-4 text-center">Promedio</th>
                  <th className="py-2.5 px-4 text-center">Ajuste</th>
                  <th className="py-2.5 px-4 text-center">Consentimiento</th>
                  <th className="py-2.5 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-[#F5FAFD] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{st.code}</td>
                    <td className="py-3 px-4 font-semibold text-[#0B2D4D]">{st.fullName}</td>
                    <td className="py-3 px-4 text-slate-600">{st.classroom}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        {st.riasecPrimary}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{st.topCareer}</td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums font-bold text-slate-800">
                      {st.academicAverage.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums font-semibold text-emerald-600">
                      {st.adjustmentBonus}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {st.consentStatus === 'GRANTED' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Firmado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" />
                          <span>Pendiente</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() =>
                          alert(`Abriendo ficha vocacional integral de ${st.fullName}...`)
                        }
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#08BBD5] hover:text-[#0B2D4D] hover:bg-[#E8F8FA] rounded-lg transition-all active:scale-[0.96] border border-transparent hover:border-[#CBDDE6] cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver Ficha</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
