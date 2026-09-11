"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, BrainCircuit, ArrowRight } from "lucide-react";
import type { CareerResult } from "@/types/vocacional";

interface CareersSectionProps {
  topCareers: CareerResult[];
}

export default function CareersSection({ topCareers }: CareersSectionProps) {
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-[28px] font-bold text-[#082A4A] flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-[#00C2E0]" />
          Tus 3 carreras con mayor match
        </h2>
        <Link
          href="#"
          className="text-[#00C2E0] font-semibold text-[14px] hover:underline flex items-center no-print no-pdf"
        >
          Ver todas las carreras <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCareers.map((career) => (
          <div
            key={career.id}
            className="career-card bg-white rounded-[20px] p-6 shadow-sm border border-[#D6E5EF] flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <h3 className="text-[17px] font-bold text-[#082A4A] leading-tight group-hover:text-[#00C2E0] transition-colors">
                  {career.name}
                </h3>
                <span className="bg-[#EAF6FF] text-[#00C2E0] font-bold px-2.5 py-1 rounded-[8px] text-[12px] shrink-0">
                  {career.match}%
                </span>
              </div>
              <p className="text-[13px] text-[#4F6B85] mb-5 leading-relaxed line-clamp-3">
                {career.justification}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="bg-[#F8FCFF] border border-[#D6E5EF] text-[#4F6B85] text-[11px] font-medium px-2.5 py-1 rounded-full">
                  Tecnología
                </span>
                <span className="bg-[#F8FCFF] border border-[#D6E5EF] text-[#4F6B85] text-[11px] font-medium px-2.5 py-1 rounded-full">
                  Lógica
                </span>
              </div>
            </div>
            <Link
              href={`/carreras/${career.slug}`}
              className="inline-flex h-[42px] items-center justify-center rounded-[12px] bg-[#00C2E0] hover:bg-[#0EA5C6] text-[13px] font-bold text-white transition-colors w-full shrink-0 shadow-xs"
            >
              <span>Ver detalle</span>
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
          </div>
        ))}

        {/* Tarjeta inspiracional */}
        <div className="relative rounded-[20px] overflow-hidden shadow-sm border border-[#D6E5EF] flex flex-col justify-between p-7 text-white group">
          <Image
            src="/assets/robot_bg.jpg"
            alt="Futuro"
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#082A4A]/70" />
          <div className="relative z-10">
            <BrainCircuit className="h-8 w-8 text-[#00C2E0] mb-4" />
            <h3 className="text-[20px] font-bold leading-snug">
              Más que una carrera, es la oportunidad de construir el futuro que imaginas.
            </h3>
          </div>
          <div className="relative z-10 text-[12.5px] text-white/80 font-medium">
            Orientador Vocacional UPC
          </div>
        </div>
      </div>
    </section>
  );
}
