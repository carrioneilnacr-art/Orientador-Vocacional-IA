"use client";

import { Quote, ArrowRight, TrendingUp } from "lucide-react";
import CopilotChat from "@/components/chat/CopilotChat";
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS } from "@/constants/dimensions";
import type { VocationalResults } from "@/types/vocacional";

interface HeroSectionProps {
  profileName: string;
  results: VocationalResults;
  selectedCareer: any;
  onSelectCareer: (career: any) => void;
}

export default function HeroSection({ profileName, results, selectedCareer, onSelectCareer }: HeroSectionProps) {
  const topDimEntry = Object.entries(results.dimensionScores ?? {})
    .sort(([, a], [, b]) => (b as number) - (a as number))[0];
  const topDimKey = topDimEntry?.[0] || "LOGIC";
  const profileDescription =
    DIMENSION_DESCRIPTIONS[topDimKey] ||
    "Te motiva entender cómo funcionan las cosas, resolver problemas y encontrar soluciones con lógica. Destacas en entornos donde puedes analizar y construir ideas estructuradas.";

  const topCareers = (results.topCareers || []).slice(0, 3);

  return (
    <section className="hero-grid grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_1.1fr] gap-8 items-stretch">

      {/* Columna 1: Perfil Vocacional */}
      <div className="bg-transparent flex flex-col justify-between h-full min-h-[560px]">
        <div>
          <p className="text-[15px] text-[#4F6B85] font-semibold mb-2">Tu perfil principal es:</p>
          <h1 className="text-[44px] xl:text-[52px] font-bold text-[#082A4A] mb-3 capitalize leading-tight">
            {profileName}
          </h1>
          <p className="text-[#4F6B85] text-[14.5px] leading-relaxed mb-6">
            {profileDescription}
          </p>

          {/* Barras de progreso */}
          <div className="space-y-3.5 mb-6">
            {Object.entries(results.dimensionScores)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 5)
              .map(([dim, score], index) => {
                const isPrimary = index === 0;
                const textColor = isPrimary ? "text-[#18A86B]" : "text-[#00C2E0]";
                const barColor = isPrimary ? "bg-[#18A86B]" : "bg-[#00C2E0]";
                const trackColor = isPrimary ? "bg-[#E8F8F1]" : "bg-[#EAF6FF]";

                return (
                  <div key={dim}>
                    <div className="flex justify-between text-[13px] font-bold mb-1">
                      <span className="text-[#082A4A]">{DIMENSION_LABELS[dim] ?? dim}</span>
                      <span className={textColor}>{score as number}%</span>
                    </div>
                    <div className={`w-full ${trackColor} h-[7px] rounded-full overflow-hidden`}>
                      <div
                        className={`${barColor} h-full rounded-full transition-all duration-700`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Cita de Chaski */}
        <div className="bg-[#EAF6FF]/70 border border-[#D6E5EF] rounded-[20px] p-5 relative mt-4 shadow-xs">
          <Quote className="h-5 w-5 text-[#00C2E0] fill-[#00C2E0]/20 mb-1" />
          <p className="text-[#082A4A] font-medium text-[14px] leading-relaxed">
            &ldquo;La tecnología no solo cambia el mundo, también crea oportunidades para personas como tú.&rdquo;
          </p>
          <p className="text-right text-[#4F6B85] text-[12.5px] font-bold mt-2">— Chaski</p>
        </div>
      </div>

      {/* Columna 2: Carreras Recomendadas */}
      <div className="flex flex-col min-h-[560px] gap-4">
        <h3 className="text-[#082A4A] font-bold text-[18px] mb-1">Top Carreras Recomendadas</h3>
        {topCareers.map((career, index) => {
          const isPrimary = index === 0;
          const badgeBg = isPrimary ? "bg-[#E8F8F1]" : "bg-[#EAF6FF]";
          const badgeText = isPrimary ? "text-[#18A86B]" : "text-[#00C2E0]";
          const isSelected = selectedCareer?.id === career.id;
          
          return (
          <div
            key={career.id}
            onClick={() => onSelectCareer(career)}
            className={`bg-white rounded-[20px] p-5 shadow-sm border transition-all cursor-pointer flex flex-col justify-between group flex-1 ${
              isSelected 
                ? "border-[#00C2E0] ring-4 ring-[#00C2E0]/10" 
                : "border-[#D6E5EF] hover:border-[#00C2E0]/50 hover:shadow-md"
            }`}
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className={`text-[16px] font-bold leading-tight transition-colors ${
                  isSelected ? "text-[#00C2E0]" : "text-[#082A4A] group-hover:text-[#00C2E0]"
                }`}>
                  {career.name}
                </h4>
                <span className={`${badgeBg} ${badgeText} font-bold px-2 py-1 rounded-[8px] text-[11px] shrink-0`}>
                  {career.match}%
                </span>
              </div>
              <p className="text-[12.5px] text-[#4F6B85] mb-4 line-clamp-3">
                {career.justification}
              </p>
            </div>
            
            <div
              className={`inline-flex h-[36px] items-center justify-center rounded-[10px] text-[12px] font-bold transition-colors w-full shrink-0 ${
                isSelected
                  ? "bg-[#00C2E0] text-white shadow-sm"
                  : "bg-[#00C2E0]/10 group-hover:bg-[#00C2E0] text-[#00C2E0] group-hover:text-white"
              }`}
            >
              <TrendingUp className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              <span>Ver empleabilidad y malla</span>
            </div>
          </div>
        );
        })}
      </div>

      {/* Columna 3: Copiloto Vocacional */}
      <div className="copilot-column h-[560px] lg:h-[640px] flex flex-col min-h-0 overflow-hidden">
        <CopilotChat profileName={profileName} />
      </div>
    </section>
  );
}
