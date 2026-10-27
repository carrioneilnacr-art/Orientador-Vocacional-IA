'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  Search,
  Shirt,
  Trophy,
  UsersRound,
} from 'lucide-react';

type Period = 'B1' | 'B2' | 'B3' | 'B4';

type SubjectGrade = {
  subject: string;
  area: string;
  grade: number | null;
};

type StudentSummary = {
  id: string;
  studentCode: string;
  fullName: string;
  isDemo: boolean;
  classroom: string;
  average: number | null;
  rank: number | null;
  attendancePercentage: number | null;
  punctualityPercentage: number | null;
  presentationRating: string | null;
  conductRating: string | null;
  responsibilityRating: string | null;
  lateCount: number | null;
  absenceDays: number | null;
  observation: string | null;
  grades: SubjectGrade[];
};

type AcademicResponse = {
  period: Period;
  schoolName: string;
  academicYear: number;
  totalStudents: number;
  classroomAverage: number | null;
  attendanceAverage: number | null;
  canImport: boolean;
  students: StudentSummary[];
};

const PERIODS: Array<{ value: Period; label: string }> = [
  { value: 'B1', label: '1.er bimestre' },
  { value: 'B2', label: '2.º bimestre' },
  { value: 'B3', label: '3.er bimestre' },
  { value: 'B4', label: '4.º bimestre' },
];

function formatMetric(value: number | null, suffix = '') {
  return value === null ? 'Sin registro' : `${value.toFixed(1)}${suffix}`;
}

function ratingTone(value: string | null) {
  if (!value) return 'bg-slate-100 text-slate-600';
  if (['AD', 'A', 'DESTACADO', 'BUENO'].includes(value.toUpperCase())) {
    return 'bg-emerald-50 text-emerald-700';
  }
  if (['C', 'REQUIERE APOYO', 'EN PROCESO'].includes(value.toUpperCase())) {
    return 'bg-amber-50 text-amber-700';
  }
  return 'bg-sky-50 text-sky-700';
}

function LoadingView() {
  return (
    <main className="min-h-screen bg-chaski-page px-4 py-8" aria-label="Cargando historial académico">
      <div className="mx-auto max-w-7xl animate-pulse space-y-5">
        <div className="h-12 w-64 rounded-2xl bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-28 rounded-2xl bg-slate-200" />)}
        </div>
        <div className="h-96 rounded-3xl bg-slate-200" />
      </div>
    </main>
  );
}

