import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Briefcase, TrendingUp } from 'lucide-react';
import type { CareerResult } from '@/types/vocacional';
import Link from 'next/link';

interface DecisionInsightsProps {
  career?: CareerResult;
}

export function DecisionInsights({ career }: DecisionInsightsProps) {
  if (!career) return null;

  const insights = [
    { icon: BookOpen, title: 'Plan de estudios', desc: '¿Qué aprenderás?', slug: 'plan-de-estudios' },
    { icon: Briefcase, title: 'Campo laboral', desc: '¿Dónde trabajar?', slug: 'campo-laboral' },
    { icon: TrendingUp, title: 'Mercado laboral', desc: '¿Qué demanda existe?', slug: 'mercado' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="pt-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D4D] mb-1.5">
          Tu información para decidir
        </h2>
        <p className="text-[#466579] text-[15px]">
          Conoce más detalles sobre tu principal opción: <span className="font-bold text-[#0B2D4D]">{career.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((item, idx) => (
          <Link href={`/carreras/${career.slug}#${item.slug}`} key={idx} className="bg-white rounded-[24px] border border-[#D9EAF2] p-6 shadow-[0_10px_40px_rgba(11,45,77,0.06)] flex items-start gap-4 hover:border-[#08BBD5] transition-colors group">
            <div className="w-12 h-12 bg-[#F5FAFD] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#E8F7FB] transition-colors">
              <item.icon className="w-6 h-6 text-[#08BBD5]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0B2D4D] mb-1 text-[15px]">{item.title}</h3>
              <p className="text-sm text-[#466579]">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
