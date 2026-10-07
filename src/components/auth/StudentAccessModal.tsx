'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { KeyRound, School, CheckCircle2, AlertCircle, ArrowRight, X, ShieldCheck } from 'lucide-react';

interface StudentAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  testId?: string; // Si viene de la pantalla de resultados para vincular
  onSuccess?: (studentData: any) => void;
}

export function StudentAccessModal({ isOpen, onClose, testId, onSuccess }: StudentAccessModalProps) {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any | null>(null);
  const [consentPending, setConsentPending] = useState(false);
  const [consentLoading, setConsentLoading] = useState(false);

  if (!isOpen) return null;

  // Auto-formatear código a mayúsculas y guión sugerido
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (val.length === 3 && !val.includes('-') && !accessCode.includes('-')) {
      val = val + '-';
    }
    setAccessCode(val);
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError('Por favor ingresa tu código de acceso.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Si no viene testId por prop, intentar buscarlo en sessionStorage
      const currentTestId = testId || (typeof window !== 'undefined' ? sessionStorage.getItem('chaski_test_id') || undefined : undefined);

      const res = await fetch('/api/colegio/acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessCode: accessCode.trim(),
          testId: currentTestId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Código de acceso no reconocido.');
      }

      setStudentData(data.student);

      if (data.student.consentStatus === 'PENDING') {
        setConsentPending(true);
      } else {
        if (onSuccess) onSuccess(data.student);
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmConsent = async (granted: boolean) => {
    setConsentLoading(true);
    try {
      const res = await fetch('/api/colegio/consentimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentGranted: granted }),
      });

      if (!res.ok) throw new Error('Error al registrar consentimiento.');

      setConsentPending(false);
      if (onSuccess && studentData) onSuccess(studentData);
      onClose();
    } catch (err: any) {
      setError('No se pudo guardar el consentimiento. Inténtalo nuevamente.');
    } finally {
      setConsentLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2D4D]/40 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 
        Concentric border radius: outer modal rounded-2xl (16px), inner card rounded-xl (12px), button rounded-lg (8px)
        Shadow layered transparent depth
      */}
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E1EDF3] overflow-hidden">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors focus:ring-2 focus:ring-[#08BBD5] focus:outline-none"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── PASO 1: FORMULARIO DE ACCESO POR CÓDIGO ── */}
        {!studentData ? (
          <div>
            {/* Header con Chaski y Título */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#F5FAFD] border border-[#08BBD5]/30 flex-shrink-0">
                <Image
                  src="/assets/chaski/chaski-10.png"
                  alt="Chaski Guía"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider text-[#08BBD5] uppercase">
                  Acceso Escolar
                </span>
                <h3 id="modal-title" className="text-lg font-bold text-[#0B2D4D] leading-tight">
                  Ingresa tu Código de Alumno
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              Si tu colegio te entregó una tarjeta o ficha con tu código (ej. <span className="font-mono font-medium text-slate-800">HON-7K9P</span>), ingrésalo aquí para vincular tu test y acceder a tus recomendaciones.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="accessCodeInput" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Código de Acceso
                </label>
                <div className="relative">
                  <input
                    id="accessCodeInput"
                    type="text"
                    value={accessCode}
                    onChange={handleCodeChange}
                    placeholder="HON-XXXX"
                    maxLength={15}
                    autoFocus
                    className="w-full h-12 px-4 font-mono text-center text-lg sm:text-xl font-bold tracking-widest text-[#0B2D4D] bg-[#F5FAFD] border border-[#CBDDE6] rounded-xl focus:border-[#08BBD5] focus:ring-2 focus:ring-[#08BBD5]/20 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:font-normal"
                  />
                  <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Botón de acción con scale(0.96) en click (better-ui) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 text-white font-semibold text-sm rounded-xl bg-[#08BBD5] hover:bg-[#07A7BF] active:scale-[0.96] transition-all duration-100 shadow-[0_2px_10px_rgba(8,187,213,0.35)] disabled:opacity-60 disabled:pointer-events-none"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar a mi Ficha</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privacidad garantizada bajo Ley 29733</span>
            </div>
          </div>
        ) : consentPending ? (
          /* ── PASO 2: CONSENTIMIENTO INFORMADO (LEY 29733) ── */
          <div className="animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 mb-4 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Código Verificado</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5FAFD] border border-[#CBDDE6] mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bienvenido/a</p>
              <h4 className="text-base font-bold text-[#0B2D4D]">{studentData.fullName}</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {studentData.schoolName} {studentData.classroom ? `• ${studentData.classroom}` : ''}
              </p>
            </div>

            <h3 className="text-sm font-bold text-[#0B2D4D] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#08BBD5]" />
              Consentimiento de Tratamiento de Datos
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Para vincular tus resultados vocacionales con el plan de tutoría de tu colegio y permitir que tu psicólogo/tutor te brinde orientación personalizada, necesitamos confirmar tu consentimiento conforme a la <strong>Ley 29733</strong> de Protección de Datos Personales. Tus datos nunca serán compartidos con terceros ni con fines comerciales.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => handleConfirmConsent(true)}
                disabled={consentLoading}
                className="flex-1 h-11 flex items-center justify-center text-white text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.96] transition-all shadow-[0_2px_8px_rgba(16,185,129,0.3)] disabled:opacity-60"
              >
                {consentLoading ? 'Guardando...' : 'Acepto y Continuar'}
              </button>
              <button
                onClick={() => handleConfirmConsent(false)}
                disabled={consentLoading}
                className="h-11 px-4 flex items-center justify-center text-slate-600 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-[0.96] transition-all"
              >
                Continuar en Modo Anónimo
              </button>
            </div>
          </div>
        ) : (
          /* ── PASO 3: ÉXITO Y BIENVENIDA ── */
          <div className="text-center py-2 animate-in fade-in duration-200">
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#0B2D4D] mb-1">¡Perfil Conectado!</h3>
            <p className="text-sm text-slate-600 mb-2">
              Hola, <span className="font-semibold text-slate-900">{studentData.fullName}</span>.
            </p>
            <p className="text-xs text-slate-500 mb-5">
              Tu test ha sido vinculado exitosamente a tu ficha del <strong>{studentData.schoolName}</strong>.
            </p>
            <button
              onClick={onClose}
              className="w-full h-12 flex items-center justify-center gap-2 text-white font-semibold text-sm rounded-xl bg-[#08BBD5] hover:bg-[#07A7BF] active:scale-[0.96] transition-all shadow-md"
            >
              <span>Continuar Explorando</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
