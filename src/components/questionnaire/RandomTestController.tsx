'use client';

import React, { useState, useEffect } from 'react';
import { Shuffle, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import type { QuestionItem, OptionItem } from '@/data/questionnaireData';
import { RandomAnswersModal } from './RandomAnswersModal';

interface RandomTestControllerProps {
  questions: QuestionItem[];
  options: OptionItem[];
  currentQuestion: QuestionItem | null;
  onSelectOption: (optionId: number) => void;
  onAutoSubmitAllRandom: (randomAnswers: Record<number, number>) => void;
  onAdvanceToNext?: () => void;
}

export function RandomTestController({
  questions,
  options,
  currentQuestion,
  onSelectOption,
  onAutoSubmitAllRandom,
  onAdvanceToNext,
}: RandomTestControllerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [randomAnswersPreview, setRandomAnswersPreview] = useState<Record<number, number>>({});

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // Helper para generar 16 respuestas al azar
  const generateRandomSet = (): Record<number, number> => {
    const randomAnswers: Record<number, number> = {};
    for (const q of questions) {
      const qOpts = options.filter((o) => o.questionId === q.id);
      if (qOpts.length > 0) {
        const randOpt = qOpts[Math.floor(Math.random() * qOpts.length)];
        randomAnswers[q.id] = randOpt.id;
      }
    }
    return randomAnswers;
  };

  // Responder la pregunta actual al azar
  const handleRandomCurrent = () => {
    if (!currentQuestion) return;
    const currentOpts = options.filter((o) => o.questionId === currentQuestion.id);
    if (currentOpts.length === 0) return;

    const randomIndex = Math.floor(Math.random() * currentOpts.length);
    const chosen = currentOpts[randomIndex];
    onSelectOption(chosen.id);
    showToast(`🎲 Pregunta ${currentQuestion.orderNumber}: "${chosen.optionText.slice(0, 30)}..."`);

    if (onAdvanceToNext) {
      setTimeout(() => {
        onAdvanceToNext();
      }, 250);
    }
  };

  // Abrir modal de solo lectura con las 16 respuestas marcadas al azar
  const handleCompleteAllRandom = () => {
    if (questions.length === 0 || options.length === 0) return;
    const generated = generateRandomSet();
    setRandomAnswersPreview(generated);
    setIsModalOpen(true);
  };

  // Regenerar otro set al azar dentro del modal
  const handleRegenerateInModal = () => {
    const regenerated = generateRandomSet();
    setRandomAnswersPreview(regenerated);
    showToast('🎲 Nuevo conjunto de 16 respuestas generado.');
  };

  // Confirmar y procesar resultados desde el modal
  const handleConfirmSubmit = () => {
    setIsModalOpen(false);
    showToast('⚡ Calculando ADN Vocacional con las respuestas marcadas...');
    onAutoSubmitAllRandom(randomAnswersPreview);
  };

  // Atajos de teclado: Alt + R (actual al azar), Alt + Shift + R (todo al azar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        handleCompleteAllRandom();
      } else if (e.altKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        handleRandomCurrent();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <>
      <RandomAnswersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        questions={questions}
        options={options}
        selectedAnswers={randomAnswersPreview}
        onRegenerate={handleRegenerateInModal}
        onConfirm={handleConfirmSubmit}
      />

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 font-sans select-none">
        {notification && (
          <div className="px-4 py-2 bg-[#082A4A] text-white text-xs rounded-lg shadow-lg border border-[#00C2E0]/40 animate-fade-in flex items-center gap-2">
            <span>{notification}</span>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#D6E5EF] p-2.5 sm:p-3 transition-all">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider text-[#082A4A] uppercase">
                Modo Pruebas / QA
              </span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-[#4F6B85] hover:text-[#082A4A] p-0.5 rounded transition-colors"
              title={isCollapsed ? 'Expandir panel de pruebas' : 'Minimizar panel'}
            >
              {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 pt-2 border-t border-[#EAF2F8]">
              <button
                onClick={handleRandomCurrent}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#F0F8FF] hover:bg-[#E0F2FE] text-[#0369A1] hover:text-[#0284C7] rounded-xl text-xs font-semibold border border-[#BAE6FD] transition-all shadow-sm active:scale-95"
                title="Elige una opción al azar para la pregunta actual (Atajo: Alt + R)"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Esta al azar</span>
                <kbd className="hidden sm:inline text-[10px] opacity-70 bg-white px-1 py-0.5 rounded border border-[#BAE6FD]">
                  Alt+R
                </kbd>
              </button>

              <button
                onClick={handleCompleteAllRandom}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#00C2E0] to-[#0EA5C6] hover:from-[#0EA5C6] hover:to-[#0284C7] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                title="Responde las 16 preguntas al azar y muestra el visor de solo lectura (Atajo: Alt + Shift + R)"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Completar todo al azar</span>
                <kbd className="hidden sm:inline text-[10px] opacity-80 bg-black/20 px-1 py-0.5 rounded">
                  Alt+⇧+R
                </kbd>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

