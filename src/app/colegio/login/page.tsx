'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

export default function ColegioStaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Ingresa tu correo institucional y contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/colegio/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudieron verificar las credenciales.');
      router.push('/colegio/dashboard');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'No se pudo conectar con el portal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#F7F9F7] text-slate-900">
      <header className="border-b border-[#E4EAE5] bg-white">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/colegio" className="flex min-w-0 items-center gap-2.5" aria-label="Chaski Colegios, volver al portal">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E3EBE5] bg-[#F2F7F3]">
              <Image src="/assets/chaski/chaski-10.png" alt="" width={26} height={26} className="object-contain" />
            </span>
            <span className="truncate text-sm font-bold tracking-tight text-[#183C31]">Chaski Colegios</span>
          </Link>
          <Link href="/colegio/acceso" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-[#285B45] transition hover:bg-[#F2F7F3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5D49] sm:gap-2 sm:px-4 sm:text-sm">
            Acceso estudiante <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-md">
          <section className="rounded-[28px] border border-[#E1E9E2] bg-white p-6 shadow-[0_8px_32px_rgba(28,60,49,0.05)] sm:p-9" aria-labelledby="login-title">
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF5EF] text-[#32745A]">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#32745A]">Acceso institucional</p>
              <h1 id="login-title" className="mt-2 text-2xl font-semibold tracking-tight text-[#183C31]">Ingresa al espacio escolar</h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">Usa la cuenta que te asignó el administrador de tu colegio.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Correo institucional</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    inputMode="email"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); if (error) setError(null); }}
                    placeholder="nombre@colegio.edu.pe"
                    required
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'login-error' : undefined}
                    className="h-12 w-full rounded-xl border border-[#D7E2D9] bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#32745A] focus:ring-4 focus:ring-[#32745A]/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Contraseña</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => { setPassword(event.target.value); if (error) setError(null); }}
                    placeholder="Ingresa tu contraseña"
                    required
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'login-error' : undefined}
                    className="h-12 w-full rounded-xl border border-[#D7E2D9] bg-white pl-10 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#32745A] focus:ring-4 focus:ring-[#32745A]/10"
                  />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#F2F7F3] hover:text-[#285B45] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1D5D49]">
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {error && (
                <p id="login-error" role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700">{error}</p>
              )}

              <button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1D5D49] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#154936] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5D49] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" /><span>Verificando acceso…</span></>
                ) : (
                  <>Ingresar al portal <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-500">Los permisos de acceso dependen del rol asignado por tu institución.</p>
          </section>

          <p className="mx-auto mt-4 max-w-sm text-center text-xs leading-5 text-slate-500">La información del estudiantado se consulta solo para las tareas autorizadas del colegio.</p>
        </div>
      </div>
    </main>
  );
}
