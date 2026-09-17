import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, Circle, Map, ArrowRight, ArrowLeft } from 'lucide-react';

interface MissionProgressProps {
  completedMission: number;
  onContinue: () => void;
  onBack?: () => void;
}

export function MissionProgress({ completedMission, onContinue, onBack }: MissionProgressProps) {
  const isFinal = completedMission === 4;

  const missions = [
    { num: 1, title: 'Lo que te atrae' },
    { num: 2, title: 'Cómo resuelves' },
    { num: 3, title: 'Cómo actúas' },
    { num: 4, title: 'Tu futuro' },
  ];

  const getMessage = (cm: number) => {
    switch(cm) {
      case 1:
        return {
          title: "¡Buen comienzo!",
          desc: "Ya estamos descubriendo qué despierta tu curiosidad."
        };
      case 2:
        return {
          title: "¡Vas muy bien!",
          desc: "Cada respuesta nos da una nueva pista sobre ti."
        };
      case 3:
        return {
          title: "¡Ya tenemos muchas pistas!",
          desc: "Ahora estamos descubriendo cómo te gusta actuar."
        };
      case 4:
        return {
          title: "¡Aventura completada!",
          desc: "Es hora de descubrir qué camino podría encajar contigo."
        };
      default:
        return {
          title: "¡Tu aventura avanza!",
          desc: "Cada decisión te acerca más a tu futuro."
        };
    }
  };

  const msg = getMessage(completedMission);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-[820px] mx-auto"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-[#D9EAF2] bg-white shadow-[0_10px_40px_rgba(11,45,77,0.04)] p-6 sm:p-10">
        
        {/* Decorative background elements (Map route) */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg width="100%" height="100%" className="absolute inset-0">
             <path d="M-50 150 Q 200 50, 400 250 T 900 150" fill="none" stroke="#08BBD5" strokeWidth="3" strokeDasharray="8 8"/>
             <circle cx="400" cy="250" r="6" fill="#18A86B" />
             <circle cx="900" cy="150" r="6" fill="#18A86B" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center sm:items-start mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F7FB] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#08AFC8] mb-3">
            <Map size={13} />
            PROGRESO POR MISIONES
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D4D]">
            Tu aventura avanza
          </h2>
          <p className="mt-1 text-sm text-[#42627D]">
            Cada decisión te acerca más a tu futuro.
          </p>
        </div>

        {/* Missions Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-4 gap-3 mb-10">
          {missions.map((m, index) => {
            const isCompleted = m.num <= completedMission;
            const isCurrent = m.num === completedMission + 1;
            const isFuture = m.num > completedMission + 1;

            let cardClasses = "";
            let iconClasses = "";
            let IconComp = Circle;
            let counter = "0/4";

            if (isCompleted) {
              cardClasses = "bg-[#E8F8F1] border-[#B8E5D0]";
              iconClasses = "text-[#18A86B]";
              IconComp = CheckCircle;
              counter = "4/4";
            } else if (isCurrent) {
              cardClasses = "bg-[#F0FBFD] border-[#A8E5EE] ring-2 ring-cyan-200 ring-offset-1";
              iconClasses = "text-[#08BBD5]";
              IconComp = Circle;
              counter = "0/4";
            } else {
              cardClasses = "bg-[#F8FCFE] border-[#D8E8F0]";
              iconClasses = "text-[#C8DCE6]";
              IconComp = Circle;
              counter = "0/4";
            }

            return (
              <motion.div
                key={m.num}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                className={`flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-2 p-4 rounded-2xl border transition-all ${cardClasses}`}
              >
                <div className="flex sm:w-full items-center justify-between gap-2">
                  <IconComp className={`w-6 h-6 sm:w-5 sm:h-5 ${iconClasses}`} strokeWidth={2.5} />
                  <span className="hidden sm:inline-block text-xs font-bold text-[#6A8AA3]">
                    {counter}
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col items-start text-left sm:mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A8AA3]">
                    Misión 0{m.num}
                  </span>
                  <span className="text-sm sm:text-xs font-bold text-[#0B2D4D] leading-tight mt-0.5">
                    {m.title}
                  </span>
                </div>
                
                <span className="sm:hidden text-xs font-bold text-[#6A8AA3]">
                  {counter}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Chaski Message */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 bg-[#F8FCFE] rounded-2xl p-6 border border-[#D9EAF2] mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="shrink-0 drop-shadow-md"
          >
            <Image
              src="/assets/misiones.png"
              alt="Chaski"
              width={100}
              height={100}
              className="object-contain w-[90px] h-[90px]"
            />
          </motion.div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-[#0B2D4D] mb-1">{msg.title}</h3>
            <p className="text-sm text-[#42627D] leading-relaxed">{msg.desc}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="relative z-10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E1EDF3]">
          {onBack && !isFinal ? (
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#D6E5EF] bg-white text-[#4F6B85] hover:text-[#0B2D4D] hover:bg-[#F8FCFF] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div></div> // Spacer to keep layout balanced
          )}

          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-8 py-4 bg-[#08BBD5] hover:bg-[#07AFC8] text-white font-bold text-base rounded-xl shadow-[0_6px_15px_rgba(8,187,213,0.15)] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(8,187,213,0.2)] transition-all flex items-center justify-center gap-2.5"
          >
            <span>{isFinal ? 'Descubrir mi perfil' : 'Siguiente'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
