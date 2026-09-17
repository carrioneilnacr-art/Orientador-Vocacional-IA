"use client";

import Image from "next/image";
import { BrainCircuit, Zap, Lightbulb, Crosshair, Sparkles } from "lucide-react";
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

  // Generamos tarjetas dinámicas basadas en los resultados principales
  const sortedDims = Object.entries(results.dimensionScores).sort(([, a], [, b]) => (b as number) - (a as number));
  const topDim = sortedDims[0]?.[0] || "LOGIC";

  const getInsights = (dim: string) => {
    switch(dim) {
      case "LOGIC":
      case "CONVENTIONAL":
        return [
          { Icon: Zap, title: "Gran afinidad con la tecnología", desc: "Te interesa cómo funcionan los sistemas, la innovación y las herramientas digitales." },
          { Icon: Lightbulb, title: "Pensamiento lógico destacado", desc: "Disfrutas analizar, resolver problemas y encontrar soluciones eficientes." },
          { Icon: Crosshair, title: "Mentalidad estructurada", desc: "Te motiva el orden, los datos y profundizar en metodologías exactas." },
        ];
      case "ARTISTIC":
        return [
          { Icon: Zap, title: "Alta sensibilidad creativa", desc: "Tienes una visión estética única y disfrutas la expresión original." },
          { Icon: Lightbulb, title: "Innovación y diseño", desc: "Tu mente conecta ideas dispares para crear soluciones fuera de lo común." },
          { Icon: Crosshair, title: "Enfoque en la experiencia", desc: "Te importa cómo las personas sienten y experimentan tu trabajo." },
        ];
      case "SOCIAL":
      case "ENTERPRISING":
        return [
          { Icon: Zap, title: "Conexión humana fuerte", desc: "Entiendes a las personas y disfrutas colaborando y liderando equipos." },
          { Icon: Lightbulb, title: "Visión transformadora", desc: "Te motiva crear un impacto positivo y comunicar ideas de forma efectiva." },
          { Icon: Crosshair, title: "Resolución empática", desc: "Abordas los problemas pensando en el bienestar común y el progreso." },
        ];
      default:
        return [
          { Icon: Zap, title: "Gran curiosidad intelectual", desc: "Te interesa aprender de diversas áreas y conectar diferentes disciplinas." },
          { Icon: Lightbulb, title: "Pensamiento analítico", desc: "Disfrutas desglosar información compleja para entender el panorama general." },
          { Icon: Crosshair, title: "Mentalidad investigadora", desc: "Te motiva explorar nuevas ideas y profundizar en temas que te apasionan." },
        ];
    }
  };

  const insights = getInsights(topDim);

  return (
    <section className="w-full relative">
      <div className="mb-8">
        <h2 className="text-[32px] font-bold text-[#082A4A] flex items-center gap-2 mb-2">
          Tu mapa vocacional
        </h2>
        <p className="text-[#4F6B85] text-[16px] font-medium">
          Una vista general de tus afinidades. Conoce en qué áreas brillas más.
        </p>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-[#D6E5EF] p-8 xl:p-10 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#18A86B]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
          
          {/* Gráfico Radar - Protagonista */}
          <div className="flex flex-col relative">
            <div className="h-[400px] md:h-[480px] w-full flex items-center justify-center relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="#D6E5EF" strokeDasharray="4 4" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: "#082A4A", fontSize: 13, fontWeight: 700 }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Tú"
                    dataKey="A"
                    stroke="#00C2E0"
                    strokeWidth={3}
                    fill="#00C2E0"
                    fillOpacity={0.15}
                    activeDot={{ r: 6, fill: "#18A86B", stroke: "#fff", strokeWidth: 2 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Chaski Pequeño */}
            <div className="absolute bottom-0 left-0 flex items-center gap-4 bg-[#F8FCFF] border border-[#D6E5EF] p-3 pr-5 rounded-[20px] rounded-bl-none z-20 shadow-sm max-w-[280px]">
              <div className="relative w-16 h-16 shrink-0">
                <Image src="/assets/chaski/chaski-8.png" alt="Chaski Analítico" fill className="object-contain" />
              </div>
              <div>
                <p className="text-[12.5px] text-[#4F6B85] leading-tight font-medium">
                  <strong className="text-[#082A4A] block mb-0.5">Conoce tus fortalezas.</strong> 
                  Ahora, veamos dónde pueden llevarte.
                </p>
              </div>
            </div>
          </div>

          {/* Interpretación - Tarjetas */}
          <div className="flex flex-col justify-center space-y-6">
            <h3 className="text-[20px] font-bold text-[#082A4A] mb-2 flex items-center gap-2">
              Lo que dicen tus resultados <Sparkles className="w-5 h-5 text-[#F4C95D]" />
            </h3>

            <div className="space-y-4">
              {insights.map(({ Icon, title, desc }, idx) => (
                <div key={title} className="group flex gap-4 p-5 rounded-[16px] bg-[#F8FCFF] border border-[#D6E5EF] hover:border-[#00C2E0]/40 transition-all hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden">
                  {/* Accent line */}
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#D6E5EF] group-hover:bg-[#00C2E0] transition-colors" />
                  
                  <div className="mt-0.5 shrink-0 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-[#00C2E0] group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">{title}</h4>
                    <p className="text-[13.5px] text-[#4F6B85] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
