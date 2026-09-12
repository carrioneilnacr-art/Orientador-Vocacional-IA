'use client';

import React from 'react';
import { Eye, CheckCircle2, Shuffle, ArrowRight, X, Lock } from 'lucide-react';
import type { QuestionItem, OptionItem } from '@/data/questionnaireData';

interface RandomAnswersModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionItem[];
  options: OptionItem[];
  selectedAnswers: Record<number, number>;
  onRegenerate: () => void;
  onConfirm: () => void;
}

export function RandomAnswersModal({
  isOpen,
  onClose,
  questions,
  options,
  selectedAnswers,
  onRegenerate,
  onConfirm,
}: RandomAnswersModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#082A4A]/60 backdrop-blur-sm animate-fade-in font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="random-answers-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-[#D6E5EF] max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EAF2F8] flex items-center justify-between bg-[#F8FCFF]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                <Lock className="w-3 h-3 text-amber-600" />
                Solo Lectura — No editable
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00C2E0]/15 text-[#0369A1]">
                <Eye className="w-3 h-3 text-[#00C2E0]" />
                16 Respuestas Marcadas
              </span>
            </div>
            <h2 id="random-answers-title" className="text-xl sm:text-2xl font-bold text-[#082A4A]">
              Respuestas Generadas al Azar
            </h2>
            <p className="text-xs sm:text-sm text-[#4F6B85] mt-0.5">
              Revisa las opciones seleccionadas antes de calcular el ADN Vocacional. No se pueden modificar en esta vista.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#4F6B85] hover:text-[#082A4A] hover:bg-[#EAF2F8] rounded-xl transition-colors"
            title="Cerrar ventana"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Questions List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 divide-y divide-[#EAF2F8]">
          {questions.map((q) => {
            const chosenOptionId = selectedAnswers[q.id];
            const qOptions = options.filter((o) => o.questionId === q.id);

            return (
              <div key={q.id} className={q.orderNumber > 1 ? 'pt-5' : ''}>
                {/* Question Info */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F0F5F9] text-[#0369A1] uppercase">
                    Decisión #{q.orderNumber}
                  </span>
                  <span className="text-xs text-[#4F6B85]">
                    {q.missionTitle}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#082A4A] mb-3">
                  {q.questionText}
                </h3>

                {/* Options List (Read-Only) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {qOptions.map((opt) => {
                    const isChosen = opt.id === chosenOptionId;

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 transition-all select-none cursor-default ${
                          isChosen
                            ? 'bg-[#00C2E0]/10 border-2 border-[#00C2E0] text-[#082A4A] shadow-sm font-medium'
                            : 'bg-[#F8FCFF] border border-[#EAF2F8] text-gray-400 opacity-60'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChosen ? (
                            <CheckCircle2 className="w-4 h-4 text-[#00C2E0]" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 leading-snug">
                          <span>{opt.optionText}</span>
                          {isChosen && (
                            <span className="block mt-1 text-[10px] font-bold text-[#00C2E0] uppercase tracking-wide">
                              ✓ Seleccionada al azar
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#EAF2F8] bg-[#F8FCFF] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRegenerate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#BAE6FD] bg-[#F0F8FF] hover:bg-[#E0F2FE] text-[#0369A1] font-semibold text-xs transition-colors active:scale-98"
          >
            <Shuffle className="w-4 h-4" />
            <span>Generar otras respuestas al azar</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2.5 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#D6E5EF] bg-white text-[#4F6B85] hover:text-[#082A4A] hover:bg-gray-50 font-semibold text-xs transition-colors"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C2E0] to-[#0EA5C6] hover:from-[#0EA5C6] hover:to-[#0284C7] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <span>Continuar a Resultados con estas respuestas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
