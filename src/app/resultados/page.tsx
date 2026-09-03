"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit, RefreshCcw, BookOpen, MapPin, DollarSign } from "lucide-react";
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

// Dimension display labels
const DIMENSION_LABELS: Record<string, string> = {
  TECH: "Tecnológico",
  LOGIC: "Lógico-Mat.",
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

        // Save context for the chatbot
        const profileContext = {
          radarData: Object.entries(parsed.dimensionScores || {}).map(([dim, score]) => ({
            subject: DIMENSION_LABELS[dim] || dim,
            A: score,
            fullMark: 100,
          })),
          topCareers: (parsed.topCareers || []).map((c: CareerResult) => ({
            name: c.name,
            match: c.match,
            faculty: c.faculty,
            campuses: c.campuses,
            cost: c.cost,
            justification: c.justification,
          })),
        };
        localStorage.setItem("vocational_profile_context", JSON.stringify(profileContext));
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Cargando resultados...</p>
      </div>
    );
  }

  if (!results || results.topCareers.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">No tienes resultados aún</h2>
        <p className="text-slate-500">Completa el cuestionario para ver tus carreras recomendadas.</p>
        <Link
          href="/cuestionario"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Ir al cuestionario
        </Link>
      </div>
    );
  }

  const radarData = Object.entries(results.dimensionScores).map(([dim, score]) => ({
    subject: DIMENSION_LABELS[dim] || dim,
    A: score,
    fullMark: 100,
  }));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white sticky top-0 z-10 shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-slate-900 transition-colors">
          <BrainCircuit className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">Orientador IA</span>
        </Link>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <RefreshCcw className="h-4 w-4" />
          Rehacer Test
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Tu Perfil Vocacional
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Hemos analizado tus respuestas basándonos en el modelo RIASEC y dimensiones tecnológicas.
            Aquí tienes un resumen de tus fortalezas e intereses y nuestras recomendaciones.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Radar Chart */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-6 w-full text-center">Dimensiones de Afinidad</h3>
            <div className="w-full aspect-square relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Tú"
                    dataKey="A"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Scores table */}
            <div className="w-full mt-4 space-y-1.5">
              {Object.entries(results.dimensionScores)
                .sort(([, a], [, b]) => b - a)
                .map(([dim, score]) => (
                  <div key={dim} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{DIMENSION_LABELS[dim] || dim}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-700 w-8 text-right">{score}%</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Careers */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Carreras Recomendadas</h3>

            {results.topCareers.map((career) => (
              <div
                key={career.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-bl-2xl">
                  {career.match}% Match
                </div>

                <h4 className="text-xl font-bold text-slate-900 mb-1 pr-24">{career.name}</h4>
                <p className="text-sm font-medium text-blue-600 mb-4">{career.faculty}</p>

                {career.justification && (
                  <p className="text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl text-sm">
                    <span className="font-semibold block mb-1">¿Por qué es para ti?</span>
                    {career.justification}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                  {career.campuses.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {career.campuses.join(", ")}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Pensión base: {career.cost}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <Link
                      href={`/carreras/${career.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver detalle de carrera
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
