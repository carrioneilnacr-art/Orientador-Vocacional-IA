"use client";

import { BrainCircuit, Zap, Lightbulb, Crosshair } from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import { DIMENSION_LABELS } from "@/constants/dimensions";
import type { VocationalResults } from "@/types/vocacional";

interface RadarSectionProps {
  results: VocationalResults;
}

export default function RadarSection({ results }: RadarSectionProps) {
  const radarData = Object.entries(results.dimensionScores).map(([dim, score]) => ({
    subject: DIMENSION_LABELS[dim] ?? dim,
    A: score,
    fullMark: 100,
  }));

  return (
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

        {/* Interpretación */}
        <div className="bg-[#F8FCFF] rounded-[20px] p-6 h-full flex flex-col justify-center space-y-4">
          <h3 className="text-[18px] font-bold text-[#082A4A] mb-2">Lo que dicen tus resultados</h3>

          {[
            { Icon: Zap, title: "Gran afinidad con la tecnología", desc: "Te interesa cómo funcionan los sistemas, la innovación y las herramientas digitales." },
            { Icon: Lightbulb, title: "Pensamiento lógico destacado", desc: "Disfrutas analizar, resolver problemas y encontrar soluciones eficientes." },
            { Icon: Crosshair, title: "Mentalidad investigadora", desc: "Te motiva aprender, explorar nuevas ideas y profundizar en temas que te interesan." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-4 rounded-[14px] bg-white shadow-xs border border-[#D6E5EF]/60">
              <div className="mt-0.5 shrink-0">
                <Icon className="h-5 w-5 text-[#00C2E0]" strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="font-bold text-[#082A4A] text-[14px] mb-1">{title}</h4>
                <p className="text-[13px] text-[#4F6B85] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
