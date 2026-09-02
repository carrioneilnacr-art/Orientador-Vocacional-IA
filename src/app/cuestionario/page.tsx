"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";

// Mock data, eventually will come from Supabase via Server Component / API
const QUESTIONS = [
  {
    id: 1,
    text: "¿Disfrutas armar, desarmar o reparar dispositivos electrónicos o mecánicos?",
    dimension: "Realista",
  },
  {
    id: 2,
    text: "¿Te apasiona investigar cómo funcionan las cosas y resolver problemas lógicos complejos?",
    dimension: "Investigador",
  },
  {
    id: 3,
    text: "¿Prefieres expresar tus ideas a través del diseño, la música o la escritura creativa?",
    dimension: "Artístico",
  },
  {
    id: 4,
    text: "¿Sientes satisfacción al enseñar, ayudar o curar a otras personas?",
    dimension: "Social",
  },
  {
    id: 5,
    text: "¿Te gusta liderar equipos, convencer a otros o emprender nuevos proyectos?",
    dimension: "Emprendedor",
  },
  {
    id: 6,
    text: "¿Eres muy organizado, detallista y prefieres seguir procedimientos claros?",
    dimension: "Convencional",
  },
  {
    id: 7,
    text: "¿Te fascina la programación, la inteligencia artificial o estar al día con el último software?",
    dimension: "Tecnológico",
  },
  {
    id: 8,
    text: "¿Tienes facilidad para los números, las estadísticas y el cálculo matemático?",
    dimension: "Lógico-Matemático",
  }
];

const OPTIONS = [
  { value: 1, label: "Totalmente en desacuerdo" },
  { value: 2, label: "En desacuerdo" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "De acuerdo" },
  { value: 5, label: "Totalmente de acuerdo" }
];

export default function CuestionarioPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("vocational_answers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        // Find first unanswered question
        const answeredKeys = Object.keys(parsed).map(Number);
        const lastAnswered = Math.max(-1, ...answeredKeys);
        if (lastAnswered >= 0 && lastAnswered < QUESTIONS.length - 1) {
          setCurrentStep(lastAnswered); // Continue from the last answered
        }
      } catch (e) {
        console.error("Failed to parse saved answers");
      }
    }
    setIsLoaded(true);
  }, []);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);
    localStorage.setItem("vocational_answers", JSON.stringify(newAnswers));

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      // Calculate and redirect to results
      router.push("/resultados");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  const progress = ((currentStep) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white">
        <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <BrainCircuit className="h-5 w-5" />
          <span className="font-semibold">Orientador IA</span>
        </Link>
        <div className="text-sm font-medium text-slate-500">
          Pregunta {currentStep + 1} de {QUESTIONS.length}
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 h-1.5">
        <div 
          className="bg-blue-600 h-1.5 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
          
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-900 mb-10 min-h-[5rem]">
            {QUESTIONS[currentStep].text}
          </h2>

          <div className="space-y-3">
            {OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                  answers[currentStep] === option.value
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                    : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-10 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
