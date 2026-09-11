"use client";

import Image from "next/image";
import { BrainCircuit, Crosshair, Lightbulb } from "lucide-react";

export default function NextStepsSection() {
  const steps = [
    {
      Icon: BrainCircuit,
      title: "Explora más carreras",
      desc: "Descubre otras opciones que también se alinean con tu perfil.",
    },
    {
      Icon: Crosshair,
      title: "Compara opciones",
      desc: "Analiza diferencias entre programas, enfoques y malla curricular.",
    },
    {
      Icon: Lightbulb,
      title: "Conoce el mercado laboral",
      desc: "Revisa la demanda real de egresados y opciones de especialización.",
    },
  ];

  return (
    <section className="bg-[#EAF6FF] rounded-[24px] p-8 md:p-10 border border-[#D6E5EF] relative overflow-hidden">
      <div className="relative z-10 max-w-3xl">
        <h2 className="text-[26px] font-bold text-[#082A4A] mb-2">
          Ahora que conoces tu perfil...
        </h2>
        <p className="text-[#4F6B85] text-[15px] mb-8">
          Da el siguiente paso y sigue explorando tu futuro profesional.
        </p>

        <div className="grid sm:grid-cols-3 gap-5">
          {steps.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-[16px] p-5 border border-[#D6E5EF] shadow-xs"
            >
              <Icon className="h-6 w-6 text-[#00C2E0] mb-3" />
              <h4 className="font-bold text-[#082A4A] text-[14px] mb-1">{title}</h4>
              <p className="text-[12px] text-[#4F6B85] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decoración Chaski lateral */}
      <div className="absolute right-[-20px] bottom-[-20px] opacity-25 pointer-events-none hidden md:block">
        <Image
          src="/assets/analizando_perfil.png"
          alt="Chaski"
          width={220}
          height={220}
          unoptimized
          className="object-contain"
        />
      </div>
    </section>
  );
}
