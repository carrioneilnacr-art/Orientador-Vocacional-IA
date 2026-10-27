'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardList,
  FileSpreadsheet,
  GraduationCap,
  LogOut,
  Menu,
  MessageSquareText,
  School,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react';
import type { StaffRole, StaffSessionPayload } from '@/lib/staffAuth';

const ROLE_LABELS: Record<StaffRole, string> = {
  ADMIN: 'Administración',
  DIRECTOR: 'Dirección',
  PSICOLOGO: 'Psicología',
  TUTOR: 'Tutoría',
};

const ROLE_INTROS: Record<StaffRole, { title: string; description: string }> = {
  ADMIN: {
    title: 'Organiza la operación de orientación',
    description: 'Gestiona aulas, accesos y registros para que el equipo pueda acompañar a sus estudiantes.',
  },
  DIRECTOR: {
    title: 'Sigue el avance de la orientación',
    description: 'Consulta el progreso institucional y coordina las actividades con el equipo escolar.',
  },
  PSICOLOGO: {
    title: 'Acompaña cada decisión vocacional',
    description: 'Revisa las exploraciones y convierte cada conversación en un próximo paso acordado.',
  },
  TUTOR: {
    title: 'Acompaña a tu aula',
    description: 'Ayuda a tus estudiantes a continuar su exploración y acerca sus dudas al equipo de orientación.',
  },
};

function LoadingView() {
  return (
    <main className="min-h-screen bg-chaski-page px-4 py-10 sm:px-8" aria-label="Cargando portal">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-12 w-56 rounded-xl bg-slate-200" />
        <div className="h-48 rounded-3xl bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-44 rounded-2xl bg-slate-200" />
          <div className="h-44 rounded-2xl bg-slate-200" />
          <div className="h-44 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </main>
  );
}

