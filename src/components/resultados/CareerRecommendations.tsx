import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Monitor } from 'lucide-react';
import Link from 'next/link';
import type { CareerResult } from '@/types/vocacional';

interface CareerRecommendationsProps {
  careers: CareerResult[];
}

export function CareerRecommendations({ careers }: CareerRecommendationsProps) {
  const topCareers = careers.slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      id="carreras" 
      className="scroll-mt-24 pt-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D4D] mb-1.5">
          Carreras que podrían encajar contigo
        </h2>
        <p className="text-[#466579] text-[15px]">
          Basadas en los patrones identificados en tus respuestas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topCareers.map((career) => (
          <div key={career.id} className="bg-white rounded-[28px] border border-[#D9EAF2] p-6 shadow-[0_10px_40px_rgba(11,45,77,0.06)] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div>
              <div className="w-12 h-12 bg-[#F5FAFD] border border-[#D9EAF2] rounded-xl flex items-center justify-center mb-5">
                <Monitor className="w-6 h-6 text-[#08BBD5]" />
              </div>
              
              <h3 className="text-lg font-bold text-[#0B2D4D] mb-4 leading-tight min-h-[50px]">
                {career.name}
              </h3>
              
              <div className="mb-2">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#466579]">{career.match}% compatibilidad</span>
                </div>
                <div className="w-full bg-[#F5FAFD] h-[6px] rounded-full overflow-hidden">
                  <div className="bg-[#08BBD5] h-full rounded-full transition-all duration-1000" style={{ width: `${career.match}%` }} />
                </div>
              </div>
            </div>
            
            <Link 
              href={`/carreras/${career.slug}`}
              className="mt-6 flex items-center gap-2 text-[13px] font-bold text-[#08BBD5] hover:text-[#07AFC8] transition-colors group"
            >
              <span>Ver detalles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
      
      {careers.length > 3 && (
        <div className="mt-8 text-center">
           <Link href="/carreras" className="inline-flex items-center justify-center px-6 py-3 border border-[#D9EAF2] rounded-[14px] bg-white text-[#0B2D4D] font-bold text-sm hover:bg-[#F5FAFD] transition-colors shadow-sm">
             Ver todas las carreras recomendadas
           </Link>
        </div>
      )}
    </motion.div>
  );
}
