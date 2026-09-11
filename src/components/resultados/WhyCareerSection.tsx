"use client";

import Link from "next/link";
import { BrainCircuit, Zap, Lightbulb, Crosshair, ArrowRight } from "lucide-react";
import type { CareerResult } from "@/types/vocacional";

interface WhyCareerSectionProps {
  career: CareerResult;
  profileName: string;
}

export default function WhyCareerSection({ career, profileName }: WhyCareerSectionProps) {
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
        {/* Razones */}
        <div className="space-y-4">
          {[
            { Icon: Zap,      title: "Se conecta con tus intereses",   desc: "Las áreas que te motivan son el centro del ejercicio profesional de esta especialidad." },
            { Icon: Crosshair, title: "Aprovecha tus habilidades",      desc: "Tu capacidad analítica y enfoque estructurado te darán una clara ventaja de desarrollo." },
            { Icon: Lightbulb, title: "Tiene un gran campo laboral",    desc: "Existe una alta demanda de profesionales especializados en esta disciplina en el Perú y el mundo." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 rounded-[18px] bg-white shadow-sm border border-[#D6E5EF]/60">
              <Icon className="h-6 w-6 text-[#00C2E0] shrink-0 mt-0.5" strokeWidth={2.2} />
              <div>
                <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">{title}</h4>
                <p className="text-[13px] text-[#4F6B85] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Links de exploración */}
        <div className="bg-[#F8FCFF] rounded-[20px] border border-[#D6E5EF] p-6 flex flex-col justify-center space-y-3.5">
          <h4 className="font-bold text-[#082A4A] text-[15px] mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-[#00C2E0]" /> Conoce más sobre esta carrera
          </h4>
          {["Plan de estudios", "Campo laboral", "Universidades en Perú", "Salario promedio"].map(
            (label, i) => (
              <Link
                key={label}
                href={`/carreras/${career.slug}`}
                className={`flex justify-between items-center text-[13.5px] text-[#4F6B85] hover:text-[#00C2E0] font-medium py-1.5${i < 3 ? " border-b border-[#D6E5EF]/40" : ""}`}
              >
                <span>{label}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
