import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Building, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function NextSteps() {
  const steps = [
    { icon: Compass, title: 'Explora más carreras', desc: 'Descubre otras opciones compatibles', link: '/carreras' },
    { icon: Building, title: 'Compara universidades', desc: 'Analiza diferencias', link: '/universidades' },
    { icon: TrendingUp, title: 'Conoce el mercado', desc: 'Revisa demanda y oportunidades', link: '/carreras' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D4D] mb-1.5">Ahora que conoces tu perfil...</h2>
        <p className="text-[#466579] text-[15px]">Da el siguiente paso y sigue explorando tu futuro profesional.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((item, idx) => (
          <div key={idx} className="bg-white rounded-[24px] border border-[#D9EAF2] p-6 shadow-[0_10px_40px_rgba(11,45,77,0.06)] flex flex-col h-full hover:border-[#08BBD5] transition-colors">
            <div className="w-12 h-12 bg-[#F5FAFD] rounded-xl flex items-center justify-center mb-5">
               <item.icon className="w-6 h-6 text-[#0B2D4D]" />
            </div>
            <h3 className="font-bold text-[#0B2D4D] text-[15px] mb-2">{item.title}</h3>
            <p className="text-[13.5px] text-[#466579] mb-6 flex-1">{item.desc}</p>
            <Link href={item.link} className="inline-flex items-center gap-2 text-[13px] font-bold text-[#08BBD5] hover:text-[#07AFC8] transition-colors group">
              <span>Explorar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
