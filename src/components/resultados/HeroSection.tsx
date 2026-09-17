"use client";

import { Quote, ArrowRight, TrendingUp, Lightbulb, Compass, Star, Briefcase } from "lucide-react";
import CopilotChat from "@/components/chat/CopilotChat";
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS } from "@/constants/dimensions";
import type { VocationalResults } from "@/types/vocacional";

interface HeroSectionProps {
  profileName: string;
  results: VocationalResults;
  selectedCareer: any;
  onSelectCareer: (career: any) => void;
}

const BADGES_BY_PROFILE: Record<string, string[]> = {
  LOGIC: ["ANÁLISIS", "ESTRUCTURA", "RESOLUCIÓN"],
  ARTISTIC: ["CREATIVIDAD", "EXPRESIÓN", "IMAGINACIÓN"],
  INVESTIGATIVE: ["CURIOSIDAD", "OBSERVACIÓN", "DESCUBRIMIENTO"],
  SOCIAL: ["EMPATÍA", "COMUNICACIÓN", "APOYO"],
  ENTERPRISING: ["LIDERAZGO", "INICIATIVA", "NEGOCIACIÓN"],
  CONVENTIONAL: ["ORGANIZACIÓN", "PRECESIÓN", "MÉTODO"]
};

export default function HeroSection({ profileName, results, selectedCareer, onSelectCareer }: HeroSectionProps) {
  const sortedDims = Object.entries(results.dimensionScores ?? {}).sort(([, a], [, b]) => (b as number) - (a as number));
  const topDimEntry = sortedDims[0];
  const topDimKey = topDimEntry?.[0] || "LOGIC";
  const topDimScore = topDimEntry?.[1] || 0;
  
  const profileDescription = DIMENSION_DESCRIPTIONS[topDimKey] || "Te motiva entender cómo funcionan las cosas y resolver problemas con lógica.";
  const badges = BADGES_BY_PROFILE[topDimKey] || ["TALENTO", "POTENCIAL", "HABILIDAD"];
  
  const topCareers = (results.topCareers || []).slice(0, 3);
  const otherDims = sortedDims.slice(1, 5);

  // Circumference for the SVG circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((topDimScore as number) / 100) * circumference;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1.1fr] gap-6 xl:gap-8 items-stretch mb-12">

      {/* Columna 1: Perfil Vocacional */}
      <div className="bg-white rounded-[24px] p-6 xl:p-8 shadow-sm border border-[#D6E5EF] flex flex-col justify-between h-full min-h-[560px] relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C2E0]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div>
          <p className="text-[14px] text-[#4F6B85] font-bold uppercase tracking-wider mb-3">Tu perfil principal es:</p>
          
          <div className="flex items-start justify-between gap-4 mb-5">
            <h1 className="text-[32px] xl:text-[40px] font-bold text-[#082A4A] capitalize leading-tight">
              {profileName}
            </h1>
            
            {/* Indicador circular grande */}
            <div className="relative w-[100px] h-[100px] shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} className="stroke-[#E8F8F1] fill-none" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r={radius} 
                  className="stroke-[#18A86B] fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="8" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[28px] font-black text-[#082A4A] leading-none">{topDimScore}%</span>
              </div>
            </div>
          </div>
          
          <p className="text-[#4F6B85] text-[14.5px] leading-relaxed mb-5">
            {profileDescription}
          </p>

          {/* 3 Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {badges.map((badge, i) => (
              <span key={i} className="bg-[#F8FCFF] border border-[#00C2E0]/20 text-[#00C2E0] text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wider">
                {badge}
              </span>
            ))}
          </div>

          {/* Otras afinidades */}
          <h4 className="text-[14px] font-bold text-[#082A4A] mb-4">Tus otras afinidades</h4>
          <div className="space-y-3.5 mb-6">
            {otherDims.map(([dim, score]) => (
              <div key={dim}>
                <div className="flex justify-between text-[12px] font-bold mb-1">
                  <span className="text-[#4F6B85]">{DIMENSION_LABELS[dim] ?? dim}</span>
                  <span className="text-[#00C2E0]">{score as number}%</span>
                </div>
                <div className="w-full bg-[#EAF6FF] h-[6px] rounded-full overflow-hidden">
                  <div
                    className="bg-[#00C2E0] h-full rounded-full transition-all duration-700"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna 2: Carreras Recomendadas */}
      <div className="flex flex-col min-h-[560px] gap-3">
        <h3 className="text-[#082A4A] font-bold text-[18px] px-1">Top Carreras Recomendadas</h3>
        {topCareers.map((career, index) => {
          const isPrimary = index === 0;
          const badgeBg = isPrimary ? "bg-[#18A86B]" : "bg-[#00C2E0]";
          const isSelected = selectedCareer?.id === career.id;
          
          return (
          <div
            key={career.id}
            onClick={() => onSelectCareer(career)}
            className={`bg-white rounded-[20px] p-5 shadow-sm border transition-all cursor-pointer flex flex-col justify-between group flex-1 relative overflow-hidden ${
              isSelected 
                ? "border-[#00C2E0] ring-4 ring-[#00C2E0]/10" 
                : "border-[#D6E5EF] hover:border-[#00C2E0]/50 hover:shadow-md hover:-translate-y-0.5"
            }`}
          >
            {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-[#00C2E0]" />}
            
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-[24px] font-black text-[#D6E5EF] group-hover:text-[#00C2E0]/40 transition-colors leading-none">
                    0{index + 1}
                  </span>
                  <h4 className={`text-[16px] font-bold leading-tight transition-colors ${
                    isSelected ? "text-[#00C2E0]" : "text-[#082A4A] group-hover:text-[#00C2E0]"
                  }`}>
                    {career.name}
                  </h4>
                </div>
                <span className={`${badgeBg} text-white font-bold px-2 py-1 rounded-[8px] text-[11px] shrink-0 shadow-sm`}>
                  {career.match}%
                </span>
              </div>
              <p className="text-[12.5px] text-[#4F6B85] line-clamp-2 mt-1">
                {career.justification}
              </p>
            </div>
            
            <div className={`mt-4 flex items-center justify-between text-[11px] font-bold transition-opacity ${isSelected ? "text-[#00C2E0] opacity-100" : "text-[#4F6B85] opacity-0 group-hover:opacity-100"}`}>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Ver proyección laboral</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        );
        })}
      </div>

      {/* Columna 3: Copiloto Vocacional */}
      <div className="copilot-column h-[560px] lg:h-auto lg:max-h-[640px] flex flex-col min-h-0 overflow-hidden bg-white rounded-[24px] shadow-sm border border-[#D6E5EF]">
        <CopilotChat profileName={profileName} />
      </div>
    </section>
  );
}
