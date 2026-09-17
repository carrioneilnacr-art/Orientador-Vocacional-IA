import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Compass, Puzzle, Handshake, Rocket, Sparkles, ArrowRight } from 'lucide-react';
import { MissionCard } from './MissionCard';
import { TestIntroStats } from './TestIntroStats';

interface TestIntroProps {
  onStart: () => void;
}

export function TestIntro({ onStart }: TestIntroProps) {
  return (
    <div 
      className="absolute inset-0 w-full min-h-[100vh] bg-[#F5FAFD] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center z-10 overflow-y-auto"
      style={{
        background: `radial-gradient(circle at 15% 15%, rgba(8,187,213,0.06), transparent 30%), radial-gradient(circle at 85% 85%, rgba(24,168,107,0.04), transparent 25%), #F5FAFD`
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto w-full max-w-[1080px] my-auto"
      >
        <div className="overflow-hidden rounded-[28px] border border-[#D9EAF2] bg-white shadow-[0_10px_40px_rgba(11,45,77,0.08)]">
          <div className="p-6 sm:p-10 lg:p-10">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex justify-center lg:justify-start shrink-0"
              >
                <Image
                  src="/assets/analizando_perfil.png"
                  alt="Chaski"
                  width={160}
                  height={160}
                  className="object-contain w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] lg:w-[160px] lg:h-[160px]"
                  priority
                />
              </motion.div>

              <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F7FB] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#08AFC8] mb-4">
                  <Sparkles size={13} />
                  AVENTURA VOCACIONAL
                </div>
                
                <h1 className="text-3xl font-extrabold leading-tight tracking-[-0.03em] text-[#0B2D4D] sm:text-4xl lg:text-[42px]">
                  Descubre tu camino con Chaski
                </h1>
                
                <p className="mt-3 max-w-[650px] text-[15px] leading-7 text-[#42627D] sm:text-base">
                  No es un examen ni un cuestionario tradicional. Vivirás una travesía de <strong className="font-bold text-[#0B2D4D]">16 decisiones</strong> para encontrar los patrones de tus intereses y sugerirte carreras compatibles en las principales universidades del país.
                </p>
              </div>
            </div>

            <div className="my-7 h-px bg-[#E1EDF3]" />

            {/* Missions */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-[#6A8AA3] text-center lg:text-left">
                Tu ruta de 4 misiones
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MissionCard
                  number="01"
                  title="Lo que te atrae"
                  description="Tus pasiones espontáneas y curiosidad natural"
                  icon={Compass}
                  delay={0.05}
                />
                <MissionCard
                  number="02"
                  title="Cómo resuelves"
                  description="Tu forma de enfrentar problemas"
                  icon={Puzzle}
                  delay={0.10}
                />
                <MissionCard
                  number="03"
                  title="Cómo actúas"
                  description="Tu estilo en equipo y roles de impacto"
                  icon={Handshake}
                  iconColorClass="text-[#18A86B]"
                  delay={0.15}
                />
                <MissionCard
                  number="04"
                  title="Tu futuro"
                  description="Proyección de ambientes y metas"
                  icon={Rocket}
                  delay={0.20}
                />
              </div>
            </div>

            <div className="my-7 h-px bg-[#E1EDF3]" />

            {/* Footer & CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <TestIntroStats />

              <button
                onClick={onStart}
                className="inline-flex min-h-[76px] w-full sm:w-auto min-w-[235px] items-center justify-center gap-3 rounded-2xl bg-[#08BBD5] px-8 py-4 text-base font-bold text-white shadow-[0_10px_25px_rgba(8,187,213,0.20)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#07AFC8] hover:shadow-[0_14px_30px_rgba(8,187,213,0.25)]"
              >
                <span className="text-center sm:text-left">
                  Comenzar<br className="hidden sm:block" /> aventura
                </span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
