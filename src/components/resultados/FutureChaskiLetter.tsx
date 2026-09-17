import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Star } from 'lucide-react';
import Image from 'next/image';

interface FutureChaskiLetterProps {
  profileName: string;
}

export default function FutureChaskiLetter({ profileName }: FutureChaskiLetterProps) {
  // Generar título de "superpoder" basado en el perfil
  const getSuperpower = (profile: string) => {
    const p = profile.toLowerCase();
    if (p.includes('tech') || p.includes('tecnológic')) return 'El Arquitecto del Futuro Digital';
    if (p.includes('lógic') || p.includes('logic')) return 'El Estratega de Soluciones Infallibles';
    if (p.includes('artístic') || p.includes('artistic')) return 'El Creador de Experiencias Inolvidables';
    if (p.includes('investigativ') || p.includes('investigative')) return 'El Descubridor de Verdades Ocultas';
    if (p.includes('social')) return 'El Transformador de Vidas';
    if (p.includes('emprendedor') || p.includes('enterprising')) return 'El Líder de la Próxima Revolución';
    return 'El Visionario de Nuevos Caminos';
  };

  const superpower = getSuperpower(profileName);

  return (
    <section className="w-full mb-16 mt-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="relative max-w-4xl mx-auto rounded-[32px] overflow-hidden p-1 shadow-2xl"
      >
        {/* Borde animado brillante */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00C2E0] via-[#F4C95D] to-[#18A86B] animate-[spin_4s_linear_infinite] opacity-50" />
        
        {/* Contenedor principal estilo Glassmorphism */}
        <div className="relative bg-[#082A4A]/95 backdrop-blur-xl rounded-[30px] p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          {/* Fondo estelar */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse" />
            <div className="absolute top-20 right-20 w-3 h-3 bg-[#00C2E0] rounded-full animate-pulse delay-75" />
            <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-[#F4C95D] rounded-full animate-pulse delay-150" />
          </div>

          <div className="w-full md:w-1/3 flex justify-center relative">
            <div className="absolute inset-0 bg-[#00C2E0] blur-[80px] rounded-full opacity-30 animate-pulse" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-48 h-48 md:w-64 md:h-64 z-10"
            >
              <Image 
                src="/assets/chaski/chaski-12.png" 
                alt="Chaski del Futuro" 
                fill 
                className="object-contain drop-shadow-[0_0_15px_rgba(0,194,224,0.5)]" 
              />
            </motion.div>
          </div>

          <div className="w-full md:w-2/3 text-white z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-xs font-bold text-[#F4C95D] uppercase tracking-widest mb-4">
              <Zap className="w-3.5 h-3.5" /> Mensaje Holográfico Entrante
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Una carta desde tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2E0] to-[#4ECDC4]">futuro</span>...
            </h2>
            
            <div className="space-y-4 text-[#A2C0D9] text-sm md:text-base leading-relaxed relative">
              <Sparkles className="absolute -left-6 top-1 w-4 h-4 text-[#00C2E0] opacity-50" />
              <p>
                "¡Hola! Soy Chaski, pero te hablo desde dentro de 5 años. Acabo de ver en lo que te has convertido y no podía esperar para decírtelo: <strong>tomaste la decisión correcta</strong>."
              </p>
              <p>
                Apostaste por tu perfil <strong className="text-white">{profileName}</strong> cuando nadie más veía lo que tú veías. Hoy en día, todos te conocen como <strong className="text-[#F4C95D] px-1">"{superpower}"</strong>. 
              </p>
              <p>
                No fue un camino fácil, hubieron amanecidas y dudas, pero hoy trabajas en lo que te apasiona, transformando ideas en realidad y destacando en tu campo. Sigue tu intuición, el futuro te está esperando y es brillante."
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00C2E0]">
                <span className="w-2 h-2 bg-[#00C2E0] rounded-full animate-ping" />
                TRANSMISIÓN COMPLETADA
              </div>
              <div className="flex gap-1 text-[#F4C95D]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
}
