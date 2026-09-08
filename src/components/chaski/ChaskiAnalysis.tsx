'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ChaskiAnalysisProps {
  message?: string;
}

export const ChaskiAnalysis = ({ 
  message = "Estamos conectando tus respuestas con perfiles de carrera, habilidades y oportunidades reales para ti." 
}: ChaskiAnalysisProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent w-full p-4 font-sans selection:bg-[#00C2E0] selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-8 w-full max-w-2xl bg-white p-10 md:p-16 rounded-[20px] shadow-sm border border-[#D6E5EF]"
      >
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-48 h-48 drop-shadow-lg"
        >
          <Image 
            src="/assets/analizando_perfil.png" 
            alt="IA Meditando y analizando perfil" 
            fill 
            className="object-contain"
            priority
          />
        </motion.div>
        
        <div className="space-y-4 max-w-md text-center">
          <motion.h2 
            className="text-[32px] font-bold text-[#082A4A]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Analizando tu perfil...
          </motion.h2>
          
          <p className="text-[16px] text-[#4F6B85] font-normal leading-relaxed">
            {message}
          </p>
        </div>

        {/* Progress bar simulation */}
        <div className="w-full max-w-md bg-[#DCEAF2] rounded-full h-[12px] md:h-[16px] mt-4 overflow-hidden shadow-inner">
          <motion.div 
            className="bg-[#00C2E0] h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "easeInOut" }}
          />
        </div>
        
        <p className="text-[14px] text-[#4F6B85] mt-2 font-medium">
          Esto solo tomará unos segundos...
        </p>
      </motion.div>
    </div>
  );
};

