"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { ChaskiAnalysis } from "@/components/chaski/ChaskiAnalysis";

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
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/vocacional")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        return r.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const qs = data.questions || [];
        const opts = data.options || [];
        setQuestions(qs);
        setOptions(opts);
        localStorage.removeItem("vocational_answers_v2");
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('[Cuestionario] Error loading questions:', err);
        setFetchError(err?.message || 'Error desconocido');
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const q = questions[currentStep];
      if (answers[q.id] !== undefined) {
        setSelectedOption(answers[q.id]);
      } else {
        setSelectedOption(null);
      }
    }
  }, [currentStep, questions, answers]);

  const currentQuestion = questions[currentStep];
  const currentOptions = options.filter((o) => o.questionId === currentQuestion?.id);

  const handleSelectOption = (optionId: number) => {
    setSelectedOption(optionId);
  };

  const handleContinue = async () => {
    if (selectedOption === null) return;

    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);
    localStorage.setItem("vocational_answers_v2", JSON.stringify(newAnswers));

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
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
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-transparent">
        <div className="w-10 h-10 border-4 border-[#00C2E0] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#4F6B85] font-medium">Cargando cuestionario...</p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <ChaskiAnalysis />
      </div>
    );
  }

  if (fetchError || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-transparent">
        <p className="text-[#082A4A] font-bold text-xl">Error al cargar el cuestionario</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#00C2E0] text-white rounded-[12px] font-semibold hover:bg-[#0EA5C6] transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const progress = Math.round(((currentStep + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-transparent font-sans selection:bg-[#00C2E0] selection:text-white">
      <header className="px-6 py-4 flex items-center border-b border-[#D6E5EF] bg-white">
        <Link href="/" className="flex items-center gap-2 text-[#4F6B85] hover:text-[#082A4A] transition-colors text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          Salir
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[800px] flex flex-col">
          
          <div className="flex justify-between items-end mb-4 px-2">
            <span className="text-[14px] font-medium text-[#4F6B85]">
              Pregunta {currentStep + 1} de {questions.length}
            </span>
            <span className="text-[14px] font-bold text-[#00C2E0]">
              {progress}%
            </span>
          </div>
          
          <div className="w-full bg-[#DCEAF2] h-[8px] rounded-full overflow-hidden mb-10">
            <div
              className="bg-[#00C2E0] h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-white rounded-[20px] shadow-sm border border-[#D6E5EF] p-8 md:p-12">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#082A4A] mb-2 leading-tight">
              {currentQuestion?.questionText}
            </h2>
            <p className="text-[16px] text-[#4F6B85] mb-10">
              Selecciona la opción que más se acerque a ti.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`p-6 rounded-[16px] text-left border-[2px] transition-all duration-200 min-h-[100px] flex items-center ${
                    selectedOption === option.id
                      ? "border-[#00C2E0] bg-[#DEEEFF] shadow-sm"
                      : "border-[#D6E5EF] bg-white hover:border-[#0EA5C6] hover:bg-[#EAF6FF]"
                  }`}
                >
                  <span className={`text-[16px] font-medium ${selectedOption === option.id ? "text-[#082A4A]" : "text-[#4F6B85]"}`}>
                    {option.optionText}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-12 mb-8 text-center">
              <p className="text-[14px] text-[#4F6B85]">
                No hay respuestas correctas o incorrectas.<br className="hidden md:block"/>
                Solo opciones que te acercan a tu mejor versión.
              </p>
            </div>

            <div className="flex items-center justify-between mt-8 border-t border-[#D6E5EF] pt-8">
              <div>
                {currentStep > 0 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 h-[48px] px-6 rounded-[12px] border border-[#00C2E0] bg-white text-[#082A4A] font-semibold text-[14px] hover:bg-[#EAF6FF] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Anterior
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
              
              <button 
                onClick={handleContinue}
                disabled={selectedOption === null}
                className="flex items-center gap-2 h-[48px] px-8 bg-[#00C2E0] hover:bg-[#0EA5C6] disabled:opacity-50 disabled:hover:bg-[#00C2E0] text-white rounded-[12px] font-semibold text-[16px] transition-colors"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