export default function AcademicHistoryPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('B1');
  const [query, setQuery] = useState('');
  const [data, setData] = useState<AcademicResponse | null>(null);
  const [selected, setSelected] = useState<StudentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/colegio/academico?period=${period}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (response.status === 401) {
          router.replace('/colegio/login');
          return;
        }
        const payload = await response.json() as AcademicResponse & { error?: string };
        if (!response.ok) throw new Error(payload.error || 'No pudimos cargar el historial académico.');
        setData(payload);
        setSelected((current) => current
          ? payload.students.find((student) => student.id === current.id) ?? null
          : null);
      } catch (requestError) {
        if ((requestError as Error).name !== 'AbortError') {
          setError(requestError instanceof Error ? requestError.message : 'No pudimos cargar los registros.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [period, router]);

  const filteredStudents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    if (!normalized) return data?.students ?? [];
    return (data?.students ?? []).filter((student) =>
      `${student.fullName} ${student.studentCode} ${student.classroom}`.toLocaleLowerCase('es').includes(normalized)
    );
  }, [data, query]);

  if (loading && !data) return <LoadingView />;

  return (
    <div className="min-h-screen bg-chaski-page text-slate-900">
      <header className="sticky top-0 z-30 border-b border-chaski-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/colegio/dashboard" aria-label="Volver al panel" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-chaski-subtle hover:text-chaski-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-chaski-border bg-chaski-subtle">
              <Image src="/assets/chaski/chaski-10.png" alt="" width={26} height={26} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-chaski-heading">Historial académico</p>
              <p className="truncate text-xs text-slate-500">{data?.schoolName ?? 'Portal institucional'}</p>
            </div>
          </div>
          {data?.canImport && (
            <Link href="/colegio/notas/importar" className="hidden min-h-10 items-center gap-2 rounded-xl border border-chaski-border bg-white px-3.5 text-xs font-semibold text-chaski-heading transition hover:border-chaski-border-hover hover:bg-chaski-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink sm:inline-flex">
              <BookOpenCheck className="h-4 w-4 text-chaski-accent-ink" /> Importar notas
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-chaski-accent-ink">Año académico {data?.academicYear ?? new Date().getFullYear()}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-chaski-heading sm:text-3xl">Notas y desarrollo por bimestre</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Consulta resultados académicos y hábitos escolares. El código organiza los registros; el estudiante puede seguir usando Chaski sin iniciar sesión con él.</p>
            {data?.students.some((student) => student.isDemo) && <p className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">20 estudiantes y calificaciones ficticias de demostración</p>}
          </div>
          <label className="flex w-full flex-col gap-1.5 text-xs font-semibold text-slate-600 sm:w-52">
            Bimestre
            <select value={period} onChange={(event) => setPeriod(event.target.value as Period)} className="h-11 rounded-xl border border-chaski-border bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-chaski-accent-ink focus:ring-4 focus:ring-chaski-accent-ink/10">
              {PERIODS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
        </div>

        {error && (
          <div role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumen del bimestre">
          {[
            { label: 'Estudiantes', value: String(data?.totalStudents ?? 0), icon: UsersRound },
            { label: 'Promedio del aula', value: formatMetric(data?.classroomAverage ?? null), icon: GraduationCap },
            { label: 'Asistencia promedio', value: formatMetric(data?.attendanceAverage ?? null, '%'), icon: CheckCircle2 },
            { label: 'Bimestre', value: PERIODS.find((item) => item.value === period)?.label ?? period, icon: CalendarDays },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-chaski-border bg-white p-5 shadow-[0_4px_18px_rgba(11,45,77,0.035)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-slate-500">{label}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-chaski-subtle text-chaski-accent-ink"><Icon className="h-4 w-4" /></span>
              </div>
              <p className="mt-3 text-xl font-semibold tracking-tight text-chaski-heading">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-7 overflow-hidden rounded-3xl border border-chaski-border bg-white shadow-[0_4px_22px_rgba(11,45,77,0.035)]" aria-labelledby="students-title">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 id="students-title" className="text-base font-semibold text-chaski-heading">Estudiantes y puestos</h2>
              <p className="mt-1 text-sm text-slate-500">Selecciona un estudiante para ver sus notas y observaciones.</p>
            </div>
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Buscar estudiante</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, código o aula" className="h-11 w-full rounded-xl border border-chaski-border bg-white pl-10 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-chaski-accent-ink focus:ring-4 focus:ring-chaski-accent-ink/10" />
            </label>
          </div>

          {!data?.students.length ? (
            <div className="px-5 py-14 text-center sm:px-8">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-chaski-subtle text-chaski-accent-ink"><BookOpenCheck className="h-5 w-5" /></span>
              <h3 className="mt-4 text-sm font-semibold text-slate-800">Todavía no hay registros para este bimestre</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Importa el archivo del colegio o registra las notas para empezar el historial.</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredStudents.map((student) => (
                  <button key={student.id} onClick={() => setSelected(student)} className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-chaski-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-chaski-accent-ink">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-chaski-subtle text-sm font-bold text-chaski-accent-ink">{student.rank ?? '—'}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{student.fullName}</span><span className="mt-0.5 block text-xs text-slate-500">{student.studentCode} · {student.classroom}</span></span>
                    <span className="text-right"><span className="block text-sm font-bold text-chaski-heading">{formatMetric(student.average)}</span><span className="text-[11px] text-slate-500">promedio</span></span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                  <thead className="bg-chaski-page text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                    <tr><th className="px-5 py-3">Puesto</th><th className="px-5 py-3">Estudiante</th><th className="px-5 py-3">Promedio</th><th className="px-5 py-3">Asistencia</th><th className="px-5 py-3">Puntualidad</th><th className="px-5 py-3">Presentación</th><th className="px-5 py-3"><span className="sr-only">Ver detalle</span></th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="transition hover:bg-chaski-page/70">
                        <td className="px-5 py-4"><span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-chaski-subtle px-2 py-1 text-xs font-bold text-chaski-accent-ink">{student.rank ?? '—'}</span></td>
                        <td className="px-5 py-4"><p className="font-semibold text-slate-800">{student.fullName}</p><p className="mt-0.5 text-xs text-slate-500">{student.studentCode} · {student.classroom}</p></td>
                        <td className="px-5 py-4 font-semibold text-chaski-heading">{formatMetric(student.average)}</td>
                        <td className="px-5 py-4 text-slate-700">{formatMetric(student.attendancePercentage, '%')}</td>
                        <td className="px-5 py-4 text-slate-700">{formatMetric(student.punctualityPercentage, '%')}</td>
                        <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ratingTone(student.presentationRating)}`}>{student.presentationRating ?? 'Sin registro'}</span></td>
                        <td className="px-5 py-4 text-right"><button onClick={() => setSelected(student)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-chaski-accent-ink transition hover:bg-chaski-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">Ver boleta <ChevronRight className="h-4 w-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!filteredStudents.length && <p className="px-5 py-10 text-center text-sm text-slate-500">No encontramos estudiantes con esa búsqueda.</p>}
            </>
          )}
        </section>

        {selected && (
          <section className="mt-7 rounded-3xl border border-chaski-border bg-white p-5 shadow-[0_4px_22px_rgba(11,45,77,0.035)] sm:p-7" aria-labelledby="report-title">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-chaski-accent-ink">Boleta del {PERIODS.find((item) => item.value === period)?.label} {selected.isDemo ? '· DEMOSTRACIÓN' : ''}</p><h2 id="report-title" className="mt-1 text-xl font-semibold text-chaski-heading">{selected.fullName}</h2><p className="mt-1 text-sm text-slate-500">{selected.studentCode} · {selected.classroom}</p></div>
              <button onClick={() => setSelected(null)} className="self-start rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chaski-accent-ink">Cerrar detalle</button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Puesto', value: selected.rank ? `${selected.rank} de ${data?.totalStudents ?? '—'}` : 'Sin registro', icon: Trophy },
                { label: 'Asistencia', value: formatMetric(selected.attendancePercentage, '%'), icon: CheckCircle2 },
                { label: 'Puntualidad', value: formatMetric(selected.punctualityPercentage, '%'), icon: Clock3 },
                { label: 'Presentación', value: selected.presentationRating ?? 'Sin registro', icon: Shirt },
              ].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl bg-chaski-page p-4"><Icon className="h-4 w-4 text-chaski-accent-ink" /><p className="mt-3 text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>)}
            </div>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-chaski-border">
              <table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-chaski-page text-xs font-semibold text-slate-600"><tr><th className="px-4 py-3">Área</th><th className="px-4 py-3">Curso</th><th className="px-4 py-3 text-right">Nota</th></tr></thead><tbody className="divide-y divide-slate-100">{selected.grades.map((grade) => <tr key={`${grade.area}-${grade.subject}`}><td className="px-4 py-3 text-slate-500">{grade.area}</td><td className="px-4 py-3 font-medium text-slate-800">{grade.subject}</td><td className="px-4 py-3 text-right font-semibold text-chaski-heading">{grade.grade === null ? '—' : grade.grade.toFixed(1)}</td></tr>)}</tbody></table>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[
              ['Vestimenta', selected.presentationRating ?? 'Sin registro'],
              ['Conducta', selected.conductRating ?? 'Sin registro'],
              ['Responsabilidad', selected.responsibilityRating ?? 'Sin registro'],
              ['Tardanzas', selected.lateCount === null ? 'Sin registro' : String(selected.lateCount)],
              ['Inasistencias', selected.absenceDays === null ? 'Sin registro' : String(selected.absenceDays)],
            ].map(([label, value]) => <div key={label} className="rounded-2xl border border-chaski-border p-4"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold text-slate-800">{value}</p></div>)}<div className="rounded-2xl border border-chaski-border p-4"><p className="text-xs font-semibold text-slate-500">Observación del bimestre</p><p className="mt-2 text-sm leading-6 text-slate-700">{selected.observation ?? 'Sin observaciones registradas.'}</p></div></div>
          </section>
        )}
      </main>
    </div>
  );
}
