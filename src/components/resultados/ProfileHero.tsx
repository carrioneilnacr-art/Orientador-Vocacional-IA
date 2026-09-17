import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS } from '@/constants/dimensions';

interface ProfileHeroProps {
  profileName: string;
  dimensionScores: Record<string, number>;
}

export function ProfileHero({ profileName, dimensionScores }: ProfileHeroProps) {
  const topDimEntry = Object.entries(dimensionScores ?? {})
    .sort(([, a], [, b]) => (b as number) - (a as number))[0];
  const topDimKey = topDimEntry?.[0] || "LOGIC";
  const profileDescription = DIMENSION_DESCRIPTIONS[topDimKey] || 
    "Tu curiosidad por la tecnología, la innovación y la resolución de problemas destaca en tus respuestas.";

  const dimensions = Object.entries(dimensionScores)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Profile Card */}
      <div className="bg-white rounded-[28px] border border-[#D9EAF2] p-8 shadow-[0_10px_40px_rgba(11,45,77,0.06)] flex flex-col justify-between">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#08BBD5] mb-4">Tu perfil vocacional</h2>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B2D4D] capitalize">{profileName}</h1>
            <div className="w-12 h-12 rounded-xl bg-[#E8F7FB] flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-[#08BBD5]" />
            </div>
          </div>
          <p className="text-[#466579] text-[15px] leading-relaxed max-w-[95%]">
            {profileDescription}
          </p>
        </div>
        <div className="mt-8 pt-6 border-t border-[#D9EAF2]">
           <a href="#carreras" className="text-[#08BBD5] font-bold text-[13.5px] hover:underline flex items-center gap-2">
             Ver carreras recomendadas ↓
           </a>
        </div>
      </div>

      {/* Dimensions Card */}
      <div className="bg-white rounded-[28px] border border-[#D9EAF2] p-8 shadow-[0_10px_40px_rgba(11,45,77,0.06)]">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#08BBD5] mb-6">Tus dimensiones</h2>
        <div className="space-y-5">
          {dimensions.map(([dim, score], index) => {
            const isPrimary = index === 0;
            const barColor = isPrimary ? 'bg-[#18A86B]' : 'bg-[#08BBD5]';
            const bgColor = isPrimary ? 'bg-[#E8F8F1]' : 'bg-[#E8F7FB]';

            return (
              <div key={dim}>
                <div className="flex justify-between text-[13px] font-bold mb-2">
                  <span className="text-[#0B2D4D]">{DIMENSION_LABELS[dim] ?? dim}</span>
                  <span className={isPrimary ? 'text-[#18A86B]' : 'text-[#08BBD5]'}>{score}%</span>
                </div>
                <div className={`w-full ${bgColor} h-[8px] rounded-full overflow-hidden`}>
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-1000`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
