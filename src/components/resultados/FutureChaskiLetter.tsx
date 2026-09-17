import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Star, MessageCircle } from 'lucide-react';
import Image from 'next/image';

interface FutureChaskiLetterProps {
  profileName: string;
}

export default function FutureChaskiLetter({ profileName }: FutureChaskiLetterProps) {
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
    <section className="w-full mb-16 mt-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="w-full bg-white rounded-[24px] shadow-sm border border-[#D6E5EF] overflow-hidden relative"
      >
        {/* Elementos gráficos decorativos */}
        <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-[#00C2E0]/20" />
        <div className="absolute bottom-20 left-1/2 w-6 h-6 rounded-full bg-[#18A86B]/10" />
        <div className="absolute top-20 right-20 w-3 h-3 rounded-full bg-[#F4C95D]/30" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#00C2E0]/5 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

        <div className="p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-16 relative z-10">
          
          {/* Lado Izquierdo: Chaski Grande (40%) */}
          <div className="w-full md:w-[40%] flex flex-col items-center justify-center relative">
            {/* Globo de diálogo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute -top-6 -right-4 md:-right-8 bg-white border border-[#D6E5EF] shadow-sm rounded-[20px] rounded-bl-none px-5 py-3 z-20 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#00C2E0]" />
              <span className="text-[14px] font-bold text-[#082A4A]">¡Hola! Soy Chaski.</span>
            </motion.div>

            <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] z-10">
              <Image 
                src="/assets/chaski/chaski-8.png" 
                alt="Chaski del Futuro" 
                fill 
                className="object-contain animate-bounce-slow" 
                priority
              />
            </div>
            
            {/* Destellos decorativos alrededor de Chaski */}
            <Sparkles className="absolute top-1/4 left-0 w-6 h-6 text-[#F4C95D] animate-pulse" />
            <Sparkles className="absolute bottom-1/4 right-0 w-5 h-5 text-[#00C2E0] animate-pulse delay-300" />
          </div>

          {/* Lado Derecho: Carta (60%) */}
          <div className="w-full md:w-[60%] flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF6FF] rounded-[8px] text-[11px] font-bold text-[#00C2E0] tracking-wider uppercase mb-5 w-fit border border-[#00C2E0]/20">
              <Zap className="w-3.5 h-3.5" /> UN MENSAJE PARA TI
            </div>
            
            <h2 className="text-[32px] md:text-[38px] font-bold mb-6 leading-tight text-[#082A4A]">
              Una carta desde tu <span className="text-[#00C2E0]">futuro...</span>
            </h2>
            
            <div className="space-y-5 text-[#4F6B85] text-[15px] leading-relaxed">
              <p>
                Acabo de ver en lo que te has convertido y no podía esperar para decírtelo: <span className="text-[#18A86B] font-bold bg-[#18A86B]/10 px-1.5 py-0.5 rounded-[4px]">tomaste la decisión correcta.</span>
              </p>
              <p>
                Apostaste por tu perfil <strong className="text-[#082A4A]">{profileName}</strong> cuando nadie más veía lo que tú veías. Hoy en día, todos te conocen como <strong className="text-[#00C2E0] font-bold text-[16px]">"{superpower}"</strong>. 
              </p>
              <p>
                No fue un camino fácil, hubieron amanecidas y dudas, pero hoy trabajas en lo que te apasiona, transformando ideas en realidad y destacando en tu campo. Sigue tu intuición, el futuro te está esperando y es brillante.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-[#D6E5EF]/60">
              <h4 className="text-[18px] font-bold text-[#082A4A] mb-1">Grandes historias comienzan con una decisión.</h4>
              <p className="text-[14px] text-[#4F6B85] font-medium flex items-center gap-2">
                Tú puedes. El futuro también cree en ti. <Star className="w-4 h-4 text-[#F4C95D] fill-[#F4C95D]" />
              </p>
            </div>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
}
