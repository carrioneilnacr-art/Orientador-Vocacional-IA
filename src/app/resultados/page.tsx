"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit, RefreshCcw, BookOpen, MapPin, DollarSign, Sparkles } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// Mock calculated data (in reality, this would be computed by the Backend AI Specialist)
const mockRadarData = [
  { subject: "Realista", A: 80, fullMark: 100 },
  { subject: "Investigador", A: 90, fullMark: 100 },
  { subject: "Artístico", A: 40, fullMark: 100 },
  { subject: "Social", A: 60, fullMark: 100 },
  { subject: "Emprendedor", A: 70, fullMark: 100 },
  { subject: "Convencional", A: 50, fullMark: 100 },
  { subject: "Tecnológico", A: 95, fullMark: 100 },
  { subject: "Lógico-Mat.", A: 85, fullMark: 100 },
];

const topCareers = [
  {
    id: "ingenieria-software",
    name: "Ingeniería de Software",
    match: 94,
    justification: "Tus altos puntajes en Tecnológico e Investigador indican una gran afinidad por resolver problemas complejos mediante código y arquitectura de sistemas.",
    faculty: "Ingeniería",
    campuses: ["San Miguel", "Monterrico", "Villa"],
    cost: "S/ 1,500 - S/ 3,200",
  },
  {
    id: "ciencias-computacion",
    name: "Ciencias de la Computación",
    match: 89,
    justification: "Tu perfil Lógico-Matemático e Investigador te hace ideal para profundizar en algoritmos, IA y las bases teóricas de la tecnología.",
    faculty: "Ingeniería",
    campuses: ["San Miguel", "Monterrico"],
    cost: "S/ 1,500 - S/ 3,200",
  },
  {
    id: "ingenieria-sistemas",
    name: "Ingeniería de Sistemas de Información",
    match: 82,
    justification: "Tu interés Emprendedor sumado a lo Tecnológico se alinea con la gestión de tecnología para objetivos de negocio.",
    faculty: "Ingeniería",
    campuses: ["San Isidro", "Monterrico", "Villa", "San Miguel"],
    cost: "S/ 1,500 - S/ 3,200",
  }
];

export default function ResultadosPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Analizando perfil...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white sticky top-0 z-10 shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-slate-900 transition-colors">
          <BrainCircuit className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">Orientador IA</span>
        </Link>
        <button 
          onClick={() => {
            localStorage.removeItem("vocational_answers");
            window.location.href = "/cuestionario";
          }}
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
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockRadarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
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
          </div>

          {/* Top 3 Careers */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              Carreras Recomendadas
            </h3>
            
            {topCareers.map((career, index) => (
              <div key={career.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-bl-2xl">
                  {career.match}% Match
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 mb-1 pr-20">{career.name}</h4>
                <p className="text-sm font-medium text-blue-600 mb-4">{career.faculty}</p>
                
                <p className="text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl">
                  <span className="font-semibold block mb-1">¿Por qué es para ti?</span>
                  {career.justification}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {career.campuses.join(", ")}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Pensión base: {career.cost}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <button className="text-blue-600 hover:underline">Ver Malla Curricular</button>
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
