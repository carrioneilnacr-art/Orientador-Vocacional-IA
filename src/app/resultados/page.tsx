"use client";

import Link from "next/link";
import { useVocationalResults } from "@/hooks/useVocationalResults";
import { triggerPrintAsPDF } from "@/utils/pdfPrint";
import { useState } from "react";

import ReportHeader    from "@/components/resultados/ReportHeader";
import HeroSection     from "@/components/resultados/HeroSection";
import RadarSection    from "@/components/resultados/RadarSection";
import CareersSection  from "@/components/resultados/CareersSection";
import WhyCareerSection from "@/components/resultados/WhyCareerSection";
import NextStepsSection from "@/components/resultados/NextStepsSection";

export default function ResultadosPage() {
  const { results, isLoaded, profileName, testId } = useVocationalResults();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    triggerPrintAsPDF(
      profileName,
      () => setIsDownloading(true),
      () => setIsDownloading(false),
      testId,
    );
  };

  const handleRestart = () => {
    localStorage.removeItem("vocational_answers_v2");
    localStorage.removeItem("vocational_answers_v3");
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

  if (!results?.dimensionScores || !results.topCareers?.length) {
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

  const topCareers    = results.topCareers.slice(0, 3);
  const primaryCareer = topCareers[0];

  return (
    <div className="min-h-screen bg-[#F8FCFF] text-[#082A4A] font-sans selection:bg-[#00C2E0] selection:text-white pb-20">
      <ReportHeader
        isDownloading={isDownloading}
        onDownload={handleDownload}
        onRestart={handleRestart}
      />

      <main id="report-content" className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 py-8 space-y-16">

        {/* Banner exclusivo para PDF (oculto en vista web) */}
        <div className="hidden pdf-only-banner items-center justify-between pb-6 border-b border-[#D6E5EF]">
          <div>
            <h1 className="text-2xl font-bold text-[#082A4A]">Orientador Vocacional IA</h1>
            <p className="text-sm text-[#4F6B85]">Reporte Oficial de Resultados y Afinidad Vocacional</p>
          </div>
          <div className="text-right text-xs text-[#4F6B85]">
            <p className="font-semibold text-[#082A4A]">Perfil: {profileName}</p>
            {testId && <p className="font-mono text-[11px] font-bold text-[#00C2E0]">ID: {testId}</p>}
            <p>Generado el {new Date().toLocaleDateString("es-PE")}</p>
          </div>
        </div>

        <HeroSection     profileName={profileName} results={results} />
        <RadarSection    results={results} />
        <CareersSection  topCareers={topCareers} />
        {primaryCareer && (
          <WhyCareerSection career={primaryCareer} profileName={profileName} />
        )}
        <NextStepsSection />
      </main>

      <footer className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#4F6B85] border-t border-[#D6E5EF]/60 no-print no-pdf">
        <p>Orientador Vocacional con IA - Descubre tu potencial. Construye tu futuro.</p>
        <p className="mt-2 sm:mt-0">Un mejor mañana empieza con una buena decisión.</p>
      </footer>
    </div>
  );
}
