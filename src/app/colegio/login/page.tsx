'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  Brain,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { DEMO_STAFF_ACCOUNTS, StaffRole } from '@/lib/staffAuth';

export default function ColegioStaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRolePreset, setSelectedRolePreset] = useState<StaffRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPreset = (role: StaffRole) => {
    const demo = DEMO_STAFF_ACCOUNTS.find((u) => u.role === role);
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
      setSelectedRolePreset(role);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Por favor ingresa tu correo institucional y contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/colegio/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      // Redirigir al dashboard escolar
      router.push('/colegio/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al autenticar con el servidor escolar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between font-sans relative overflow-hidden"
      style={{ background: '#F5FAFD' }}
    >
      {/* ── BACKGROUND ACCENTS ── */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#08BBD5]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#0B2D4D]/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── HEADER ── */}
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
        <Link
          href="/colegio/acceso"
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0B2D4D] bg-white/80 border border-[#CBDDE6] px-3.5 py-1.5 rounded-xl transition-all active:scale-[0.96]"
        >
          <span>¿Eres estudiante? Ingresa aquí</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Tarjeta externa con concentric border radius: rounded-3xl (24px) exterior */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(11,45,77,0.06),0_1px_4px_rgba(0,0,0,0.03)] border border-[#E1EDF3]">
            {/* Cabecera del formulario */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3.5 rounded-full bg-[#E8F8FA] border border-[#08BBD5]/20 flex items-center justify-center text-[#08BBD5] shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-[#0B2D4D] tracking-tight">
                Portal de Gestión Escolar
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Acceso para Administradores, Psicólogos, Tutores y Dirección del colegio.
              </p>
            </div>

            {/* Selector de Acceso Rápido Demo (concentric radius: rounded-2xl interior) */}
            <div className="mb-6 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#08BBD5]" />
                  Acceso Rápido de Prueba
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Demo Colegios</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPreset('ADMIN')}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left active:scale-[0.96] ${
                    selectedRolePreset === 'ADMIN'
                      ? 'bg-[#0B2D4D] text-white border-[#0B2D4D] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#08BBD5]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-bold leading-tight">Admin TI</p>
                    <p className="text-[10px] opacity-75">Importador & RBAC</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('PSICOLOGO')}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left active:scale-[0.96] ${
                    selectedRolePreset === 'PSICOLOGO'
                      ? 'bg-[#08BBD5] text-white border-[#08BBD5] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#08BBD5]'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-bold leading-tight">Psicología</p>
                    <p className="text-[10px] opacity-75">Fichas & Alertas</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('TUTOR')}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left active:scale-[0.96] ${
                    selectedRolePreset === 'TUTOR'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-bold leading-tight">Tutor Aula</p>
                    <p className="text-[10px] opacity-75">Avance 5° "A"</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('DIRECTOR')}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left active:scale-[0.96] ${
                    selectedRolePreset === 'DIRECTOR'
                      ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-bold leading-tight">Dirección</p>
                    <p className="text-[10px] opacity-75">KPIs & Convenios</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider"
                >
                  Correo Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="usuario@honores.edu.pe"
                    required
                    className="w-full h-11 pl-10 pr-3.5 text-sm font-medium text-[#0B2D4D] bg-[#F5FAFD] border border-[#CBDDE6] rounded-xl focus:border-[#08BBD5] focus:ring-2 focus:ring-[#08BBD5]/20 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="••••••••"
                    required
                    className="w-full h-11 pl-10 pr-10 text-sm font-medium text-[#0B2D4D] bg-[#F5FAFD] border border-[#CBDDE6] rounded-xl focus:border-[#08BBD5] focus:ring-2 focus:ring-[#08BBD5]/20 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 active:scale-[0.96] transition-transform"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#0B2D4D] hover:bg-[#08BBD5] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.96] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Ingresar al Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E1EDF3] flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Sistema Escolar Activo
              </span>
              <span>Colegio Matemático Honores</span>
            </div>
          </div>

          {/* Garantía legal y privacidad */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-600 leading-relaxed max-w-sm mx-auto">
              Plataforma protegida con HMAC SHA-256 en cumplimiento con la Ley N° 29733 de
              Protección de Datos Personales del Perú.
            </p>
          </div>
        </div>
      </div>

      {/* ── FOOTER SIMPLE ── */}
      <footer className="relative z-10 w-full text-center py-4 border-t border-[#E1EDF3] text-xs text-slate-500">
        <p>© 2026 Chaski Vocacional IA. Módulo Institucional para Colegios Aliados.</p>
      </footer>
    </main>
  );
}
