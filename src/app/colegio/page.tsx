'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  School,
  Users,
  AlertTriangle,
  Award,
  Download,
  FileSpreadsheet,
  TrendingUp,
  Brain,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Printer,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface StudentCase {
  id: string;
  name: string;
  section: string;
  riasecCode: string;
  topCareer: string;
  clarityIndex: number;
  status: 'ALTA_CLARIDAD' | 'CONFLICTO_VOCACIONAL' | 'PERFIL_DISPERSO';
  recommendation: string;
  parentsNotified: boolean;
}

const SAMPLE_STUDENTS: StudentCase[] = [
  {
    id: 'STU-001',
    name: 'Mateo Quispe Flores',
    section: '5to A',
    riasecCode: 'SIE (Social - Investigador - Emprendedor)',
    topCareer: 'Psicología (UCSUR / UPN)',
    clarityIndex: 94,
    status: 'ALTA_CLARIDAD',
    recommendation: 'Listo para postulación y charla vocacional especializada en Ciencias de la Salud.',
    parentsNotified: true,
  },
  {
    id: 'STU-002',
    name: 'Valeria Mendoza Rivas',
    section: '5to B',
    riasecCode: 'ARE (Artístico - Realista - Emprendedor)',
    topCareer: 'Arquitectura (UPN / USMP)',
    clarityIndex: 91,
    status: 'ALTA_CLARIDAD',
    recommendation: 'Excelente afinidad espacial y constructiva. Recomendar portafolio de diseño.',
    parentsNotified: true,
  },
  {
    id: 'STU-003',
    name: 'Diego Castillo Morales',
    section: '5to A',
    riasecCode: 'A vs R (Conflicto Bipolar)',
    topCareer: 'Duda entre Diseño y Software',
    clarityIndex: 58,
    status: 'CONFLICTO_VOCACIONAL',
    recommendation: 'Requiere sesión psicopedagógica: explorar carreras híbridas como Diseño UI/UX o Animación.',
    parentsNotified: false,
  },
  {
    id: 'STU-004',
    name: 'Camila Rojas Benavides',
    section: '5to C',
    riasecCode: 'EC (Emprendedor - Convencional)',
    topCareer: 'Administración y Finanzas (UTP / USMP)',
    clarityIndex: 88,
    status: 'ALTA_CLARIDAD',
    recommendation: 'Afinidad alta para liderazgo empresarial y gestión corporativa.',
    parentsNotified: true,
  },
  {
    id: 'STU-005',
    name: 'Joaquín Navarro Vega',
    section: '5to B',
    riasecCode: 'Plano (Todas las dimensiones < 40%)',
    topCareer: 'Sin definir',
    clarityIndex: 35,
    status: 'PERFIL_DISPERSO',
    recommendation: 'Alerta de desorientación o desmotivación. Agendar taller de autoconocimiento.',
    parentsNotified: false,
  },
  {
    id: 'STU-006',
    name: 'Luciana Salazar Peña',
    section: '5to C',
    riasecCode: 'IES (Investigador - Emprendedor - Social)',
    topCareer: 'Derecho (USMP / UCV)',
    clarityIndex: 86,
    status: 'ALTA_CLARIDAD',
    recommendation: 'Alta capacidad argumentativa y razonamiento crítico. Promover debate intercolegial.',
    parentsNotified: true,
  },
];

