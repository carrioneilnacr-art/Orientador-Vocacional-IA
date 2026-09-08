"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrainCircuit, RefreshCcw, ArrowRight, Lightbulb, Zap, Crosshair, Download, Sparkles, Quote } from "lucide-react";
import CopilotChat from "@/components/chat/CopilotChat";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface CareerResult {
  id: number;
  slug: string;
  name: string;
  faculty: string;
  degree: string;
  match: number;
  justification: string;
  campuses: string[];
  cost: string;
}

interface VocationalResults {
  dimensionScores: Record<string, number>;
  topCareers: CareerResult[];
}

const DIMENSION_LABELS: Record<string, string> = {
  TECH: "Tecnológico",
  LOGIC: "Lógico",
  INVESTIGATIVE: "Investigador",
  SOCIAL: "Social",
  ARTISTIC: "Artístico",
  ENTERPRISING: "Emprendedor",
  CONVENTIONAL: "Convencional",
  REALISTIC: "Realista",
};

export default function ResultadosPage() {
  const [results, setResults] = useState<VocationalResults | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vocational_results");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResults(parsed);
      } catch {}
    }
    setIsLoaded(true);
  }, []);

  const topDimension = Object.entries(results?.dimensionScores || {}).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0];
  const profileName = topDimension ? DIMENSION_LABELS[topDimension] : 'Lógico';

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    const reportElement = document.getElementById('report-content');
    if (!reportElement) {
      setIsDownloading(false);
      return;
    }

    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');

      reportElement.classList.add('pdf-export-mode');
      await new Promise((resolve) => setTimeout(resolve, 250));

      const capturePromise = html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#F8FCFF',
        windowWidth: 1200,
        ignoreElements: (el) => el.classList.contains('no-pdf') || el.classList.contains('no-print'),
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('PDF generation timed out')), 10000)
      );

      const canvas = await Promise.race([capturePromise, timeoutPromise]);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Reporte_Vocacional_${profileName}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    } finally {
      reportElement.classList.remove('pdf-export-mode');
      setIsDownloading(false);
    }
  };

  const handleRestart = () => {
    localStorage.removeItem("vocational_answers_v2");
    localStorage.removeItem("vocational_results");
    localStorage.removeItem("vocational_profile_context");
    window.location.href = "/cuestionario";
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FCFF]">
        <div className="w-10 h-10 border-4 border-[#00C2E0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!results || !results.dimensionScores || !results.topCareers || results.topCareers.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F8FCFF] px-6 text-center">
        <h2 className="text-2xl font-bold text-[#082A4A]">No tienes resultados aún o hubo un error</h2>
        <p className="text-[#4F6B85]">Completa el cuestionario para ver tus carreras recomendadas.</p>
        <Link
          href="/cuestionario"
          className="px-6 py-3 bg-[#00C2E0] hover:bg-[#0EA5C6] text-white rounded-[12px] font-semibold transition-colors shadow-sm"
        >
          Ir al cuestionario
        </Link>
      </div>
    );
  }

  const radarData = Object.entries(results.dimensionScores || {}).map(([dim, score]) => ({
    subject: DIMENSION_LABELS[dim] || dim,
    A: score,
    fullMark: 100,
  }));

  const topCareers = results.topCareers.slice(0, 3);
  const primaryCareer = topCareers[0];

  return (
    <div className="min-h-screen bg-[#F8FCFF] text-[#082A4A] font-sans selection:bg-[#00C2E0] selection:text-white pb-20">
      {/* Header Superior Limpio y Funcional */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#D6E5EF] no-print no-pdf">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-[10px] bg-[#EAF6FF] flex items-center justify-center text-[#00C2E0] group-hover:bg-[#00C2E0] group-hover:text-white transition-colors">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="font-bold text-[17px] text-[#082A4A] tracking-tight">Inicio</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 text-[13.5px] font-medium border border-[#D6E5EF] rounded-[12px] px-4 py-2.5 hover:bg-[#F8FCFF] text-[#082A4A] transition-colors cursor-pointer"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              <span>Volver a empezar</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 text-[13.5px] font-semibold bg-[#00C2E0] hover:bg-[#0EA5C6] text-white rounded-[12px] px-5 py-2.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-[#00C2E0]/20"
            >
              <Download className="h-4 w-4" />
              <span>{isDownloading ? 'Generando PDF...' : 'Descargar PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenedor Principal del Reporte */}
      <main id="report-content" className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 py-8 space-y-16">
        
        {/* Banner exclusivo para PDF (oculto en vista web) */}
        <div className="hidden pdf-only-banner items-center justify-between pb-6 border-b border-[#D6E5EF]">
          <div>
            <h1 className="text-2xl font-bold text-[#082A4A]">Orientador Vocacional IA</h1>
            <p className="text-sm text-[#4F6B85]">Reporte Oficial de Resultados y Afinidad Vocacional</p>
          </div>
          <div className="text-right text-xs text-[#4F6B85]">
            <p className="font-semibold text-[#082A4A]">Perfil: {profileName}</p>
            <p>Generado el {new Date().toLocaleDateString('es-PE')}</p>
          </div>
        </div>

        {/* SECCIÓN 1: HERO (3 Columnas Proporcionadas: Perfil | Imagen Machu Picchu | Copiloto) */}
        <section className="hero-grid grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_1.1fr] gap-8 items-stretch">
          
          {/* Columna 1: Perfil Vocacional */}
          <div className="bg-transparent flex flex-col justify-between h-full min-h-[560px]">
            <div>
              <p className="text-[15px] text-[#4F6B85] font-semibold mb-2">Tu perfil principal es:</p>
              <h1 className="text-[44px] xl:text-[52px] font-bold text-[#082A4A] mb-3 capitalize leading-tight">
                {profileName}
              </h1>
              <p className="text-[#4F6B85] text-[14.5px] leading-relaxed mb-6">
                Te motiva entender cómo funcionan las cosas, resolver problemas y encontrar soluciones con lógica. Destacas en entornos donde puedes analizar y construir ideas estructuradas.
              </p>

              {/* Barras de Progreso */}
              <div className="space-y-3.5 mb-6">
                {Object.entries(results.dimensionScores || {})
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([dim, score]) => (
                    <div key={dim}>
                      <div className="flex justify-between text-[13px] font-bold mb-1">
                        <span className="text-[#082A4A]">{DIMENSION_LABELS[dim] || dim}</span>
                        <span className="text-[#00C2E0]">{score}%</span>
                      </div>
                      <div className="w-full bg-[#EAF6FF] h-[7px] rounded-full overflow-hidden">
                        <div
                          className="bg-[#00C2E0] h-full rounded-full transition-all duration-700"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Cita de Chaski */}
            <div className="bg-[#EAF6FF]/70 border border-[#D6E5EF] rounded-[20px] p-5 relative mt-4 shadow-xs">
              <Quote className="h-5 w-5 text-[#00C2E0] fill-[#00C2E0]/20 mb-1" />
              <p className="text-[#082A4A] font-medium text-[14px] leading-relaxed">
                "La tecnología no solo cambia el mundo, también crea oportunidades para personas como tú."
              </p>
              <p className="text-right text-[#4F6B85] text-[12.5px] font-bold mt-2">— Chaski</p>
            </div>
          </div>

          {/* Columna 2: Tarjeta Visual de Machu Picchu */}
          <div className="relative rounded-[24px] overflow-hidden shadow-sm border border-[#D6E5EF] min-h-[560px] flex flex-col justify-between group">
            <Image
              src="/assets/robot_bg.jpg"
              alt="Grandes decisiones, mejores futuros"
              fill
              unoptimized
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />

            {/* Texto decorativo superior */}
            <div className="relative z-10 p-7 text-right">
              <p className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] font-serif text-[32px] xl:text-[36px] leading-[1.1] italic -rotate-2">
                <span className="text-[#00C2E0]">Grandes</span><br />
                decisiones,<br />
                mejores futuros
              </p>
            </div>
          </div>

          {/* Columna 3: Copiloto Vocacional */}
          <div className="copilot-column h-full min-h-[560px] flex flex-col">
            <CopilotChat profileName={profileName} />
          </div>

        </section>

        {/* SECCIÓN 2: TU MAPA VOCACIONAL (Radar + Fortalezas) */}
        <section>
          <div className="mb-6">
            <h2 className="text-[28px] font-bold text-[#082A4A] flex items-center gap-2 mb-1">
              <BrainCircuit className="h-7 w-7 text-[#00C2E0]" />
              Tu mapa vocacional
            </h2>
            <p className="text-[#4F6B85] text-[15px]">
              Una vista general de tus afinidades. Cuanto mayor sea el valor, mayor es tu conexión con esa área.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-[24px] shadow-sm border border-[#D6E5EF] p-8">
            {/* Gráfico Radar */}
            <div className="h-[320px] md:h-[360px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                  <PolarGrid stroke="#D6E5EF" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#4F6B85", fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Tú"
                    dataKey="A"
                    stroke="#00C2E0"
                    strokeWidth={2.5}
                    fill="#00C2E0"
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Lo que dicen tus resultados */}
            <div className="bg-[#F8FCFF] rounded-[20px] p-6 h-full flex flex-col justify-center space-y-4">
              <h3 className="text-[18px] font-bold text-[#082A4A] mb-2">Lo que dicen tus resultados</h3>
              
              <div className="flex gap-4 p-4 rounded-[14px] bg-white shadow-xs border border-[#D6E5EF]/60">
                <div className="mt-0.5 shrink-0">
                  <Zap className="h-5 w-5 text-[#00C2E0]" strokeWidth={2.2} />
                </div>
                <div>
                  <h4 className="font-bold text-[#082A4A] text-[14px] mb-1">Gran afinidad con la tecnología</h4>
                  <p className="text-[13px] text-[#4F6B85] leading-relaxed">
                    Te interesa cómo funcionan los sistemas, la innovación y las herramientas digitales.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-[14px] bg-white shadow-xs border border-[#D6E5EF]/60">
                <div className="mt-0.5 shrink-0">
                  <Lightbulb className="h-5 w-5 text-[#00C2E0]" strokeWidth={2.2} />
                </div>
                <div>
                  <h4 className="font-bold text-[#082A4A] text-[14px] mb-1">Pensamiento lógico destacado</h4>
                  <p className="text-[13px] text-[#4F6B85] leading-relaxed">
                    Disfrutas analizar, resolver problemas y encontrar soluciones eficientes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-[14px] bg-white shadow-xs border border-[#D6E5EF]/60">
                <div className="mt-0.5 shrink-0">
                  <Crosshair className="h-5 w-5 text-[#00C2E0]" strokeWidth={2.2} />
                </div>
                <div>
                  <h4 className="font-bold text-[#082A4A] text-[14px] mb-1">Mentalidad investigadora</h4>
                  <p className="text-[13px] text-[#4F6B85] leading-relaxed">
                    Te motiva aprender, explorar nuevas ideas y profundizar en temas que te interesan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: TUS 3 CARRERAS CON MAYOR MATCH */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-[28px] font-bold text-[#082A4A] flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-[#00C2E0]" />
              Tus 3 carreras con mayor match
            </h2>
            <Link href="#" className="text-[#00C2E0] font-semibold text-[14px] hover:underline flex items-center no-print no-pdf">
              Ver todas las carreras <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCareers.map((career) => (
              <div
                key={career.id}
                className="bg-white rounded-[20px] p-6 shadow-sm border border-[#D6E5EF] flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="text-[17px] font-bold text-[#082A4A] leading-tight group-hover:text-[#00C2E0] transition-colors">
                      {career.name}
                    </h3>
                    <span className="bg-[#EAF6FF] text-[#00C2E0] font-bold px-2.5 py-1 rounded-[8px] text-[12px] shrink-0">
                      {career.match}%
                    </span>
                  </div>
                  <p className="text-[13px] text-[#4F6B85] mb-5 leading-relaxed line-clamp-3">
                    {career.justification}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    <span className="bg-[#F8FCFF] border border-[#D6E5EF] text-[#4F6B85] text-[11px] font-medium px-2.5 py-1 rounded-full">
                      Tecnología
                    </span>
                    <span className="bg-[#F8FCFF] border border-[#D6E5EF] text-[#4F6B85] text-[11px] font-medium px-2.5 py-1 rounded-full">
                      Lógica
                    </span>
                  </div>
                </div>

                <Link
                  href={`/carreras/${career.slug}`}
                  className="inline-flex h-[42px] items-center justify-center rounded-[12px] bg-[#00C2E0] hover:bg-[#0EA5C6] text-[13px] font-bold text-white transition-colors w-full shrink-0 shadow-xs"
                >
                  <span>Ver detalle</span>
                  <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
                </Link>
              </div>
            ))}

            {/* Tarjeta de Banner Inspiracional */}
            <div className="relative rounded-[20px] overflow-hidden shadow-sm border border-[#D6E5EF] flex flex-col justify-between p-7 text-white group">
              <Image
                src="/assets/robot_bg.jpg"
                alt="Futuro"
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#082A4A]/70" />
              <div className="relative z-10">
                <BrainCircuit className="h-8 w-8 text-[#00C2E0] mb-4" />
                <h3 className="text-[20px] font-bold leading-snug">
                  Más que una carrera, es la oportunidad de construir el futuro que imaginas.
                </h3>
              </div>
              <div className="relative z-10 text-[12.5px] text-white/80 font-medium">
                Orientador Vocacional UPC
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: ¿POR QUÉ LA CARRERA PRINCIPAL? */}
        {primaryCareer && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#EAF6FF] text-[#00C2E0] p-2.5 rounded-[12px]">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-[26px] font-bold text-[#082A4A] leading-tight">
                  ¿Por qué {primaryCareer.name}?
                </h2>
                <p className="text-[#4F6B85] text-[14px]">
                  Tu perfil {profileName.toLowerCase()} se alinea con las habilidades y retos de esta carrera.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
              <div className="space-y-4">
                <div className="flex gap-4 p-5 rounded-[18px] bg-white shadow-sm border border-[#D6E5EF]/60">
                  <Zap className="h-6 w-6 text-[#00C2E0] shrink-0 mt-0.5" strokeWidth={2.2} />
                  <div>
                    <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">Se conecta con tus intereses</h4>
                    <p className="text-[13px] text-[#4F6B85] leading-relaxed">
                      Las áreas que te motivan son el centro del ejercicio profesional de esta especialidad.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-[18px] bg-white shadow-sm border border-[#D6E5EF]/60">
                  <Crosshair className="h-6 w-6 text-[#00C2E0] shrink-0 mt-0.5" strokeWidth={2.2} />
                  <div>
                    <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">Aprovecha tus habilidades</h4>
                    <p className="text-[13px] text-[#4F6B85] leading-relaxed">
                      Tu capacidad analítica y enfoque estructurado te darán una clara ventaja de desarrollo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-[18px] bg-white shadow-sm border border-[#D6E5EF]/60">
                  <Lightbulb className="h-6 w-6 text-[#00C2E0] shrink-0 mt-0.5" strokeWidth={2.2} />
                  <div>
                    <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">Tiene un gran campo laboral</h4>
                    <p className="text-[13px] text-[#4F6B85] leading-relaxed">
                      Existe una alta demanda de profesionales especializados en esta disciplina en el Perú y el mundo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FCFF] rounded-[20px] border border-[#D6E5EF] p-6 flex flex-col justify-center space-y-3.5">
                <h4 className="font-bold text-[#082A4A] text-[15px] mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-[#00C2E0]" /> Conoce más sobre esta carrera
                </h4>
                <Link
                  href={`/carreras/${primaryCareer.slug}`}
                  className="flex justify-between items-center text-[13.5px] text-[#4F6B85] hover:text-[#00C2E0] font-medium py-1.5 border-b border-[#D6E5EF]/40"
                >
                  <span>Plan de estudios</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/carreras/${primaryCareer.slug}`}
                  className="flex justify-between items-center text-[13.5px] text-[#4F6B85] hover:text-[#00C2E0] font-medium py-1.5 border-b border-[#D6E5EF]/40"
                >
                  <span>Campo laboral</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/carreras/${primaryCareer.slug}`}
                  className="flex justify-between items-center text-[13.5px] text-[#4F6B85] hover:text-[#00C2E0] font-medium py-1.5 border-b border-[#D6E5EF]/40"
                >
                  <span>Universidades en Perú</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/carreras/${primaryCareer.slug}`}
                  className="flex justify-between items-center text-[13.5px] text-[#4F6B85] hover:text-[#00C2E0] font-medium py-1.5"
                >
                  <span>Salario promedio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 5: AHORA QUE CONOCES TU PERFIL... */}
        <section className="bg-[#EAF6FF] rounded-[24px] p-8 md:p-10 border border-[#D6E5EF] relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-[26px] font-bold text-[#082A4A] mb-2">Ahora que conoces tu perfil...</h2>
            <p className="text-[#4F6B85] text-[15px] mb-8">Da el siguiente paso y sigue explorando tu futuro profesional.</p>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-[16px] p-5 border border-[#D6E5EF] shadow-xs">
                <BrainCircuit className="h-6 w-6 text-[#00C2E0] mb-3" />
                <h4 className="font-bold text-[#082A4A] text-[14px] mb-1">Explora más carreras</h4>
                <p className="text-[12px] text-[#4F6B85] leading-relaxed">
                  Descubre otras opciones que también se alinean con tu perfil.
                </p>
              </div>

              <div className="bg-white rounded-[16px] p-5 border border-[#D6E5EF] shadow-xs">
                <Crosshair className="h-6 w-6 text-[#00C2E0] mb-3" />
                <h4 className="font-bold text-[#082A4A] text-[14px] mb-1">Compara opciones</h4>
                <p className="text-[12px] text-[#4F6B85] leading-relaxed">
                  Analiza diferencias entre programas, enfoques y malla curricular.
                </p>
              </div>

              <div className="bg-white rounded-[16px] p-5 border border-[#D6E5EF] shadow-xs">
                <Lightbulb className="h-6 w-6 text-[#00C2E0] mb-3" />
                <h4 className="font-bold text-[#082A4A] text-[14px] mb-1">Conoce el mercado laboral</h4>
                <p className="text-[12px] text-[#4F6B85] leading-relaxed">
                  Revisa la demanda real de egresados y opciones de especialización.
                </p>
              </div>
            </div>
          </div>

          {/* Decoración Chaski lateral */}
          <div className="absolute right-[-20px] bottom-[-20px] opacity-25 pointer-events-none hidden md:block">
            <Image
              src="/assets/analizando_perfil.png"
              alt="Chaski"
              width={220}
              height={220}
              unoptimized
              className="object-contain"
            />
          </div>
        </section>

      </main>

      {/* Footer Final */}
      <footer className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#4F6B85] border-t border-[#D6E5EF]/60 no-print no-pdf">
        <p>Orientador Vocacional con IA - Descubre tu potencial. Construye tu futuro.</p>
        <p className="mt-2 sm:mt-0">Un mejor mañana empieza con una buena decisión.</p>
      </footer>
    </div>
  );
}
