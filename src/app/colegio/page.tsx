import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, MessageCircleHeart, ShieldCheck, UsersRound } from 'lucide-react';

const supportAreas = [
  {
    icon: MessageCircleHeart,
    title: 'Conversaciones con propósito',
    description: 'Usa los intereses vocacionales como punto de partida para escuchar y orientar a cada estudiante.',
  },
  {
    icon: UsersRound,
    title: 'Trabajo coordinado',
    description: 'Psicología, tutoría y dirección colaboran con tareas acordes a sus responsabilidades.',
  },
  {
    icon: BookOpenCheck,
    title: 'Opciones para explorar',
    description: 'Estudiantes y familias pueden revisar carreras y fuentes académicas disponibles.',
  },
];

export default function ColegioPortalPage() {
  return (
    <main className="min-h-screen bg-chaski-page text-slate-900">
      <header className="border-b border-chaski-border bg-white">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Chaski, ir al inicio">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-chaski-border bg-chaski-subtle">
              <Image src="/assets/chaski/chaski-10.png" alt="" width={26} height={26} className="object-contain" />
            </span>
            <span className="text-sm font-bold tracking-tight text-chaski-heading">Chaski Colegios</span>
          </Link>
          <Link href="/colegio/login" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-chaski-action px-4 text-sm font-semibold text-chaski-action-text transition hover:bg-chaski-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">
            Acceso del equipo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-14 pt-9 sm:px-6 sm:pt-14">
        <section className="grid items-center gap-8 rounded-[28px] border border-chaski-border bg-white p-6 shadow-[0_8px_32px_rgba(11,45,77,0.04)] sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:p-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-chaski-subtle px-3 py-1.5 text-xs font-semibold text-chaski-accent-ink"><ShieldCheck className="h-3.5 w-3.5" /> Orientación vocacional con acompañamiento escolar</p>
            <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-chaski-heading sm:text-4xl lg:text-[42px]">Un siguiente paso claro para cada estudiante</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">Chaski ayuda al colegio a acompañar la exploración vocacional: abre conversaciones entre estudiantes y adultos de confianza, y conecta sus intereses con opciones académicas que pueden investigar.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/colegio/login" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-chaski-action px-5 text-sm font-semibold text-chaski-action-text shadow-sm transition hover:bg-chaski-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">Ingresar como personal <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/colegio/acceso" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-chaski-border bg-white px-5 text-sm font-semibold text-chaski-accent-ink transition hover:bg-chaski-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">Tengo un código de estudiante</Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Los resultados ayudan a iniciar una conversación; no son un diagnóstico ni deciden una carrera por el estudiante.</p>
          </div>

          <div className="rounded-3xl bg-chaski-subtle p-5 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-chaski-accent-ink">Cómo acompaña el colegio</p>
            <ol className="mt-5 space-y-4">
              {[
                ['01', 'Explorar', 'El estudiante responde una experiencia vocacional y conoce sus intereses.'],
                ['02', 'Conversar', 'Un adulto de confianza escucha sus preguntas y explora alternativas con él.'],
                ['03', 'Continuar', 'El equipo acuerda un próximo paso que el estudiante puede llevar adelante.'],
              ].map(([number, title, description]) => (
                <li key={number} className="flex gap-4 rounded-2xl border border-chaski-border bg-white p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-chaski-subtle text-xs font-bold text-chaski-accent-ink">{number}</span>
                  <div><h2 className="text-sm font-semibold text-slate-800">{title}</h2><p className="mt-1 text-sm leading-5 text-slate-600">{description}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-10 sm:mt-14" aria-labelledby="support-title">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-chaski-accent-ink">Para la comunidad educativa</p>
            <h2 id="support-title" className="mt-2 text-2xl font-semibold tracking-tight text-chaski-heading">Un proceso de orientación compartido</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">La herramienta apoya el trabajo cotidiano del colegio. El acompañamiento y las decisiones siguen en manos de las personas.</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {supportAreas.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-chaski-border bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-chaski-subtle text-chaski-accent-ink"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-4 text-sm font-semibold text-slate-800">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-12 flex flex-col gap-2 border-t border-chaski-border pt-5 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Chaski · Orientación vocacional para colegios</span>
          <span>Tratamos la información estudiantil con cuidado y acceso limitado.</span>
        </footer>
      </div>
    </main>
  );
}
