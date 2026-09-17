"use client";

import { useVocationalResults } from "@/hooks/useVocationalResults";
import { triggerPrintAsPDF } from "@/utils/pdfPrint";
import { useState } from "react";
import Link from "next/link";

import { ResultsHeader } from "@/components/resultados/ResultsHeader";
import { ProfileHero } from "@/components/resultados/ProfileHero";
import { CareerRecommendations } from "@/components/resultados/CareerRecommendations";
import { DecisionInsights } from "@/components/resultados/DecisionInsights";
import { UniversityMap } from "@/components/resultados/UniversityMap";
import { FutureRoute } from "@/components/resultados/FutureRoute";
import { NextSteps } from "@/components/resultados/NextSteps";
import { ChaskiClosing } from "@/components/resultados/ChaskiClosing";
import CopilotChat from "@/components/chat/CopilotChat";

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
      <div className="min-h-screen flex items-center justify-center bg-[#F5FAFD]">
        <div className="w-10 h-10 border-4 border-[#08BBD5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!results?.dimensionScores || !results.topCareers?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F5FAFD] px-6 text-center">
        <h2 className="text-2xl font-bold text-[#0B2D4D]">No tienes resultados aún o hubo un error</h2>
        <p className="text-[#466579]">Completa el cuestionario para ver tus carreras recomendadas.</p>
        <Link
          href="/cuestionario"
          className="px-6 py-3 bg-[#08BBD5] hover:bg-[#07AFC8] text-white rounded-xl font-bold transition-colors shadow-sm"
        >
          Ir al cuestionario
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FAFD] text-[#0B2D4D] font-sans selection:bg-[#08BBD5] selection:text-white">
      <ResultsHeader 
        isDownloading={isDownloading} 
        onDownload={handleDownload} 
        onRestart={handleRestart} 
      />

      <main id="report-content" className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-12 sm:space-y-16">
        
        {/* Banner exclusivo para PDF (oculto en vista web) */}
        <div className="hidden pdf-only-banner items-center justify-between pb-6 border-b border-[#D9EAF2]">
          <div>
            <h1 className="text-2xl font-bold text-[#0B2D4D]">Orientador Vocacional IA</h1>
            <p className="text-sm text-[#466579]">Reporte Oficial de Resultados y Afinidad Vocacional</p>
          </div>
          <div className="text-right text-xs text-[#466579]">
            <p className="font-semibold text-[#0B2D4D]">Perfil: {profileName}</p>
            {testId && <p className="font-mono text-[11px] font-bold text-[#08BBD5]">ID: {testId}</p>}
            <p>Generado el {new Date().toLocaleDateString("es-PE")}</p>
          </div>
        </div>

        <section>
          <ProfileHero profileName={profileName} dimensionScores={results.dimensionScores} />
        </section>

        <section>
          <CareerRecommendations careers={results.topCareers} />
        </section>

        <section>
          <DecisionInsights career={results.topCareers[0]} />
        </section>

        <section>
          <UniversityMap />
        </section>

        <section>
          <FutureRoute />
        </section>

        <section>
          <NextSteps />
        </section>

        {/* Chaski Copiloto (chatbot existente) */}
        <section className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D4D] mb-1.5">Copiloto Vocacional</h2>
            <p className="text-[#466579] text-[15px]">Conversa con Chaski para resolver tus dudas sobre tu perfil o las carreras recomendadas.</p>
          </div>
          <div className="h-[600px] bg-white rounded-[28px] border border-[#D9EAF2] shadow-[0_10px_40px_rgba(11,45,77,0.06)] overflow-hidden">
            <CopilotChat profileName={profileName} />
          </div>
        </section>

        <ChaskiClosing />

      </main>
    </div>
  );
}
