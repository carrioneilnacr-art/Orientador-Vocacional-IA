'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MISSIONS_CONFIG, type MissionInfo } from '@/data/questionnaireData';

interface MissionInterludeProps {
  completedMissionNumber: number;
  onContinue: () => void;
}

export function MissionInterlude({ completedMissionNumber, onContinue }: MissionInterludeProps) {
  const completedMission =
    MISSIONS_CONFIG.find((m) => m.number === completedMissionNumber) || MISSIONS_CONFIG[0];
  const nextMission = MISSIONS_CONFIG.find((m) => m.number === completedMissionNumber + 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[680px] bg-white rounded-[24px] shadow-lg border border-[#D6E5EF] p-8 sm:p-12 text-center flex flex-col items-center"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF6FF] text-[#00C2E0] border border-[#BAE6FD] text-xs sm:text-sm font-bold tracking-wide uppercase mb-6">
        <Sparkles className="w-4 h-4" />
        <span>¡{completedMission.title} superada!</span>
      </div>

      {/* Chaski avatar illustration */}
      <motion.div
        animate={{ y: [-4, 6, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 drop-shadow-md"
      >
        <Image
          src="/assets/analizando_perfil.png"
          alt="Chaski celebrando avance"
          fill
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Mission title & commentary */}
      <h3 className="text-2xl sm:text-3xl font-bold text-[#082A4A] mb-3">
        {completedMission.subtitle} lograda
      </h3>

      <div className="bg-[#F8FCFF] border border-[#E2EDF4] rounded-2xl p-5 mb-8 max-w-lg">
        <p className="text-[#334E68] text-base leading-relaxed italic">
          "{completedMission.chaskiCompletedMessage}"
        </p>
        <span className="block mt-2 text-xs font-bold text-[#00C2E0] tracking-wider uppercase">
          — Chaski
        </span>
      </div>

      {/* Next mission teaser */}
      {nextMission && (
        <div className="mb-8 text-sm text-[#4F6B85] flex items-center gap-2">
          <span>Siguiente parada:</span>
          <span className="font-bold text-[#082A4A] bg-[#F0F5F9] px-2.5 py-1 rounded-lg">
            {nextMission.icon} {nextMission.title}: {nextMission.subtitle}
          </span>
        </div>
      )}

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#00C2E0] to-[#0EA5C6] hover:from-[#0EA5C6] hover:to-[#0284C7] text-white rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-98"
      >
        <span>Continuar aventura</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </motion.div>
  );
}
