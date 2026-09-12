'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ChaskiAnalysis } from '@/components/chaski/ChaskiAnalysis';
import { RandomTestController } from '@/components/questionnaire/RandomTestController';
import { AdventureIntro } from '@/components/questionnaire/AdventureIntro';
import { MissionHeader } from '@/components/questionnaire/MissionHeader';
import { MissionInterlude } from '@/components/questionnaire/MissionInterlude';
import { ChoiceCard } from '@/components/questionnaire/ChoiceCard';
import type { QuestionItem, OptionItem } from '@/data/questionnaireData';

type ViewMode = 'INTRO' | 'QUESTIONS' | 'INTERLUDE' | 'SUBMITTING';

export default function CuestionarioPage() {
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>('INTRO');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [completedInterludeMission, setCompletedInterludeMission] = useState<number>(1);

  // Cargar preguntas y opciones desde el endpoint
  useEffect(() => {
    fetch('/api/vocacional')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const qs: QuestionItem[] = data.questions || [];
        const opts: OptionItem[] = data.options || [];
        setQuestions(qs);
        setOptions(opts);

        // Restaurar respuestas previas si existen
        try {
          const saved = localStorage.getItem('vocational_answers_v3');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
              setAnswers(parsed);
            }
          }
        } catch {
          // ignore corrupted local storage
        }

        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('[Cuestionario] Error al cargar preguntas:', err);
        setIsLoaded(true);
      });
  }, []);

  // Actualizar la opción seleccionada al cambiar de paso
  useEffect(() => {
    if (questions.length > 0 && questions[currentStep]) {
      const q = questions[currentStep];
      if (answers[q.id] !== undefined) {
        setSelectedOption(answers[q.id]);
      } else {
        setSelectedOption(null);
      }
    }
  }, [currentStep, questions, answers]);

  const currentQuestion = questions[currentStep] || null;
  const currentOptions = currentQuestion
    ? options.filter((o) => o.questionId === currentQuestion.id)
    : [];

  const currentMissionNumber = currentQuestion ? currentQuestion.missionNumber : 1;

  // Seleccionar opción
  const handleSelectOption = (optionId: number) => {
    setSelectedOption(optionId);
  };

  // Enviar respuestas a la API
  const submitAnswers = useCallback(
    async (finalAnswers: Record<number, number>) => {
      setViewMode('SUBMITTING');
      try {
        const res = await fetch('/api/vocacional', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: finalAnswers }),
        });
        const result = await res.json();
        localStorage.setItem('vocational_results', JSON.stringify(result));
        localStorage.setItem('vocational_answers_v3', JSON.stringify(finalAnswers));

        // Breve pausa para que el usuario disfrute la animación de Chaski
        setTimeout(() => {
          router.push('/resultados');
        }, 1800);
      } catch (err) {
        console.error('[Cuestionario] Error enviando respuestas:', err);
        router.push('/resultados');
      }
    },
    [router]
  );

  // Avanzar a la siguiente pregunta o mostrar interludio entre misiones
  const handleContinue = () => {
    if (selectedOption === null || !currentQuestion) return;

    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);
    localStorage.setItem('vocational_answers_v3', JSON.stringify(newAnswers));

    // Si terminó la Misión 1 (paso 3), Misión 2 (paso 7) o Misión 3 (paso 11) -> Mostrar interludio
    if (currentStep === 3) {
      setCompletedInterludeMission(1);
      setViewMode('INTERLUDE');
      return;
    }
    if (currentStep === 7) {
      setCompletedInterludeMission(2);
      setViewMode('INTERLUDE');
      return;
    }
    if (currentStep === 11) {
      setCompletedInterludeMission(3);
      setViewMode('INTERLUDE');
      return;
    }

    // Si es la última pregunta (15) -> Enviar cuestionario
    if (currentStep >= questions.length - 1) {
      submitAnswers(newAnswers);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Regresar a la pregunta anterior
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setViewMode('INTRO');
    }
  };

  // Continuar tras el interludio de Chaski
  const handleResumeAfterInterlude = () => {
    setViewMode('QUESTIONS');
    setCurrentStep((prev) => prev + 1);
  };

  // Función de pruebas rápidas: auto-completar todo al azar y finalizar
  const handleAutoSubmitAllRandom = (randomAnswers: Record<number, number>) => {
    setAnswers(randomAnswers);
    submitAnswers(randomAnswers);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8FCFF]">
        <div className="w-10 h-10 border-4 border-[#00C2E0] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#4F6B85] font-medium text-sm">Cargando la aventura de Chaski...</p>
      </div>
    );
  }

  if (viewMode === 'SUBMITTING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FCFF]">
        <ChaskiAnalysis message="Chaski está analizando tus 16 decisiones y encontrando los caminos universitarios más afines con tu perfil." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FCFF] font-sans selection:bg-[#00C2E0] selection:text-white">
      {/* Botón flotante para pruebas rápidas / QA */}
      <RandomTestController
        questions={questions}
        options={options}
        currentQuestion={currentQuestion}
        onSelectOption={handleSelectOption}
        onAutoSubmitAllRandom={handleAutoSubmitAllRandom}
        onAdvanceToNext={handleContinue}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10">
        <AnimatePresence mode="wait">
          {viewMode === 'INTRO' && (
            <AdventureIntro
              key="intro"
              onStart={() => setViewMode('QUESTIONS')}
            />
          )}

          {viewMode === 'INTERLUDE' && (
            <MissionInterlude
              key="interlude"
              completedMissionNumber={completedInterludeMission}
              onContinue={handleResumeAfterInterlude}
            />
          )}

          {viewMode === 'QUESTIONS' && currentQuestion && (
            <motion.div
              key={`q-${currentQuestion.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[820px] flex flex-col"
            >
              {/* Encabezado y barra segmentada */}
              <MissionHeader
                currentStep={currentStep}
                totalQuestions={questions.length}
                currentMissionNumber={currentMissionNumber}
              />

              {/* Tarjeta Principal de la Pregunta */}
              <div className="bg-white rounded-[24px] shadow-sm border border-[#D6E5EF] p-6 sm:p-10 md:p-12">
                <div className="mb-8">
                  <div className="inline-block px-3 py-1 bg-[#F0F5F9] rounded-lg text-xs font-bold text-[#00C2E0] uppercase tracking-wider mb-3">
                    Decisión #{currentQuestion.orderNumber}
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#082A4A] leading-snug tracking-tight">
                    {currentQuestion.questionText}
                  </h2>

                  {currentQuestion.helperText && (
                    <p className="text-sm sm:text-base text-[#4F6B85] mt-2">
                      {currentQuestion.helperText}
                    </p>
                  )}
                </div>

                {/* Lista de Opciones */}
                <div className="grid grid-cols-1 gap-3.5 mb-8">
                  {currentOptions.map((option, idx) => (
                    <ChoiceCard
                      key={option.id}
                      option={option}
                      index={idx}
                      isSelected={selectedOption === option.id}
                      onSelect={() => handleSelectOption(option.id)}
                    />
                  ))}
                </div>

                {/* Footer de Navegación */}
                <div className="flex items-center justify-between pt-6 border-t border-[#EAF2F8]">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 h-[46px] px-5 rounded-xl border border-[#D6E5EF] bg-white text-[#4F6B85] hover:text-[#082A4A] hover:bg-[#F8FCFF] font-semibold text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={selectedOption === null}
                    className="flex items-center gap-2.5 h-[48px] px-8 bg-gradient-to-r from-[#00C2E0] to-[#0EA5C6] hover:from-[#0EA5C6] hover:to-[#0284C7] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base shadow-sm hover:shadow transition-all active:scale-98"
                  >
                    <span>
                      {currentStep === questions.length - 1 ? 'Finalizar y analizar' : 'Siguiente'}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
