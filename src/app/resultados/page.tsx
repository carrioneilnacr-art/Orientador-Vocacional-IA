"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrainCircuit, RefreshCcw, ArrowRight, Lightbulb, Zap, Crosshair } from "lucide-react";
import FloatingChat from "@/components/chat/FloatingChat";
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F8FCFF]">
        <h2 className="text-2xl font-bold text-[#082A4A]">No tienes resultados aún o hubo un error</h2>
        <p className="text-[#4F6B85]">Completa el cuestionario para ver tus carreras recomendadas.</p>
        <Link
          href="/cuestionario"
          className="px-6 py-3 bg-[#00C2E0] hover:bg-[#0EA5C6] text-white rounded-[12px] font-semibold transition-colors"
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

  const topDimension = Object.entries(results.dimensionScores || {}).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0];
  const profileName = topDimension ? DIMENSION_LABELS[topDimension] : 'Analítico';

  return (
    <div className="min-h-screen bg-transparent text-[#082A4A] font-sans selection:bg-[#00C2E0] selection:text-white pb-20">
      {/* Header Limpio */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#D6E5EF] bg-white">
        <Link href="/" className="flex items-center gap-2 text-[#4F6B85] hover:text-[#082A4A] transition-colors text-sm font-medium">
          <BrainCircuit className="h-5 w-5" />
          Inicio
        </Link>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 text-[14px] font-medium border border-[#D6E5EF] rounded-full px-4 py-2 hover:bg-[#EAF6FF] text-[#082A4A] transition-colors"
        >
          <RefreshCcw className="h-4 w-4" />
          Volver a empezar
        </button>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        
        {/* Sección de Perfil */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-[16px] text-[#4F6B85] font-semibold mb-2">Tu perfil principal es:</p>
            <h1 className="text-[48px] md:text-[56px] font-bold text-[#082A4A] mb-6 capitalize leading-tight">
              {profileName}
            </h1>
            <p className="text-[16px] text-[#4F6B85] mb-10 max-w-lg leading-relaxed">
              Te motiva entender cómo funcionan las cosas, resolver problemas y encontrar soluciones con lógica. Destacas en entornos donde puedes analizar y construir ideas estructuradas.
            </p>
            
            <div className="space-y-5 max-w-md">
              {Object.entries(results.dimensionScores).slice(0, 5).map(([dim, score]) => (
                <div key={dim}>
                  <div className="flex justify-between text-[14px] font-medium mb-2">
                    <span className="text-[#082A4A]">{DIMENSION_LABELS[dim] || dim}</span>
                    <span className="text-[#00C2E0]">{score}%</span>
                  </div>
                  <div className="w-full bg-[#DCEAF2] h-[6px] rounded-full overflow-hidden">
                    <div className="bg-[#00C2E0] h-full rounded-full" style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative h-[400px] lg:h-[500px] rounded-[20px] overflow-hidden shadow-sm border border-[#D6E5EF]">
            <Image 
              src="/assets/robot_bg.jpg" 
              alt="Robot explorador y montaña" 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Mejores Carreras */}
        <div className="mb-20">
          <h2 className="text-[32px] font-bold text-[#082A4A] mb-8">Tus 3 carreras con mayor match</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {results.topCareers.slice(0, 3).map((career) => (
              <div key={career.id} className="bg-white rounded-[20px] p-6 shadow-sm border border-[#D6E5EF] flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="mb-6 flex justify-between items-start">
                  <h3 className="text-[20px] font-bold text-[#082A4A] leading-tight">{career.name}</h3>
                  <span className="bg-[#DEEEFF] text-[#00C2E0] font-bold px-3 py-1 rounded-[8px] text-[14px]">
                    {career.match}%
                  </span>
                </div>
                <p className="text-[14px] text-[#4F6B85] mb-8 flex-1">
                  {career.justification.substring(0, 100)}...
                </p>
                <Link
                  href={`/carreras/${career.slug}`}
                  className="inline-flex h-[44px] items-center justify-center rounded-[12px] bg-white border border-[#00C2E0] hover:bg-[#EAF6FF] text-[14px] font-semibold text-[#082A4A] transition-colors w-full"
                >
                  Ver detalle
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ADN Vocacional */}
        <div className="bg-white rounded-[20px] shadow-sm border border-[#D6E5EF] p-8 md:p-12 mb-12">
          <h2 className="text-[32px] font-bold text-[#082A4A] mb-10 text-center">Tu ADN vocacional</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Radar Chart */}
            <div className="h-[300px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#D6E5EF" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#4F6B85", fontSize: 12, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Tú"
                    dataKey="A"
                    stroke="#00C2E0"
                    strokeWidth={2}
                    fill="#00C2E0"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Fortalezas */}
            <div>
              <h3 className="text-[24px] font-semibold text-[#082A4A] mb-6">Tus fortalezas</h3>
              <div className="space-y-4">
                <div className="flex gap-4 p-5 rounded-[16px] bg-[#F8FCFF] border border-[#D6E5EF]">
                  <div className="text-[#082A4A]">
                    <Zap className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#082A4A] mb-1">Pensamiento analítico</h4>
                    <p className="text-[14px] text-[#4F6B85]">Te permite entender sistemas complejos y desglosarlos lógicamente.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-5 rounded-[16px] bg-[#F8FCFF] border border-[#D6E5EF]">
                  <div className="text-[#082A4A]">
                    <Lightbulb className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#082A4A] mb-1">Aprendizaje rápido</h4>
                    <p className="text-[14px] text-[#4F6B85]">Te adaptas con facilidad a nuevos entornos y adquieres habilidades velozmente.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-[16px] bg-[#F8FCFF] border border-[#D6E5EF]">
                  <div className="text-[#082A4A]">
                    <Crosshair className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#082A4A] mb-1">Enfoque en soluciones</h4>
                    <p className="text-[14px] text-[#4F6B85]">Prefieres encontrar y ejecutar soluciones en lugar de solo identificar el problema.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Bot Chat Flotante Minimalista */}
      <FloatingChat />
    </div>
  );
}

