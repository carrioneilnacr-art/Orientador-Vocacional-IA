'use client';

import React, { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  RotateCcw,
  FileSpreadsheet,
  Search,
  ArrowLeft,
  School,
  Check,
  AlertCircle,
  Info,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { generateGradeCsvTemplate, parseGradeCSV, mapSubjectToArea } from '@/lib/gradeParser';
import { ValidatedGradeRow, ValidationSummary, validateGradeRow } from '@/lib/gradeValidator';

export default function ImportadorNotasPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [importId, setImportId] = useState<string | null>(null);
  const [rows, setRows] = useState<ValidatedGradeRow[]>([]);
  const [isProcessing, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OK' | 'WARNING' | 'ERROR'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ count: number; importId: string } | null>(null);
  const [revertedInfo, setRevertedInfo] = useState<string | null>(null);

  // Edición en línea
  const [editingRowIdx, setEditingRowIdx] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ValidatedGradeRow>>({});

  // Estadísticas reactivas calculadas
  const stats = useMemo(() => {
    let ok = 0;
    let warning = 0;
    let error = 0;
    for (const r of rows) {
      if (r.status === 'OK') ok++;
      else if (r.status === 'WARNING') warning++;
      else if (r.status === 'ERROR') error++;
    }
    return {
      total: rows.length,
      ok,
      warning,
      error,
      canConfirm: rows.length > 0 && error === 0,
    };
  }, [rows]);

  // Filtrado de filas
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      // Filtro de estado
      if (statusFilter !== 'ALL' && r.status !== statusFilter) {
        return false;
      }
      // Búsqueda por texto
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const code = (r.studentCode || '').toLowerCase();
        const name = (r.rawName || r.matchedStudentName || '').toLowerCase();
        const subject = (r.subject || '').toLowerCase();
        const area = (r.area || '').toLowerCase();
        return (
          code.includes(query) ||
          name.includes(query) ||
          subject.includes(query) ||
          area.includes(query)
        );
      }
      return true;
    });
  }, [rows, statusFilter, searchTerm]);

  // Descargar plantilla oficial CSV
  const handleDownloadTemplate = () => {
    const csvContent = generateGradeCsvTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'plantilla_calificaciones_chaski.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cargar archivo CSV
  const handleFileUpload = async (uploadedFile: File) => {
    setGlobalError(null);
    setSuccessInfo(null);
    setRevertedInfo(null);
    setFile(uploadedFile);
    setFileName(uploadedFile.name);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const res = await fetch('/api/colegio/notas/importar', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Error al procesar el archivo');
        }

        setImportId(data.importId);
        setRows(data.summary?.rows || []);
      } catch (err: any) {
        setGlobalError(err.message || 'Error al conectar con el servidor.');
      }
    });
  };

  // Cargar datos de prueba de demostración con 1 clic
  const handleLoadDemoData = () => {
    setGlobalError(null);
    setSuccessInfo(null);
    setRevertedInfo(null);
    setFileName('acta_notas_demo_bimestre1.csv');

    const demoCSV = `codigo_estudiante,nombres_alumno,curso,periodo,nota
HON-001,Ana Lucia Ramos Vargas,Matemática (Álgebra),2025-B1,18.5
HON-002,Carlos Mendoza Quispe,Comunicación Integral,2025-B1,AD
HON-003,Diego Fernando Sanchez,Física Elemental,2025-B1,14
HON-004,Elena Sofia Castro,Historia del Perú,2025-B1,A
HON-005,Gabriel Torres Morales,Inglés Técnico,2025-B1,16
HON-006,Luciana Belen Rios,Ajedrez Deportivo,2025-B1,15
HON-007,Matias Alexander Silva,Química Inorgánica,2025-B1,24.0`;

    const parsed = parseGradeCSV(demoCSV);
    const dummyOptions = {
      existingStudents: [
        { id: '1', studentCode: 'HON-001', fullName: 'Ana Lucia Ramos Vargas' },
        { id: '2', studentCode: 'HON-002', fullName: 'Carlos Mendoza Quispe' },
        { id: '3', studentCode: 'HON-003', fullName: 'Diego Fernando Sanchez' },
        { id: '4', studentCode: 'HON-004', fullName: 'Elena Sofia Castro' },
        { id: '5', studentCode: 'HON-005', fullName: 'Gabriel Torres Morales' },
        { id: '6', studentCode: 'HON-006', fullName: 'Luciana Belen Rios' },
        { id: '7', studentCode: 'HON-007', fullName: 'Matias Alexander Silva' },
      ],
    };

    const initialRows = parsed.rows.map((r) => validateGradeRow(r, dummyOptions));
    setRows(initialRows);
    setImportId('demo-' + crypto.randomUUID().slice(0, 8));
  };

  // Manejo de drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Iniciar edición de una fila
  const handleStartEdit = (idx: number, row: ValidatedGradeRow) => {
    setEditingRowIdx(idx);
    setEditFormData({
      studentCode: row.studentCode,
      rawName: row.rawName,
      subject: row.subject,
      period: row.period,
      rawGrade: row.rawGrade,
    });
  };

  // Guardar edición de fila
  const handleSaveEdit = (idx: number) => {
    const targetRow = rows[idx];
    if (!targetRow) return;

    const updatedRaw = {
      originalRowIndex: targetRow.originalRowIndex,
      studentCode: editFormData.studentCode ?? targetRow.studentCode,
      rawName: editFormData.rawName ?? targetRow.rawName,
      subject: editFormData.subject ?? targetRow.subject,
      area: mapSubjectToArea(editFormData.subject ?? targetRow.subject),
      period: editFormData.period ?? targetRow.period,
      rawGrade: editFormData.rawGrade ?? targetRow.rawGrade,
      parsedGrade: null, // Forzar re-parseo en validateGradeRow
      gradeScale: 'VIGESIMAL' as const,
    };

    const revalidated = validateGradeRow(updatedRaw);

    const newRows = [...rows];
    newRows[idx] = revalidated;
    setRows(newRows);
    setEditingRowIdx(null);
    setEditFormData({});
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingRowIdx(null);
    setEditFormData({});
  };

  // Eliminar una fila con error irremediable
  const handleDeleteRow = (idx: number) => {
    const newRows = rows.filter((_, i) => i !== idx);
    setRows(newRows);
    if (editingRowIdx === idx) {
      setEditingRowIdx(null);
    }
  };

  // Confirmar e integrar a la base de datos
  const handleConfirmImport = async () => {
    if (!stats.canConfirm) return;
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const res = await fetch('/api/colegio/notas/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          importId: importId || crypto.randomUUID(),
          rows: rows,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo confirmar la importación.');
      }

      setSuccessInfo({
        count: data.confirmedCount,
        importId: data.importId,
      });
    } catch (err: any) {
      setGlobalError(err.message || 'Error al guardar notas en los expedientes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Revertir importación
  const handleRevertImport = async () => {
    if (!successInfo?.importId) return;
    if (!confirm('¿Estás seguro de que deseas revertir esta importación? Se eliminarán las notas de los expedientes.')) {
      return;
    }

    setIsReverting(true);
    setGlobalError(null);

    try {
      const res = await fetch('/api/colegio/notas/revertir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ importId: successInfo.importId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo revertir.');
      }

      setRevertedInfo(`Se eliminaron ${data.revertedCount} calificaciones del sistema.`);
      setSuccessInfo(null);
    } catch (err: any) {
      setGlobalError(err.message || 'Error al revertir.');
    } finally {
      setIsReverting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5FAFD] text-[#0B2D4D] pb-16 font-sans antialiased">
      {/* ── HEADER SUPERIOR / NAV ── */}
      <header className="bg-white border-b border-[#E1EDF3] sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/colegio/acceso"
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-[#0B2D4D] transition-colors"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <School className="w-3.5 h-3.5 text-[#08BBD5]" />
                <span>Portal Colegio</span>
                <span>/</span>
                <span className="text-slate-800">Calificaciones</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#0B2D4D] tracking-tight">
                Importador de Notas Escolares
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-[#CBDDE6] text-[#0B2D4D] hover:bg-slate-50 hover:border-[#08BBD5]/50 shadow-sm active:scale-[0.96] transition-all"
            >
              <Download className="w-4 h-4 text-[#08BBD5]" />
              <span className="hidden sm:inline">Descargar</span> Plantilla CSV
            </button>
            <button
              onClick={handleLoadDemoData}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#E8F8FA] border border-[#08BBD5]/30 text-[#0799AF] hover:bg-[#D5F2F7] active:scale-[0.96] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Cargar</span> Demo
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Banner de error global si existe */}
        {globalError && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-800 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Ocurrió un inconveniente</p>
              <p className="mt-0.5">{globalError}</p>
            </div>
          </div>
        )}

        {/* Banner de éxito de confirmación */}
        {successInfo && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 sm:p-5 text-emerald-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-base">¡Calificaciones integradas con éxito!</p>
                <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">
                  Se guardaron <strong className="tabular-nums font-semibold">{successInfo.count}</strong> registros en los expedientes académicos para el ajuste vocacional.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleRevertImport}
                disabled={isReverting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 shadow-sm active:scale-[0.96] transition-all disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isReverting ? 'Revirtiendo...' : 'Deshacer importación'}
              </button>
            </div>
          </div>
        )}

        {/* Banner de reversión exitosa */}
        {revertedInfo && (
          <div className="rounded-2xl bg-slate-100 border border-slate-300 p-4 text-slate-800 flex items-center gap-3">
            <Info className="w-5 h-5 text-slate-600 shrink-0" />
            <p className="text-sm font-medium">{revertedInfo}</p>
          </div>
        )}

        {/* ── ZONA DE CARGA (DROPZONE) ── */}
        {rows.length === 0 ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="rounded-3xl border-2 border-dashed border-[#CBDDE6] bg-white hover:border-[#08BBD5] p-8 sm:p-12 text-center shadow-[0_4px_24px_rgba(11,45,77,0.04)] transition-all cursor-pointer group"
          >
            <input
              type="file"
              id="file-upload"
              accept=".csv,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E8F8FA] text-[#08BBD5] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#0B2D4D]">
                Arrastra tu archivo CSV de calificaciones aquí
              </h2>
              <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                Admite actas con escala vigesimal (0-20) o literales oficiales MINEDU (AD, A, B, C). Detección automática de cursos y áreas.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#08BBD5] text-white text-sm font-semibold shadow-sm hover:bg-[#0799AF] active:scale-[0.96] transition-all">
                  Seleccionar archivo desde el equipo
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLoadDemoData();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold active:scale-[0.96] transition-all"
                >
                  Probar con datos de ejemplo
                </button>
              </div>
            </label>
          </div>
        ) : (
          <>
            {/* ── TARJETA RESUMEN ESTADÍSTICO (KPIS) ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Total */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E1EDF3] shadow-[0_2px_12px_rgba(11,45,77,0.03)] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Filas
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#0B2D4D] tabular-nums mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
              </div>

              {/* Válidas (OK) */}
              <div
                onClick={() => setStatusFilter(statusFilter === 'OK' ? 'ALL' : 'OK')}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
                  statusFilter === 'OK'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-[#E1EDF3] hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Listas (OK)
                  </p>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tabular-nums mt-1">
                  {stats.ok}
                </p>
              </div>

              {/* Advertencias (WARNING) */}
              <div
                onClick={() => setStatusFilter(statusFilter === 'WARNING' ? 'ALL' : 'WARNING')}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
                  statusFilter === 'WARNING'
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                    : 'border-[#E1EDF3] hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    Advertencias
                  </p>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-800 tabular-nums mt-1">
                  {stats.warning}
                </p>
              </div>

              {/* Errores (ERROR) */}
              <div
                onClick={() => setStatusFilter(statusFilter === 'ERROR' ? 'ALL' : 'ERROR')}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
                  statusFilter === 'ERROR'
                    ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                    : 'border-[#E1EDF3] hover:border-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                    Con Errores
                  </p>
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-rose-800 tabular-nums mt-1">
                  {stats.error}
                </p>
              </div>
            </div>

            {/* ── BARRA DE HERRAMIENTAS: BÚSQUEDA Y FILTROS ── */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E1EDF3] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'ALL'
                      ? 'bg-[#0B2D4D] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Todas ({stats.total})
                </button>
                <button
                  onClick={() => setStatusFilter('OK')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'OK'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  OK ({stats.ok})
                </button>
                <button
                  onClick={() => setStatusFilter('WARNING')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'WARNING'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  Advertencias ({stats.warning})
                </button>
                <button
                  onClick={() => setStatusFilter('ERROR')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'ERROR'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  Errores ({stats.error})
                </button>
              </div>

              {/* Búsqueda rápida */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar alumno, código o curso..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08BBD5] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* ── TABLA INTERACTIVA DE REVISIÓN ── */}
            <div className="bg-white rounded-3xl border border-[#E1EDF3] shadow-[0_4px_24px_rgba(11,45,77,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E1EDF3] text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3 w-10 text-center">#</th>
                      <th className="py-3 px-3 w-28">Estado</th>
                      <th className="py-3 px-4">Cód. Alumno</th>
                      <th className="py-3 px-4">Estudiante</th>
                      <th className="py-3 px-4">Curso</th>
                      <th className="py-3 px-4">Área MINEDU</th>
                      <th className="py-3 px-3">Periodo</th>
                      <th className="py-3 px-3 text-center">Nota Orig.</th>
                      <th className="py-3 px-3 text-center">Vigesimal</th>
                      <th className="py-3 px-4">Observaciones</th>
                      <th className="py-3 px-3 text-center w-20">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredRows.map((row, idx) => {
                      const isEditing = editingRowIdx === idx;

                      return (
                        <tr
                          key={`${row.originalRowIndex}-${idx}`}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            row.status === 'ERROR'
                              ? 'bg-rose-50/30'
                              : row.status === 'WARNING'
                              ? 'bg-amber-50/20'
                              : ''
                          }`}
                        >
                          {/* Fila número */}
                          <td className="py-3 px-3 text-center text-slate-400 font-mono text-xs tabular-nums">
                            {row.originalRowIndex}
                          </td>

                          {/* Estado con Badge */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {row.status === 'OK' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Válido
                              </span>
                            )}
                            {row.status === 'WARNING' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                Advertencia
                              </span>
                            )}
                            {row.status === 'ERROR' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                Error
                              </span>
                            )}
                          </td>

                          {/* Código de alumno */}
                          <td className="py-3 px-4 font-mono font-medium text-slate-800">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.studentCode ?? row.studentCode}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, studentCode: e.target.value })
                                }
                                className="w-24 px-2 py-1 bg-white border border-[#08BBD5] rounded-lg text-xs"
                              />
                            ) : (
                              row.studentCode || <span className="text-rose-500 italic">Vacío</span>
                            )}
                          </td>

                          {/* Nombre del estudiante */}
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.rawName ?? (row.rawName || '')}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, rawName: e.target.value })
                                }
                                className="w-36 px-2 py-1 bg-white border border-[#08BBD5] rounded-lg text-xs"
                              />
                            ) : (
                              <div className="font-medium text-slate-800">
                                {row.matchedStudentName || row.rawName || (
                                  <span className="text-slate-400 italic">No especificado</span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Curso */}
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.subject ?? row.subject}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, subject: e.target.value })
                                }
                                className="w-32 px-2 py-1 bg-white border border-[#08BBD5] rounded-lg text-xs"
                              />
                            ) : (
                              <span className="font-medium text-slate-800">{row.subject}</span>
                            )}
                          </td>

                          {/* Área Curricular MINEDU */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-lg text-xs font-medium ${
                                row.area === 'OTRO'
                                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                  : 'bg-sky-50 text-sky-800 border border-sky-100'
                              }`}
                            >
                              {row.area}
                            </span>
                          </td>

                          {/* Periodo */}
                          <td className="py-3 px-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.period ?? row.period}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, period: e.target.value })
                                }
                                className="w-20 px-2 py-1 bg-white border border-[#08BBD5] rounded-lg text-xs"
                              />
                            ) : (
                              <span className="text-slate-600 font-mono text-xs">{row.period}</span>
                            )}
                          </td>

                          {/* Nota Original */}
                          <td className="py-3 px-3 text-center">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.rawGrade ?? row.rawGrade}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, rawGrade: e.target.value })
                                }
                                className="w-16 px-2 py-1 bg-white border border-[#08BBD5] rounded-lg text-xs text-center font-mono font-bold"
                              />
                            ) : (
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100">
                                {row.rawGrade || '—'}
                              </span>
                            )}
                          </td>

                          {/* Nota Normalizada Vigesimal */}
                          <td className="py-3 px-3 text-center tabular-nums">
                            {row.parsedGrade !== null ? (
                              <span
                                className={`font-bold font-mono text-sm px-2 py-0.5 rounded ${
                                  row.parsedGrade >= 14
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : row.parsedGrade >= 11
                                    ? 'text-amber-700 bg-amber-50'
                                    : 'text-rose-700 bg-rose-50'
                                }`}
                              >
                                {row.parsedGrade.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-rose-600 font-mono font-bold text-xs">Error</span>
                            )}
                          </td>

                          {/* Issues / Observaciones */}
                          <td className="py-3 px-4">
                            {row.issues.length === 0 ? (
                              <span className="text-emerald-600 text-xs flex items-center gap-1 font-medium">
                                <Check className="w-3.5 h-3.5" /> Correcto
                              </span>
                            ) : (
                              <div className="space-y-1">
                                {row.issues.map((issue, iIdx) => (
                                  <div
                                    key={iIdx}
                                    className={`text-xs flex items-start gap-1 ${
                                      issue.severity === 'ERROR'
                                        ? 'text-rose-700 font-medium'
                                        : 'text-amber-800'
                                    }`}
                                  >
                                    <span className="shrink-0 mt-0.5">•</span>
                                    <span>{issue.message}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Acciones */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleSaveEdit(idx)}
                                  className="p-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                                  title="Guardar cambios"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                                  title="Cancelar"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleStartEdit(idx, row)}
                                  className="p-1 text-slate-400 hover:text-[#08BBD5] rounded-lg hover:bg-slate-100 transition-colors"
                                  title="Editar celda"
                                >
                                  <span className="text-xs font-semibold px-1">Editar</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteRow(idx)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                  title="Descartar fila"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredRows.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No se encontraron filas que coincidan con el filtro actual.
                </div>
              )}
            </div>

            {/* ── BARRA INFERIOR DE ACCIÓN / CONFIRMACIÓN ── */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E1EDF3] shadow-[0_4px_24px_rgba(11,45,77,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {stats.error > 0 ? (
                  <div className="flex items-center gap-2 text-rose-700 text-sm font-semibold">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>
                      Corrige o descarta las {stats.error} fila(s) con errores para habilitar la confirmación.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Todas las filas son válidas y están listas para integración.</span>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Se actualizarán los expedientes de los estudiantes y el motor de ajuste vocacional recalculará las afinidades de carrera.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Deseas reiniciar la importación actual?')) {
                      setRows([]);
                      setFile(null);
                      setFileName('');
                      setImportId(null);
                      setSuccessInfo(null);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 active:scale-[0.96] transition-all"
                >
                  Limpiar / Nuevo Archivo
                </button>

                <button
                  type="button"
                  disabled={!stats.canConfirm || isSubmitting || successInfo !== null}
                  onClick={handleConfirmImport}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#08BBD5] text-white text-sm font-bold shadow-md hover:bg-[#0799AF] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmitting ? 'Confirmando...' : 'Confirmar e Integrar Expedientes'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
