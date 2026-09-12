'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Compass, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { MISSIONS_CONFIG } from '@/data/questionnaireData';

interface AdventureIntroProps {
  onStart: () => void;
}

export function AdventureIntro({ onStart }: AdventureIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-[820px] bg-white rounded-[28px] shadow-sm border border-[#D6E5EF] p-6 sm:p-12 font-sans"
    >
      {/* Header section with Chaski */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pb-8 border-b border-[#EAF2F8]">
        <motion.div
          animate={{ y: [-4, 5, -4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 drop-shadow-md"
        >
          <Image
            src="/assets/analizando_perfil.png"
            alt="Chaski el orientador vocacional"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6FF] text-[#00C2E0] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Aventura Vocacional</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#082A4A] tracking-tight">
            Descubre tu camino con Chaski
          </h1>

          <p className="text-sm sm:text-base text-[#4F6B85] max-w-xl leading-relaxed">
            No es un examen ni un cuestionario tradicional. Vivirás una travesía de{' '}
            <strong className="text-[#082A4A]">16 decisiones</strong> para encontrar los patrones de
            tus intereses y sugerirte carreras compatibles de la UPC.
          </p>
        </div>
      </div>

      {/* 4 Missions Preview Grid */}
      <div className="py-8">
        <h2 className="text-xs font-bold text-[#829AB1] uppercase tracking-wider mb-4 text-center sm:text-left">
          Tu ruta de 4 misiones:
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {MISSIONS_CONFIG.map((mission) => (
            <div
              key={mission.number}
              className="p-4 rounded-2xl bg-[#F8FCFF] border border-[#DCEAF2] hover:border-[#00C2E0]/50 transition-colors flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D6E5EF] flex items-center justify-center text-xl flex-shrink-0 shadow-2xs">
                {mission.icon}
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[#00C2E0] uppercase tracking-wider">
                  Misión 0{mission.number}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#082A4A]">
                  {mission.subtitle}
                </h3>
                <p className="text-xs text-[#4F6B85] leading-snug line-clamp-1">
                  {mission.title === 'Misión 01' && 'Tus pasiones espontáneas y curiosidad natural'}
                  {mission.title === 'Misión 02' && 'Cómo enfrentas problemas y tomas decisiones'}
                  {mission.title === 'Misión 03' && 'Tu estilo en equipo y roles de impacto'}
                  {mission.title === 'Misión 04' && 'Proyección de ambientes y metas futuras'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meta perks & CTA */}
      <div className="pt-6 border-t border-[#EAF2F8] flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-[#4F6B85]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#00C2E0]" /> ~3–5 minutos
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sin respuestas correctas
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> 8 dimensiones evaluadas
          </span>
        </div>

        <button
          onClick={onStart}
          className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 bg-[#00C2E0] hover:bg-[#0EA5C6] text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-98"
        >
          <span>Comenzar aventura</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </motion.div>
  );
}