export default function ColegioB2BPage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentCase | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');

  const filteredStudents = SAMPLE_STUDENTS.filter((s) => {
    if (filterStatus === 'TODOS') return true;
    return s.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#F5FAFD] font-sans selection:bg-[#00C2E0] selection:text-white pb-16">
      {/* Header Superior */}
      <header className="bg-white border-b border-[#E1EDF3] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E1EDF3] relative">
                <Image
                  src="/assets/chaski/chaski-10.png"
                  alt="Chaski"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#0B2D4D] tracking-tight block">
                  ORIENTADOR VOCACIONAL IA
                </span>
                <span className="text-[11px] font-bold text-[#00C2E0] uppercase tracking-wider block">
                  Portal Psicopedagógico Escolar B2B
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7FB] text-[#00C2E0] text-xs font-bold border border-[#00C2E0]/20">
              <span className="w-2 h-2 rounded-full bg-[#00C2E0] animate-ping" />
              Sesión Psicopedagógica Activa
            </span>
            <Link
              href="/"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D6E5EF] text-[#4F6B85] hover:text-[#082A4A] hover:bg-[#F8FCFF] transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Banner Institucional del Colegio */}
        <div className="bg-gradient-to-r from-[#082A4A] to-[#0D3B66] rounded-3xl p-6 sm:p-8 text-white shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#00C2E0] tracking-wide backdrop-blur-sm">
              <School className="w-3.5 h-3.5" />
              <span>COLEGIO PILOTO LIMA NORTE — PROMOCIÓN 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Dashboard de Orientación Vocacional y Monitoreo Escolar
            </h1>
            <p className="text-sm text-[#C4D9EB] max-w-2xl">
              Plataforma institucional para directores, tutores y psicólogos escolares. Mide intereses vocacionales, previene la deserción universitaria y conecta con las mallas oficiales licenciadas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => alert('Generando reporte consolidado de la promoción en Excel/PDF...')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00C2E0] hover:bg-[#0EA5C6] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Informe Promoción</span>
            </button>
          </div>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-[#D6E5EF] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8F7FB] flex items-center justify-center text-[#00C2E0]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#6A8AA3] uppercase">Estudiantes Evaluados</p>
              <p className="text-2xl font-black text-[#0B2D4D]">128 / 135</p>
              <span className="text-[11px] font-semibold text-emerald-600">94.8% de cobertura</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#D6E5EF] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#6A8AA3] uppercase">Claridad Vocacional</p>
              <p className="text-2xl font-black text-[#0B2D4D]">84.2%</p>
              <span className="text-[11px] font-semibold text-emerald-600">+12% vs año anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#D6E5EF] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#6A8AA3] uppercase">Alertas de Indecisión</p>
              <p className="text-2xl font-black text-[#0B2D4D]">7 Casos</p>
              <span className="text-[11px] font-semibold text-amber-600">Requieren consejería</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#D6E5EF] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#6A8AA3] uppercase">Top Área de Interés</p>
              <p className="text-2xl font-black text-[#0B2D4D]">Salud y Negocios</p>
              <span className="text-[11px] font-semibold text-[#6A8AA3]">52% de la cohorte</span>
            </div>
          </div>
        </div>

        {/* Sección de Analítica y Semáforo de Casos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Gráfico de Distribución Vocacional RIASEC */}
          <div className="bg-white rounded-2xl p-6 border border-[#D6E5EF] shadow-sm lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#0B2D4D] flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#00C2E0]" />
                <span>Mapa Vocacional de la Promoción</span>
              </h2>
            </div>
            <p className="text-xs text-[#4F6B85] mb-4">
              Distribución de intereses según el modelo validado de Holland RIASEC:
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#0B2D4D] mb-1">
                  <span>Social y Salud (S)</span>
                  <span>28% (36 alumnos)</span>
                </div>
                <div className="w-full bg-[#F0F5F9] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#0B2D4D] mb-1">
                  <span>Emprendedor y Negocios (E)</span>
                  <span>24% (31 alumnos)</span>
                </div>
                <div className="w-full bg-[#F0F5F9] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#0B2D4D] mb-1">
                  <span>Artístico y Diseño (A)</span>
                  <span>18% (23 alumnos)</span>
                </div>
                <div className="w-full bg-[#F0F5F9] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#0B2D4D] mb-1">
                  <span>Investigador y Ciencias (I)</span>
                  <span>16% (20 alumnos)</span>
                </div>
                <div className="w-full bg-[#F0F5F9] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '16%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#0B2D4D] mb-1">
                  <span>Realista e Ingeniería (R)</span>
                  <span>14% (18 alumnos)</span>
                </div>
                <div className="w-full bg-[#F0F5F9] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '14%' }} />
                </div>
              </div>
            </div>

            <div className="mt-6 p-3.5 rounded-xl bg-[#F5FAFD] border border-[#E1EDF3] text-xs text-[#4F6B85] leading-relaxed">
              <strong className="text-[#0B2D4D] font-bold">Diagnóstico Institucional:</strong> La promoción 2026 muestra un marcado perfil hacia vocaciones de impacto social, seguidas de liderazgo comercial y proyectos de arquitectura.
            </div>
          </div>

          {/* Semáforo de Casos y Seguimiento Individual */}
          <div className="bg-white rounded-2xl p-6 border border-[#D6E5EF] shadow-sm lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-bold text-[#0B2D4D]">
                  Seguimiento Psicopedagógico de Estudiantes
                </h2>
                <p className="text-xs text-[#4F6B85]">
                  Haz clic en un estudiante para emitir su Ficha Oficial de Reporte para Padres.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#6A8AA3]" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#D6E5EF] bg-white text-[#0B2D4D]"
                >
                  <option value="TODOS">Todos los alumnos</option>
                  <option value="CONFLICTO_VOCACIONAL">Alertas: Conflicto Vocacional</option>
                  <option value="PERFIL_DISPERSO">Alertas: Perfil Disperso</option>
                  <option value="ALTA_CLARIDAD">Alta Claridad Vocacional</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-[#EAF2F8] max-h-[380px] overflow-y-auto">
              {filteredStudents.map((stu) => (
                <div
                  key={stu.id}
                  onClick={() => setSelectedStudent(stu)}
                  className="py-3.5 px-3 rounded-xl hover:bg-[#F8FCFF] cursor-pointer transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        stu.status === 'ALTA_CLARIDAD'
                          ? 'bg-emerald-500 ring-2 ring-emerald-100'
                          : stu.status === 'CONFLICTO_VOCACIONAL'
                          ? 'bg-amber-500 ring-2 ring-amber-100'
                          : 'bg-rose-500 ring-2 ring-rose-100'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0B2D4D]">{stu.name}</p>
                      <p className="text-[11px] text-[#6A8AA3]">
                        {stu.section} • {stu.topCareer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        stu.status === 'ALTA_CLARIDAD'
                          ? 'bg-emerald-50 text-emerald-700'
                          : stu.status === 'CONFLICTO_VOCACIONAL'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {stu.clarityIndex}% Claridad
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#829AB1]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal / Visor de Ficha Psicopedagógica para Padres */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#D6E5EF] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAF2F8] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8F7FB] flex items-center justify-center text-[#00C2E0]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0B2D4D]">
                      Ficha Psicopedagógica Institucional
                    </h3>
                    <p className="text-xs text-[#6A8AA3]">
                      Reporte Oficial para Padres de Familia y Tutores
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="text-xs font-bold text-[#829AB1] hover:text-[#0B2D4D]"
                >
                  ✕ Cerrar
                </button>
              </div>

              {/* Contenido de la Ficha Imprimible */}
              <div className="space-y-4 text-xs text-[#355B78] mb-6">
                <div className="grid grid-cols-2 gap-3 bg-[#F8FCFF] p-4 rounded-xl border border-[#E1EDF3]">
                  <div>
                    <span className="font-bold text-[#0B2D4D] block">Estudiante:</span>
                    <span>{selectedStudent.name}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#0B2D4D] block">Grado y Sección:</span>
                    <span>{selectedStudent.section} — Promoción 2026</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#0B2D4D] block">Perfil Holland (RIASEC):</span>
                    <span>{selectedStudent.riasecCode}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#0B2D4D] block">Índice de Certeza:</span>
                    <span className="font-bold text-[#00C2E0]">{selectedStudent.clarityIndex}%</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#0B2D4D] mb-1">Ruta Vocacional Sugerida:</h4>
                  <p className="bg-[#F0F5F9] p-3 rounded-lg text-[#082A4A] font-semibold">
                    {selectedStudent.topCareer}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0B2D4D] mb-1">Diagnóstico del Departamento Psicopedagógico:</h4>
                  <p className="leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-[#5C4516]">
                    {selectedStudent.recommendation}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-emerald-800 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    Datos contrastados contra las mallas y pensiones auditadas de universidades licenciadas por SUNEDU en Lima Norte.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAF2F8]">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D6E5EF] text-[#0B2D4D] text-xs font-bold hover:bg-[#F8FCFF] transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ficha para Padres</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Ficha enviada exitosamente al correo registrado de los padres de ${selectedStudent.name}.`);
                    setSelectedStudent(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00C2E0] hover:bg-[#0EA5C6] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <span>Enviar Notificación a Padres</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
