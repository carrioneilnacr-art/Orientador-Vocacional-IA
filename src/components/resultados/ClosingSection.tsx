"use client";

import Image from "next/image";
import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";

export default function ClosingSection() {
  const handleScrollToChat = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Chat is at the top
  };

  return (
    <section className="relative w-full bg-white rounded-[24px] border border-[#D6E5EF] shadow-sm overflow-hidden py-12 px-6 md:px-12 mt-12 mb-8">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C2E0]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#18A86B]/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center relative z-10">
        
        {/* Left: Chaski */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] mb-4">
            <Image
              src="/assets/chaski/chaski-7.png"
              alt="Chaski celebrando"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="bg-[#EAF6FF] text-[#082A4A] font-bold py-2.5 px-6 rounded-full border border-[#00C2E0]/20 shadow-sm text-[15px] inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00C2E0]" />
            Tu futuro está en tus manos
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-6">
          <div>
            <h2 className="text-[32px] md:text-[38px] font-bold text-[#082A4A] leading-tight mb-2">
              ¿Y ahora qué?
            </h2>
            <p className="text-[16px] text-[#4F6B85] font-medium">
              Tu futuro no tiene una sola respuesta. Ya descubriste algunas carreras que podrían encajar contigo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button onClick={handleScrollToChat} className="group flex flex-col p-5 bg-[#F8FCFF] border border-[#D6E5EF] rounded-[20px] hover:border-[#00C2E0]/50 hover:shadow-md transition-all text-left">
              <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-[#00C2E0] mb-3 group-hover:scale-110 transition-transform">
                <Compass className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">Explorar mis carreras</h4>
              <p className="text-[13px] text-[#4F6B85]">Vuelve arriba para ver los detalles de cada opción recomendada.</p>
            </button>

            <button onClick={handleScrollToChat} className="group flex flex-col p-5 bg-[#F8FCFF] border border-[#D6E5EF] rounded-[20px] hover:border-[#00C2E0]/50 hover:shadow-md transition-all text-left">
              <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-[#18A86B] mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">Hablar con Chaski</h4>
              <p className="text-[13px] text-[#4F6B85]">Pregúntale al copiloto sobre universidades o salidas laborales.</p>
            </button>
          </div>

          <div className="pt-4 border-t border-[#D6E5EF]/60">
            <p className="text-[13.5px] text-[#4F6B85] text-center md:text-left">
              Puedes volver a realizar el test vocacional en cualquier momento.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