export default function ColegioDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<StaffSessionPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch('/api/colegio/staff/me', { cache: 'no-store' });
        const data: { authenticated?: boolean; staff?: StaffSessionPayload } = await response.json();
        if (!active) return;

        if (response.ok && data.authenticated && data.staff) {
          setSession(data.staff);
        } else if (response.status === 401 || !data.authenticated) {
          router.replace('/colegio/login');
        } else {
          setAuthError(true);
        }
      } catch {
        if (active) setAuthError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSession();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    try {
      await fetch('/api/colegio/staff/logout', { method: 'POST' });
    } finally {
      router.replace('/colegio/login');
      router.refresh();
    }
  }

  if (loading) return <LoadingView />;

  if (authError || !session) {
    return (
      <main className="grid min-h-screen place-items-center bg-chaski-page px-4">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
          <ShieldCheck className="mx-auto h-9 w-9 text-chaski-accent-ink" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-slate-900">No pudimos abrir tu espacio</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Revisa tu conexión e inténtalo otra vez. Si continúa, vuelve a iniciar sesión.</p>
          <button onClick={() => router.replace('/colegio/login')} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-chaski-action px-5 text-sm font-semibold text-chaski-action-text hover:bg-chaski-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">
            Ir al inicio de sesión
          </button>
        </section>
      </main>
    );
  }

  const role = session.role;
  const intro = ROLE_INTROS[role];
  const canImportGrades = role === 'ADMIN' || role === 'DIRECTOR';
  const isCounselor = role === 'PSICOLOGO' || role === 'TUTOR';

  const nav = [
    { href: '#inicio', label: 'Inicio', icon: School },
    ...(['ADMIN', 'DIRECTOR'].includes(role) ? [{ href: '/colegio/academico', label: 'Historial académico', icon: GraduationCap }] : []),
    { href: '#seguimiento', label: 'Seguimiento', icon: ClipboardList },
    { href: '#recursos', label: 'Recursos', icon: BookOpenCheck },
  ];

  return (
    <div className="min-h-screen bg-chaski-page text-slate-900">
      <header className="sticky top-0 z-30 border-b border-chaski-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" aria-label="Chaski, ir al inicio" className="flex shrink-0 items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-chaski-border bg-chaski-subtle">
                <Image src="/assets/chaski/chaski-10.png" alt="" width={26} height={26} className="object-contain" />
              </span>
              <span className="hidden text-sm font-bold tracking-tight text-chaski-heading sm:block">Chaski Colegios</span>
            </Link>
            <span className="hidden h-7 w-px bg-slate-200 sm:block" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{session.schoolName}</p>
              <p className="text-xs text-slate-500">Espacio de orientación escolar</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full border border-chaski-border bg-chaski-subtle px-3 py-1.5 text-xs font-medium text-chaski-accent-ink sm:inline-flex">{ROLE_LABELS[role]}</span>
            <span className="hidden text-right md:block">
              <span className="block max-w-44 truncate text-xs font-semibold text-slate-800">{session.fullName}</span>
              <span className="block text-[11px] text-slate-500">Cuenta institucional</span>
            </span>
            <button onClick={handleLogout} aria-label="Cerrar sesión" title="Cerrar sesión" className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink sm:inline-flex">
              <LogOut className="h-4 w-4" />
            </button>
            <button onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileMenuOpen} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 sm:hidden">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="border-t border-slate-100 bg-white px-4 py-3 sm:hidden" aria-label="Navegación principal">
            <div className="space-y-1">
              {nav.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-700 hover:bg-chaski-subtle">
                  <Icon className="h-4 w-4 text-chaski-accent-ink" />{label}
                </Link>
              ))}
              <button onClick={handleLogout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"><LogOut className="h-4 w-4" />Cerrar sesión</button>
            </div>
          </nav>
        )}
      </header>

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[224px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-68px)] border-r border-chaski-border bg-white px-4 py-7 lg:block">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Espacio de trabajo</p>
          <nav className="mt-3 space-y-1" aria-label="Navegación principal">
            {nav.map(({ href, label, icon: Icon }, index) => (
              <Link key={href} href={href} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${index === 0 ? 'bg-chaski-subtle text-chaski-action' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Icon className="h-[17px] w-[17px]" />{label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 border-t border-slate-100 pt-5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Tu perfil</p>
            <div className="mt-3 rounded-2xl bg-chaski-page p-3">
              <p className="text-xs font-semibold text-slate-800">{ROLE_LABELS[role]}</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">{session.classroomAssigned ? `Aula asignada: ${session.classroomAssigned}` : 'Acceso según tus responsabilidades.'}</p>
            </div>
          </div>
        </aside>

        <main id="inicio" className="min-w-0 px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:pt-10">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-chaski-accent-ink">{ROLE_LABELS[role]} · {session.schoolName}</p>
                <h1 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-chaski-heading sm:text-3xl">{intro.title}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{intro.description}</p>
              </div>
              {canImportGrades && (
                <Link href="/colegio/notas/importar" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-chaski-action px-4 text-sm font-semibold text-chaski-action-text shadow-sm transition hover:bg-chaski-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">
                  <FileSpreadsheet className="h-4 w-4" /> Importar registros <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <section id="seguimiento" className="mt-7 rounded-3xl border border-chaski-border bg-white p-5 shadow-[0_4px_22px_rgba(11,45,77,0.035)] sm:mt-9 sm:p-7" aria-labelledby="followup-title">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-chaski-subtle text-chaski-accent-ink"><MessageSquareText className="h-5 w-5" /></span>
                <div>
                  <h2 id="followup-title" className="text-base font-semibold text-chaski-heading">Seguimiento y próximos pasos</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Un espacio para que el equipo transforme las exploraciones vocacionales en conversaciones y acciones acordadas.</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-chaski-border bg-chaski-page px-5 py-8 text-center sm:px-10 sm:py-10">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-chaski-accent-ink shadow-sm ring-1 ring-chaski-border"><ClipboardList className="h-5 w-5" /></span>
                <h3 className="mt-4 text-sm font-semibold text-slate-800">La bandeja de seguimiento se habilitará al conectar los registros del colegio</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">Aquí aparecerán las solicitudes de conversación y las acciones acordadas por el equipo. No mostramos casos de demostración como si fueran estudiantes reales.</p>
                {isCounselor && <p className="mt-3 text-xs font-medium text-chaski-accent-ink">Cuando haya solicitudes, podrás asignar responsable, fecha y estado de atención.</p>}
              </div>
            </section>

            <section id="recursos" className="mt-7" aria-labelledby="resources-title">
              <div className="mb-4">
                <h2 id="resources-title" className="text-base font-semibold text-chaski-heading">Herramientas del colegio</h2>
                <p className="mt-1 text-sm text-slate-600">Accesos disponibles para preparar y acompañar el proceso.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {['ADMIN', 'DIRECTOR'].includes(role) && (
                  <Link href="/colegio/academico" className="group flex min-h-[148px] items-start justify-between gap-4 rounded-2xl border border-chaski-border bg-white p-5 transition hover:border-chaski-border-hover hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">
                    <div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-chaski-subtle text-chaski-accent-ink"><GraduationCap className="h-5 w-5" /></span>
                      <h3 className="mt-4 text-sm font-semibold text-slate-800">Historial académico</h3>
                      <p className="mt-1 max-w-sm text-sm leading-5 text-slate-500">Revisa notas, puestos, asistencia y hábitos escolares por bimestre.</p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-chaski-accent-ink" />
                  </Link>
                )}
                {canImportGrades ? (
                  <Link href="/colegio/notas/importar" className="group flex min-h-[148px] items-start justify-between gap-4 rounded-2xl border border-chaski-border bg-white p-5 transition hover:border-chaski-border-hover hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">
                    <div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-chaski-subtle text-chaski-accent-ink"><FileSpreadsheet className="h-5 w-5" /></span>
                      <h3 className="mt-4 text-sm font-semibold text-slate-800">Importar registros académicos</h3>
                      <p className="mt-1 max-w-sm text-sm leading-5 text-slate-500">Carga un archivo y revisa las filas antes de confirmar los datos.</p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-chaski-accent-ink" />
                  </Link>
                ) : (
                  <div className="flex min-h-[148px] items-start gap-4 rounded-2xl border border-chaski-border bg-white p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-chaski-subtle text-chaski-accent-ink"><UsersRound className="h-5 w-5" /></span>
                    <div><h3 className="text-sm font-semibold text-slate-800">Acompañamiento por rol</h3><p className="mt-1 text-sm leading-5 text-slate-500">Tu acceso se limita a las tareas correspondientes a {ROLE_LABELS[role].toLowerCase()}.</p></div>
                  </div>
                )}
                <div className="flex min-h-[148px] items-start gap-4 rounded-2xl border border-chaski-border bg-white p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-chaski-page text-slate-600"><ShieldCheck className="h-5 w-5" /></span>
                  <div><h3 className="text-sm font-semibold text-slate-800">Privacidad y uso responsable</h3><p className="mt-1 text-sm leading-5 text-slate-500">Los resultados orientan conversaciones; no reemplazan la evaluación ni el criterio del profesional.</p></div>
                </div>
              </div>
            </section>

            <footer className="mt-8 flex flex-col gap-2 border-t border-chaski-border pt-5 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>Portal institucional · {session.schoolName}</span>
              <span>Acceso personal y sujeto a tus permisos</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
