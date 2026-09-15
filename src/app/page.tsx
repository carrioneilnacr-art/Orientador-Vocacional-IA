import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BrainCircuit, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FCFF] font-sans selection:bg-[#00C2E0] selection:text-white transition-colors duration-500">
      {/* Header flotante transparente */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between w-full max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3"></div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 shadow-sm">
          <Link href="/" className="text-[14px] font-bold text-[#082A4A] hover:text-[#00C2E0] transition-colors">Inicio</Link>
          <Link href="/como-funciona" className="text-[14px] font-medium text-[#4F6B85] hover:text-[#082A4A] transition-colors">Cómo funciona</Link>
        </nav>
        
        <div className="hidden md:block w-[100px]"></div>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 w-full min-h-[calc(100vh-80px)] flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-24 pb-12 overflow-hidden bg-[#F8FCFF]">
        
        {/* Background Image constrained to RIGHT side */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[60%] z-0">
          <Image 
            src="/assets/robot_bg.jpg" 
            alt="Robot explorador" 
            fill 
            className="object-cover object-[center_60%] md:object-[center_80%] -scale-x-100"
            priority
          />
          {/* Gradients para borrar cualquier línea dura en el centro (fusión perfecta con el fondo) */}
          <div className="absolute inset-y-0 left-[-2px] w-[50%] bg-gradient-to-r from-[#F8FCFF] via-[#F8FCFF] to-transparent z-10" />
          {/* Gradiente adicional en móvil */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FCFF] via-[#F8FCFF]/90 to-transparent z-10 md:hidden" />
        </div>

        {/* Content Overlay (Strictly Left Aligned) */}
        <div className="relative z-20 w-full md:w-[50%] lg:w-[45%] max-w-[650px] mr-auto mt-20 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left">
          
          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-extrabold tracking-tight text-[#082A4A] mb-6 leading-[1.05]">
            Tu futuro<br className="hidden md:block" />
            también es parte de nuestra <span className="text-[#00C2E0]">historia.</span>
          </h1>
          
          <p className="text-[16px] md:text-[18px] text-[#4F6B85] mb-8 max-w-md font-medium leading-relaxed">
            Descubre tu vocación con IA y conecta tus talentos con las oportunidades del mundo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full md:w-auto justify-center md:justify-start">
            <Link 
              href="/cuestionario"
              className="inline-flex h-[56px] items-center justify-center rounded-[16px] bg-[#00C2E0] hover:bg-[#0EA5C6] px-8 text-[16px] md:text-[18px] font-bold text-white shadow-xl shadow-[#00C2E0]/30 transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
            >
              Comenzar ahora
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </div>

          {/* Dynamic Value Highlights Dock */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 sm:p-2.5 bg-white/70 backdrop-blur-xl rounded-[24px] border border-white/80 shadow-[0_20px_50px_rgba(8,42,74,0.07)]">
            
            {/* Card 1: 8 Dimensiones */}
            <div className="group relative bg-white/90 hover:bg-white rounded-[18px] p-4 sm:p-5 border border-[#D6E5EF]/70 hover:border-[#00C2E0]/50 shadow-xs hover:shadow-[0_12px_28px_rgba(0,194,224,0.14)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#EAF6FF] text-[#00C2E0] flex items-center justify-center transition-all duration-300 group-hover:bg-[#00C2E0] group-hover:text-white group-hover:rotate-3 shrink-0">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-[#00C2E0] bg-[#EAF6FF] px-2.5 py-0.5 rounded-full tracking-wide">
                  Psicometría IA
                </span>
              </div>
              <div>
                <div className="font-extrabold text-[18px] md:text-[20px] text-[#082A4A] leading-tight group-hover:text-[#00C2E0] transition-colors">
                  8 Dimensiones
                </div>
                <p className="text-[#4F6B85] text-[12.5px] font-medium mt-1 leading-snug">
                  Modelo Holland RIASEC calibrado para decisiones vocacionales.
                </p>
              </div>
            </div>

            {/* Card 2: Multi-Universidad */}
            <div className="group relative bg-white/90 hover:bg-white rounded-[18px] p-4 sm:p-5 border border-[#D6E5EF]/70 hover:border-[#00C2E0]/50 shadow-xs hover:shadow-[0_12px_28px_rgba(0,194,224,0.14)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#EAF6FF] text-[#00C2E0] flex items-center justify-center transition-all duration-300 group-hover:bg-[#00C2E0] group-hover:text-white group-hover:rotate-3 shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0EA5C6] bg-[#F0FDFA] px-2.5 py-0.5 rounded-full tracking-wide">
                  Perú 2026
                </span>
              </div>
              <div>
                <div className="font-extrabold text-[18px] md:text-[20px] text-[#082A4A] leading-tight group-hover:text-[#00C2E0] transition-colors">
                  Multi-Universidad
                </div>
                <p className="text-[#4F6B85] text-[12.5px] font-medium mt-1 leading-snug">
                  Mallas curriculares y sedes contrastadas de todo el país.
                </p>
              </div>
            </div>

            {/* Card 3: 100% Gratuito / Reporte */}
            <div className="group relative bg-white/90 hover:bg-white rounded-[18px] p-4 sm:p-5 border border-[#D6E5EF]/70 hover:border-[#00C2E0]/50 shadow-xs hover:shadow-[0_12px_28px_rgba(0,194,224,0.14)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#EAF6FF] text-[#00C2E0] flex items-center justify-center transition-all duration-300 group-hover:bg-[#00C2E0] group-hover:text-white group-hover:rotate-3 shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full tracking-wide">
                  100% Libre
                </span>
              </div>
              <div>
                <div className="font-extrabold text-[18px] md:text-[20px] text-[#082A4A] leading-tight group-hover:text-[#00C2E0] transition-colors">
                  Reporte Oficial
                </div>
                <p className="text-[#4F6B85] text-[12.5px] font-medium mt-1 leading-snug">
                  Descarga inmediata de tus resultados y afinidades en PDF.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
