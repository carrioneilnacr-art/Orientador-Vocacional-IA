import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";

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

          {/* Value Highlights Bar */}
          <div className="w-full bg-white/95 backdrop-blur-xl rounded-[20px] p-6 flex flex-col sm:flex-row justify-between items-center shadow-[0_10px_30px_rgb(8,42,74,0.06)] border border-[#D6E5EF]/50 gap-4 sm:gap-0">
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <div className="flex items-center gap-2 mb-1">
                <BrainCircuit className="h-5 w-5 text-[#00C2E0]" />
                <div className="font-bold text-[20px] md:text-[22px] text-[#082A4A] leading-none">8 Dimensiones</div>
              </div>
              <div className="text-[#4F6B85] text-[13px] font-medium sm:ml-7">Modelo Holland & RIASEC</div>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-[#D6E5EF]"></div>
            
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-5 w-5 text-[#00C2E0]" />
                <div className="font-bold text-[20px] md:text-[22px] text-[#082A4A] leading-none">Datos Reales</div>
              </div>
              <div className="text-[#4F6B85] text-[13px] font-medium sm:ml-7">Universidades y mallas vigentes</div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-[#D6E5EF]"></div>

            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-[#00C2E0]" />
                <div className="font-bold text-[20px] md:text-[22px] text-[#082A4A] leading-none">100% Gratuito</div>
              </div>
              <div className="text-[#4F6B85] text-[13px] font-medium sm:ml-7">Con reporte PDF descargable</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
