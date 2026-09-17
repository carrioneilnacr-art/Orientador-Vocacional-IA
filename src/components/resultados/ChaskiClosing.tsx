import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function ChaskiClosing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      className="pt-10 pb-8"
    >
      <div className="bg-[#E8F7FB] rounded-[28px] border border-[#D9EAF2] p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-center relative overflow-hidden">
        {/* Subtle Andean mountain background or dots */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#08BBD5 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left max-w-[400px]">
          <p className="text-[22px] sm:text-[26px] font-bold text-[#0B2D4D] leading-tight mb-4">
            "Un mejor mañana empieza con una buena decisión."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-[2px] bg-[#08BBD5]"></div>
            <span className="font-bold text-[#466579] uppercase tracking-wider text-xs">Chaski</span>
          </div>
        </div>
        
        <div className="relative z-10 w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] shrink-0">
          <Image
            src="/assets/chaski-hero.png" // using chaski-hero for the mountain background or just the avatar
            alt="Chaski final"
            fill
            className="object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </motion.div>
  );
}
