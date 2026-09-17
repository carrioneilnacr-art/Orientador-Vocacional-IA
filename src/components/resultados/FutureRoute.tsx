import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Building2, Award, Briefcase } from 'lucide-react';

export function FutureRoute() {
  const steps = [
    { icon: User, title: 'Tú', desc: 'Intereses', color: 'text-[#08BBD5]', bg: 'bg-[#F0FBFD]', border: 'border-[#08BBD5]' },
    { icon: GraduationCap, title: 'Carrera', desc: 'Opciones', color: 'text-[#08BBD5]', bg: 'bg-white', border: 'border-[#D9EAF2]' },
    { icon: Building2, title: 'Universidad', desc: 'Explora', color: 'text-[#08BBD5]', bg: 'bg-white', border: 'border-[#D9EAF2]' },
    { icon: Award, title: 'Especialización', desc: 'Potencia', color: 'text-[#08BBD5]', bg: 'bg-white', border: 'border-[#D9EAF2]' },
    { icon: Briefcase, title: 'Campo laboral', desc: 'Contribuye', color: 'text-[#18A86B]', bg: 'bg-[#E8F8F1]', border: 'border-[#18A86B]' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="pt-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D4D] mb-1.5">Tu ruta hacia el futuro</h2>
        <p className="text-[#466579] text-[15px]">Desde tus intereses hasta tus metas profesionales.</p>
      </div>

      <div className="bg-white rounded-[28px] border border-[#D9EAF2] p-8 lg:p-12 shadow-[0_10px_40px_rgba(11,45,77,0.06)] relative overflow-hidden">
        {/* Decorative subtle points */}
        <div className="absolute top-4 right-4 flex gap-1 opacity-20">
          <div className="w-1.5 h-1.5 rounded-full bg-[#08BBD5]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#08BBD5]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#08BBD5]"></div>
        </div>

        {/* Desktop Timeline line */}
        <div className="hidden md:block absolute top-[85px] left-[10%] right-[10%] h-[2px] bg-[#D9EAF2] z-0"></div>
        {/* Mobile Timeline line */}
        <div className="md:hidden absolute top-[40px] bottom-[40px] left-[43px] w-[2px] bg-[#D9EAF2] z-0"></div>

        <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-row md:flex-col items-center md:items-center gap-5 md:gap-3 flex-1">
              <div className={`w-14 h-14 rounded-2xl border-2 ${step.border} ${step.bg} flex items-center justify-center shrink-0 z-10 shadow-sm`}>
                <step.icon className={`w-6 h-6 ${step.color}`} strokeWidth={2.5} />
              </div>
              <div className="text-left md:text-center">
                <h4 className="font-bold text-[#0B2D4D] text-[15px]">{step.title}</h4>
                <p className="text-[#466579] text-[11px] font-bold uppercase tracking-wider mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
