export default function AcademicHistoryLoading() {
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
