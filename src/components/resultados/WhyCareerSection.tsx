"use client";

import { BrainCircuit, Zap, Lightbulb, Crosshair, Sparkles, Flame } from "lucide-react";
import type { CareerResult } from "@/types/vocacional";

interface WhyCareerSectionProps {
  career: CareerResult;
  profileName: string;
}

export default function WhyCareerSection({ career, profileName }: WhyCareerSectionProps) {
  
  // Generar un dato curioso divertido basado en el nombre de la carrera
  const getFunFact = (careerName: string) => {
    const name = careerName.toLowerCase();
    if (name.includes("software") || name.includes("computación") || name.includes("sistemas")) {
      return {
        title: "¡Hackeando el futuro!",
        text: "Sabías que el código que envió al hombre a la luna (Apolo 11) tenía menos líneas que una app de celular moderna. ¡Tú podrías crear la próxima gran revolución tecnológica!"
      };
    }
    if (name.includes("psicología")) {
      return {
        title: "¡Lector de mentes!",
        text: "La psicología no es solo escuchar problemas. Aprenderás trucos sobre cómo funciona el cerebro humano, el sesgo cognitivo, y por qué tomamos las decisiones que tomamos."
      };
    }
    if (name.includes("negocios") || name.includes("administración") || name.includes("marketing")) {
      return {
        title: "¡El lobo de Wall Street!",
        text: "Las marcas más exitosas no venden productos, venden emociones. Aprenderás a dominar el arte de la persuasión, las tendencias virales y cómo construir imperios desde cero."
      };
    }
    if (name.includes("diseño") || name.includes("comunicación")) {
      return {
        title: "¡Creador de realidades!",
        text: "El 90% de la información transmitida al cerebro es visual. Aprenderás a manipular colores, tipografías y narrativas para hacer que la gente sienta exactamente lo que tú quieres."
      };
    }
    if (name.includes("ingeniería") || name.includes("civil") || name.includes("industrial")) {
      return {
        title: "¡Tony Stark vibes!",
        text: "Los ingenieros no solo resuelven ecuaciones, inventan soluciones a problemas que la gente ni sabía que tenía. Desde rascacielos hasta exoesqueletos, el límite es tu imaginación."
      };
    }
    return {
      title: "¡Rompiendo el molde!",
      text: "Cada gran profesional empezó exactamente donde estás tú hoy. Tu combinación única de habilidades está a punto de revolucionar esta industria. ¡El mundo necesita tu talento!"
    };
  };

  const funFact = getFunFact(career.name);

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#EAF6FF] text-[#00C2E0] p-2.5 rounded-[12px]">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-[26px] font-bold text-[#082A4A] leading-tight">
            ¿Por qué {career.name}?
          </h2>
          <p className="text-[#4F6B85] text-[14px]">
            Tu perfil {profileName.toLowerCase()} se alinea con las habilidades y retos de esta carrera.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* Razones Cortas y Dinámicas */}
        <div className="space-y-3">
          {[
            { Icon: Zap,      title: "Haz match con tu pasión",    desc: "Esta carrera encaja perfecto con lo que te gusta hacer y cómo piensas." },
            { Icon: Crosshair, title: "Ventaja competitiva",      desc: "Tus habilidades naturales te harán destacar súper rápido en este campo." },
            { Icon: Lightbulb, title: "El poder de tu título en Perú",       desc: "Los universitarios en Perú ganan en promedio 70% más, acceden a networking global y tienen mayor libertad financiera." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-4 rounded-[16px] bg-white shadow-sm border border-[#D6E5EF] hover:border-[#00C2E0]/40 transition-colors group">
              <Icon className="h-6 w-6 text-[#00C2E0] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={2.2} />
              <div>
                <h4 className="font-bold text-[#082A4A] text-[14px] mb-0.5">{title}</h4>
                <p className="text-[12.5px] text-[#4F6B85] leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dato Curioso VIBRANTE (Reemplazo de los links aburridos) */}
        <div className="bg-gradient-to-br from-[#00C2E0] to-[#0A85B8] rounded-[24px] p-6 text-white flex flex-col justify-center space-y-4 relative overflow-hidden shadow-sm border-2 border-white/20 transform transition-transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#18A86B]/20 rounded-full blur-xl pointer-events-none -ml-8 -mb-8" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-wider uppercase mb-3 border border-white/30">
              <Flame className="h-3.5 w-3.5 text-[#F4C95D]" /> Dato Curioso
            </div>
            
            <h4 className="font-bold text-[18px] mb-2 leading-tight flex items-start gap-2">
              {funFact.title}
              <Sparkles className="h-4 w-4 text-[#F4C95D] shrink-0 animate-pulse" />
            </h4>
            
            <p className="text-[13px] text-white/90 leading-relaxed font-medium">
              {funFact.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
