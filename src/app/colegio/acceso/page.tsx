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
      const res = await fetch('/api/colegio/acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: accessCode.trim() }),
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
      style={{ background: 'var(--chaski-page)' }}
    >
      {/* ── NAVBAR SIMPLE ── */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 border-b border-chaski-border bg-white px-4 py-3 sm:px-6 md:border-b-0 md:bg-transparent md:px-12 md:py-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-chaski-border bg-white shadow-sm">
            <Image
              src="/assets/chaski/chaski-10.png"
              alt="Chaski"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-chaski-heading transition-colors group-hover:text-chaski-accent-ink">
            Chaski Colegios
          </span>
        </Link>
        <div className="hidden items-center gap-2 text-xs font-semibold text-slate-500 sm:flex">
          <School className="h-4 w-4 text-chaski-accent-ink" />
          <span>Acceso de estudiante</span>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Tarjeta con principios Jakub Krehel: concentric radius (rounded-3xl exterior, rounded-2xl interior), layered shadow */}
          <div className="rounded-[28px] border border-chaski-border bg-white p-6 shadow-[0_8px_32px_rgba(11,45,77,0.05)] sm:p-9">
            {!studentData ? (
              <>
                <Link href="/colegio/login" className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-xl px-2 text-xs font-semibold text-chaski-accent-ink transition hover:bg-chaski-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">
                  <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" /> Acceso del equipo escolar
                </Link>
                <div className="text-center mb-6">
                  <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl border border-chaski-accent-ink/10 bg-chaski-subtle text-chaski-accent-ink">
                    <KeyRound className="w-7 h-7" />
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-chaski-heading">
                    Acceso para Alumnos
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
                    Ingresa el código que te entregó tu colegio para acceder a tu espacio de orientación.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-slate-700">
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
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? 'access-error' : undefined}
                        className="min-h-12 w-full rounded-2xl border border-chaski-border bg-white px-4 text-center font-mono text-xl font-bold tracking-widest text-chaski-heading outline-none transition placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-chaski-accent-ink focus:ring-4 focus:ring-chaski-accent-ink/10 sm:text-2xl"
                      />
                    </div>
                  </div>

                  {error && (
                    <div id="access-error" role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Botón táctil con active:scale-[0.96] */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-chaski-action text-sm font-semibold text-chaski-action-text shadow-sm transition hover:bg-chaski-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-chaski-action-text border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Ingresar a mi Ficha</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-chaski-accent-ink" />
                  <span>Protegido por la Ley 29733 de Datos Personales</span>
                </div>
              </>
            ) : consentPending ? (
              /* ── PANTALLA CONSENTIMIENTO INFORMADO ── */
              <div className="animate-in fade-in">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-chaski-accent-ink">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Código Verificado</span>
                </div>

                <div className="mb-5 rounded-2xl border border-chaski-border bg-chaski-page p-4">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Estudiante Reconocido</p>
                  <h2 className="text-lg font-semibold text-chaski-heading">{studentData.fullName}</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {studentData.schoolName} {studentData.classroom ? `• ${studentData.classroom}` : ''}
                  </p>
                </div>

                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-chaski-heading">
                  <ShieldCheck className="h-4 w-4 text-chaski-accent-ink" />
                  Consentimiento de Tratamiento Vocacional
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Tu colegio utilizará los resultados de este test vocacional exclusivamente para guiarte en tutoría académica y psicopedagógica. Conforme a la <strong>Ley 29733</strong>, tus datos nunca se venderán ni compartirán con universidades sin autorización explícita.
                </p>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => handleConsent(true)}
                    disabled={consentLoading}
                    className="flex min-h-12 w-full items-center justify-center rounded-xl bg-chaski-action text-sm font-semibold text-chaski-action-text shadow-sm transition hover:bg-chaski-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {consentLoading ? 'Guardando...' : 'Acepto y Activar Ficha'}
                  </button>
                  <button
                    onClick={() => handleConsent(false)}
                    disabled={consentLoading}
                    className="flex min-h-11 w-full items-center justify-center rounded-xl border border-chaski-border bg-white text-sm font-medium text-slate-700 transition hover:bg-chaski-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
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
                <h2 className="mb-1 text-xl font-semibold text-chaski-heading">¡Bienvenido, {studentData.fullName}!</h2>
                <p className="text-xs text-slate-600 mb-6">
                  Tu perfil del <strong>{studentData.schoolName}</strong> está listo. Ahora puedes realizar el test o revisar tus resultados.
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/cuestionario"
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-chaski-action text-sm font-semibold text-chaski-action-text shadow-sm transition hover:bg-chaski-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink"
                  >
                    <span>Iniciar Cuestionario Vocacional</span>
                    <Sparkles className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/resultados"
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-chaski-border bg-white text-sm font-medium text-chaski-accent-ink transition hover:bg-chaski-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink"
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
      <footer className="relative z-10 border-t border-chaski-border bg-white px-4 py-4 text-center text-xs text-slate-500">
        Chaski · Orientación vocacional para colegios
      </footer>
    </main>
  );
}
