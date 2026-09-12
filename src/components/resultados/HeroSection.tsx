"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import CopilotChat from "@/components/chat/CopilotChat";
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS } from "@/constants/dimensions";
import type { VocationalResults } from "@/types/vocacional";

interface HeroSectionProps {
  profileName: string;
  results: VocationalResults;
}

export default function HeroSection({ profileName, results }: HeroSectionProps) {
  const topDimEntry = Object.entries(results.dimensionScores ?? {})
    .sort(([, a], [, b]) => (b as number) - (a as number))[0];
  const topDimKey = topDimEntry?.[0] || "LOGIC";
  const profileDescription =
    DIMENSION_DESCRIPTIONS[topDimKey] ||
    "Te motiva entender cómo funcionan las cosas, resolver problemas y encontrar soluciones con lógica. Destacas en entornos donde puedes analizar y construir ideas estructuradas.";

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
              .map(([dim, score]) => (
                <div key={dim}>
                  <div className="flex justify-between text-[13px] font-bold mb-1">
                    <span className="text-[#082A4A]">{DIMENSION_LABELS[dim] ?? dim}</span>
                    <span className="text-[#00C2E0]">{score as number}%</span>
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
            &ldquo;La tecnología no solo cambia el mundo, también crea oportunidades para personas como tú.&rdquo;
          </p>
          <p className="text-right text-[#4F6B85] text-[12.5px] font-bold mt-2">— Chaski</p>
        </div>
      </div>

      {/* Columna 2: Imagen inspiracional */}
      <div className="relative rounded-[24px] overflow-hidden shadow-sm border border-[#D6E5EF] min-h-[560px] flex flex-col justify-between group">
        <Image
          src="/assets/robot_bg.jpg"
          alt="Grandes decisiones, mejores futuros"
          fill
          unoptimized
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
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
  );
}
