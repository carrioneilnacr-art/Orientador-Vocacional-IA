"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import Link from "next/link";

interface Question {
  id: number;
  code: string;
  dimension: string;
  questionText: string;
  orderNumber: number;
}

interface Option {
  id: number;
  questionId: number;
  optionText: string;
  scorePayload: Record<string, number>;
}

export default function CuestionarioPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId -> optionId
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load questions from API
    fetch("/api/vocacional")
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setOptions(data.options || []);

        // Restore saved answers
        const saved = localStorage.getItem("vocational_answers_v2");
        if (saved) {
          try {
            setAnswers(JSON.parse(saved));
          } catch {}
        }
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  const currentQuestion = questions[currentStep];
  const currentOptions = options.filter((o) => o.questionId === currentQuestion?.id);

  const handleAnswer = async (optionId: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(newAnswers);
    localStorage.setItem("vocational_answers_v2", JSON.stringify(newAnswers));

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      // Last question answered - calculate results
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/vocacional", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: newAnswers }),
        });
        const result = await res.json();
        localStorage.setItem("vocational_results", JSON.stringify(result));
        router.push("/resultados");
      } catch {
        router.push("/resultados");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Cargando cuestionario...</p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">Analizando tu perfil vocacional...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error al cargar el cuestionario. Intenta más tarde.</p>
      </div>
    );
  }

  const progress = (currentStep / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white">
        <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <BrainCircuit className="h-5 w-5" />
          <span className="font-semibold">Orientador IA</span>
        </Link>
        <div className="text-sm font-medium text-slate-500">
          Pregunta {currentStep + 1} de {questions.length}
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
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-4">
            Dimensión: {currentQuestion?.dimension}
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-center text-slate-900 mb-10 min-h-[4rem]">
            {currentQuestion?.questionText}
          </h2>

          <div className="space-y-3">
            {currentOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`w-full p-4 rounded-xl text-left border-2 transition-all text-sm ${
                  answers[currentQuestion?.id] === option.id
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                    : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                }`}
              >
                {option.optionText}
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
