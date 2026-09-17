import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Star } from 'lucide-react';
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
    <section className="w-full mb-12 mt-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-[24px] shadow-sm border border-[#D6E5EF] overflow-hidden"
      >
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative">
          {/* Fondo sutil */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#00C2E0]/5 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          
          <div className="w-full md:w-1/3 flex justify-center relative z-10">
            <div className="relative w-40 h-40 md:w-56 md:h-56">
              <Image 
                src="/assets/chaski/chaski-12.png" 
                alt="Chaski del Futuro" 
                fill 
                className="object-contain" 
              />
            </div>
          </div>

          <div className="w-full md:w-2/3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F0F5F9] rounded-lg text-xs font-bold text-[#18A86B] uppercase tracking-wider mb-4">
              <Zap className="w-4 h-4" /> Un Mensaje para ti
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight text-[#082A4A]">
              Una carta desde tu <span className="text-[#00C2E0]">futuro</span>...
            </h2>
            
            <div className="space-y-4 text-[#4F6B85] text-sm md:text-base leading-relaxed relative border-l-2 border-[#00C2E0] pl-4 ml-1">
              <Sparkles className="absolute -left-[11px] top-0 w-5 h-5 text-[#00C2E0] bg-white" />
              <p>
                "¡Hola! Soy Chaski, pero te hablo desde dentro de 5 años. Acabo de ver en lo que te has convertido y no podía esperar para decírtelo: <strong>tomaste la decisión correcta</strong>."
              </p>
              <p>
                Apostaste por tu perfil <strong className="text-[#082A4A]">{profileName}</strong> cuando nadie más veía lo que tú veías. Hoy en día, todos te conocen como <strong className="text-[#18A86B]">"{superpower}"</strong>. 
              </p>
              <p>
                No fue un camino fácil, hubieron amanecidas y dudas, pero hoy trabajas en lo que te apasiona, transformando ideas en realidad y destacando en tu campo. Sigue tu intuición, el futuro te está esperando y es brillante."
              </p>
            </div>

            <div className="mt-8 flex gap-1 text-[#F4C95D]">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
}
