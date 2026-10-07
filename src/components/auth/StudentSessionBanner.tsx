'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { School, ChevronDown, ChevronUp, LogOut, KeyRound, CheckCircle2, Clock } from 'lucide-react';
import { useStudentSession } from '@/hooks/useStudentSession';

// ── Íconos de estado de consentimiento (concurren con currentColor, fill activo) ──
function ConsentBadge({ status }: { status: 'PENDING' | 'GRANTED' | 'REVOKED' }) {
  const map = {
    GRANTED: { label: 'Consentido', icon: CheckCircle2, cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    PENDING: { label: 'Pendiente', icon: Clock, cls: 'text-amber-700 bg-amber-50 border-amber-200' },
    REVOKED: { label: 'Anónimo', icon: KeyRound, cls: 'text-slate-500 bg-slate-50 border-slate-200' },
  };
  const { label, icon: Icon, cls } = map[status] || map.REVOKED;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold leading-none ${cls}`}>
      <Icon className="w-2.5 h-2.5" strokeWidth={2.5} />
      {label}
    </span>
  );
}

export function StudentSessionBanner() {
  const { student, isAuthenticated, isLoading, logout } = useStudentSession();
  const [expanded, setExpanded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // No renderizar nada mientras carga, ni si no hay sesión
  if (isLoading || !isAuthenticated || !student) return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setExpanded(false);
  };

  return (
    <div
      className="w-full border-b border-[#E1EDF3] bg-white"
      role="region"
      aria-label="Sesión de alumno activa"
    >
      {/* ── BARRA COLAPSADA (siempre visible cuando autenticado) ──
          Layout: espacio 12px intra-group → 24px entre grupos (better-layout)
          Stroke de ícono 1.5px junto a texto regular (better-ui) */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-2.5 hover:bg-[#F5FAFD] transition-colors focus:outline-none focus:ring-inset focus:ring-2 focus:ring-[#08BBD5]/30"
        aria-expanded={expanded}
        aria-controls="student-session-detail"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Ícono con stroke que coincide con texto regular (1.5px) */}
          <School className="w-4 h-4 text-[#08BBD5] flex-shrink-0" strokeWidth={1.5} />
          <span className="text-xs text-slate-600 truncate">
            <span className="font-semibold text-[#0B2D4D]">{student.fullName}</span>
            {student.schoolName && (
              <span className="hidden sm:inline text-slate-400"> · {student.schoolName}</span>
            )}
            {student.classroom && (
              <span className="hidden md:inline text-slate-400"> · {student.classroom}</span>
            )}
          </span>
          <ConsentBadge status={student.consentStatus} />
        </div>
        {/* Animación interruptible: CSS transition, no keyframe (better-ui) */}
        <div className="flex-shrink-0 ml-2 text-slate-400">
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5" strokeWidth={2} />
            : <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />}
        </div>
      </button>

      {/* ── PANEL EXPANDIDO: stagger de 100ms entre chunks semánticos (better-ui) ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="student-session-detail"
            key="session-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-4 pt-3 border-t border-[#F0F5F8]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Grupo: datos del alumno — 8px intra, 16px inter */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ficha Activa</p>
                  <p className="text-sm font-bold text-[#0B2D4D]">{student.fullName}</p>
                  <p className="text-xs text-slate-500">
                    Código: <span className="font-mono font-semibold text-slate-700">{student.studentCode}</span>
                  </p>
                  {student.consentStatus === 'PENDING' && (
                    <Link
                      href="/colegio/acceso"
                      className="inline-flex items-center gap-1 text-xs text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors"
                    >
                      <Clock className="w-3 h-3" strokeWidth={2} />
                      Consentimiento pendiente → completar aquí
                    </Link>
                  )}
                </div>

                {/* Grupo: acciones — 12px de separación entre botones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 active:scale-[0.96] transition-[background-color,scale] duration-100 disabled:opacity-60"
                  >
                    <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {loggingOut ? 'Saliendo...' : 'Cerrar Sesión'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
