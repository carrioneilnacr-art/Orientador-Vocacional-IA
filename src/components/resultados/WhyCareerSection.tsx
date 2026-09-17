"use client";

import Image from "next/image";
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
    if (name.includes("diseño") || name.includes("comunicación") || name.includes("publicidad")) {
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
    <section className="w-full">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-[32px] font-bold text-[#082A4A] leading-tight">
          ¿Por qué {career.name}?
        </h2>
        <p className="text-[#4F6B85] text-[16px] font-medium">
          Tu perfil <strong className="text-[#00C2E0] capitalize">{profileName.toLowerCase()}</strong> se alinea con las habilidades y retos de esta carrera.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Lado Izquierdo: Razones Cortas y Dinámicas */}
        <div className="flex flex-col justify-center space-y-4">
          {[
            { Icon: Zap,      title: "Haz match con tu pasión",    desc: "Esta carrera encaja perfecto con lo que te gusta hacer y cómo piensas." },
            { Icon: Crosshair, title: "Ventaja competitiva",      desc: "Tus habilidades naturales te harán destacar súper rápido en este campo." },
            { Icon: Lightbulb, title: "El poder de tu título en Perú",       desc: "Los universitarios en Perú ganan en promedio 70% más, acceden a networking global y mayor libertad." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-5 p-5 rounded-[20px] bg-white shadow-sm border border-[#D6E5EF] hover:border-[#00C2E0]/40 transition-all hover:shadow-md hover:-translate-y-0.5 group">
              <div className="bg-[#F8FCFF] w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-[#D6E5EF]/60 group-hover:bg-[#00C2E0] group-hover:border-[#00C2E0] transition-colors">
                <Icon className="h-5 w-5 text-[#00C2E0] group-hover:text-white transition-colors" strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="font-bold text-[#082A4A] text-[16px] mb-1">{title}</h4>
                <p className="text-[13.5px] text-[#4F6B85] leading-relaxed font-medium">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lado Derecho: Visual y Dato Curioso */}
        <div className="flex flex-col gap-4">
          {/* Ilustración + Chaski */}
          <div className="bg-[#F8FCFF] rounded-[24px] border border-[#D6E5EF] flex-1 flex items-center justify-center relative overflow-hidden min-h-[220px]">
             {/* Decorative Background for Image Area */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-4 left-4 w-32 h-32 bg-[#00C2E0]/20 rounded-full blur-2xl" />
              <div className="absolute bottom-4 right-4 w-40 h-40 bg-[#18A86B]/10 rounded-full blur-2xl" />
            </div>
            
            <div className="relative w-[180px] h-[180px] z-10 opacity-90 hover:scale-105 transition-transform duration-500">
              {/* Placeholder for modern abstract illustration. Since we don't have custom ones, we use a generic tech/edu icon approach or Chaski. */}
              <Image src="/assets/chaski/chaski-5.png" alt="Creatividad y estudio" fill className="object-contain drop-shadow-md" />
            </div>
            
            {/* Pequeño elemento flotante */}
            <div className="absolute top-6 right-8 bg-white p-2 rounded-xl shadow-sm border border-[#D6E5EF] animate-pulse">
              <Sparkles className="w-5 h-5 text-[#F4C95D]" />
            </div>
          </div>

          {/* Dato Curioso Cyan Suave */}
          <div className="bg-[#EAF6FF] rounded-[20px] p-6 text-[#082A4A] relative border border-[#00C2E0]/20 hover:border-[#00C2E0]/40 transition-colors">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 border border-[#D6E5EF] text-[#00C2E0] shadow-sm">
              <Flame className="h-3.5 w-3.5 text-[#F4C95D]" /> Dato Curioso
            </div>
            
            <h4 className="font-bold text-[18px] mb-2 leading-tight flex items-start gap-2">
              {funFact.title}
            </h4>
            
            <p className="text-[13.5px] text-[#4F6B85] leading-relaxed font-medium">
              {funFact.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
