'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { KeyRound, School, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function AccesoColegioPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any | null>(null);
  const [consentPending, setConsentPending] = useState(false);
  const [consentLoading, setConsentLoading] = useState(false);

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
      setError('Por favor ingresa tu código de acceso escolar.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentTestId = typeof window !== 'undefined' ? sessionStorage.getItem('chaski_test_id') || undefined : undefined;

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
        throw new Error(data.error || 'Código no reconocido.');
      }

      setStudentData(data.student);
      if (data.student.consentStatus === 'PENDING') {
        setConsentPending(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con tu colegio.');
    } finally {
      setLoading(false);
    }
  };

  const handleConsent = async (granted: boolean) => {
    setConsentLoading(true);
    try {
      await fetch('/api/colegio/consentimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentGranted: granted }),
      });
      setConsentPending(false);
    } catch {
      setError('Error al registrar consentimiento.');
    } finally {
      setConsentLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between font-sans relative overflow-hidden"
      style={{ background: '#F5FAFD' }}
    >
      {/* ── NAVBAR SIMPLE ── */}
      <header className="relative z-10 w-full flex items-center justify-between px-6 md:px-12 py-5 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-white border border-[#CBDDE6] flex items-center justify-center shadow-sm relative overflow-hidden">
            <Image
              src="/assets/chaski/chaski-10.png"
              alt="Chaski"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-[#0B2D4D] text-sm tracking-tight group-hover:text-[#08BBD5] transition-colors">
            Orientador Vocacional IA
          </span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <School className="w-4 h-4 text-[#08BBD5]" />
          <span>Portal de Colegios Aliados</span>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Tarjeta con principios Jakub Krehel: concentric radius (rounded-3xl exterior, rounded-2xl interior), layered shadow */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(11,45,77,0.06),0_1px_4px_rgba(0,0,0,0.03)] border border-[#E1EDF3]">
            {!studentData ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto mb-3.5 rounded-full bg-[#E8F8FA] border border-[#08BBD5]/20 flex items-center justify-center text-[#08BBD5]">
                    <KeyRound className="w-7 h-7" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#0B2D4D] tracking-tight">
                    Acceso para Alumnos
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
                    Ingresa el código que te entregó tu colegio para activar tu ficha vocacional y enlazar tus resultados con tu tutor.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="code" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Código de Acceso
                    </label>
                    <div className="relative">
                      <input
                        id="code"
                        type="text"
                        value={accessCode}
                        onChange={handleCodeChange}
                        placeholder="HON-XXXX"
                        maxLength={15}
                        autoFocus
                        className="w-full h-13 px-4 font-mono text-center text-xl sm:text-2xl font-bold tracking-widest text-[#0B2D4D] bg-[#F5FAFD] border border-[#CBDDE6] rounded-2xl focus:border-[#08BBD5] focus:ring-2 focus:ring-[#08BBD5]/20 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:font-normal"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Botón táctil con active:scale-[0.96] */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 flex items-center justify-center gap-2 text-white font-semibold text-sm rounded-xl bg-[#08BBD5] hover:bg-[#07A7BF] active:scale-[0.96] transition-all duration-100 shadow-[0_2px_10px_rgba(8,187,213,0.35)] disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Ingresar a mi Ficha</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Protegido por la Ley 29733 de Datos Personales</span>
                </div>
              </>
            ) : consentPending ? (
              /* ── PANTALLA CONSENTIMIENTO INFORMADO ── */
              <div className="animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-700 mb-3 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Código Verificado</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5FAFD] border border-[#CBDDE6] mb-5">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Estudiante Reconocido</p>
                  <h2 className="text-lg font-bold text-[#0B2D4D]">{studentData.fullName}</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {studentData.schoolName} {studentData.classroom ? `• ${studentData.classroom}` : ''}
                  </p>
                </div>

                <h3 className="text-sm font-bold text-[#0B2D4D] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#08BBD5]" />
                  Consentimiento de Tratamiento Vocacional
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Tu colegio utilizará los resultados de este test vocacional exclusivamente para guiarte en tutoría académica y psicopedagógica. Conforme a la <strong>Ley 29733</strong>, tus datos nunca se venderán ni compartirán con universidades sin autorización explícita.
                </p>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => handleConsent(true)}
                    disabled={consentLoading}
                    className="w-full h-12 flex items-center justify-center text-white text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.96] transition-all shadow-md"
                  >
                    {consentLoading ? 'Guardando...' : 'Acepto y Activar Ficha'}
                  </button>
                  <button
                    onClick={() => handleConsent(false)}
                    disabled={consentLoading}
                    className="w-full h-10 flex items-center justify-center text-slate-600 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.96] transition-all"
                  >
                    Continuar como Invitado Anónimo
                  </button>
                </div>
              </div>
            ) : (
              /* ── PANTALLA ÉXITO ── */
              <div className="text-center py-4 animate-in fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="text-xl font-bold text-[#0B2D4D] mb-1">¡Bienvenido, {studentData.fullName}!</h2>
                <p className="text-xs text-slate-600 mb-6">
                  Tu perfil del <strong>{studentData.schoolName}</strong> está listo. Ahora puedes realizar el test o revisar tus resultados.
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/cuestionario"
                    className="w-full h-12 flex items-center justify-center gap-2 text-white font-semibold text-sm rounded-xl bg-[#08BBD5] hover:bg-[#07A7BF] active:scale-[0.96] transition-all shadow-md"
                  >
                    <span>Iniciar Cuestionario Vocacional</span>
                    <Sparkles className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/resultados"
                    className="w-full h-11 flex items-center justify-center gap-2 text-[#0B2D4D] font-medium text-xs rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.96] transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Ver Últimos Resultados Guardados</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FOOTER SIMPLE ── */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-400">
        © 2026 Orientador Vocacional IA • Desarrollado para colegios de Lima Norte
      </footer>
    </main>
  );
}
