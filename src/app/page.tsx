import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Map, ShieldCheck, GraduationCap, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#00C2E0] selection:text-white overflow-hidden relative">
      
      {/* Background Image Container (Right Side) */}
      <div className="absolute inset-y-0 right-0 w-[100%] md:w-[70%] lg:w-[65%] z-0">
        <Image 
          src="/assets/bg-inicio.png" 
          alt="Robot explorador" 
          fill 
          className="object-cover object-[center_60%] md:object-right"
          priority
        />
        {/* Soft gradient to blend the left side into white */}
        <div className="absolute inset-y-0 left-[-2px] w-[50%] md:w-[60%] bg-gradient-to-r from-white via-white/90 to-transparent z-10" />
        {/* Gradient for mobile to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent z-10 md:hidden" />
      </div>

      {/* Floating Header */}
      <header className="relative z-50 pt-6 pb-3 w-full flex justify-center px-4">
        <nav className="flex items-center gap-5 sm:gap-8 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.06)] px-6 py-2.5 rounded-full border border-gray-50">
          <Link href="/" className="text-[13px] font-bold text-[#082A4A]">Inicio</Link>
          <Link href="/como-funciona" className="text-[13px] font-medium text-[#4F6B85] hover:text-[#082A4A] transition-colors">Cómo funciona</Link>
          <Link href="#" className="hidden sm:block text-[13px] font-medium text-[#4F6B85] hover:text-[#082A4A] transition-colors">Sobre el proyecto</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-20 flex-1 w-full max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 pt-6 md:pt-10 pb-10 flex flex-col justify-center">
        
        <div className="w-full md:w-[60%] lg:w-[50%] max-w-[550px] flex flex-col items-center md:items-start text-center md:text-left mt-2 md:mt-0">
          
          <h1 className="text-[36px] md:text-[46px] lg:text-[56px] font-extrabold tracking-tight text-[#082A4A] mb-4 leading-[1.05]">
            Tu futuro<br className="hidden md:block" />
            también es parte de<br className="hidden md:block" />
            nuestra <span className="text-[#00C2E0]">historia.</span>
          </h1>
          
          <p className="text-[14px] md:text-[15.5px] text-[#4F6B85] mb-8 max-w-[440px] font-medium leading-relaxed">
            Descubre hacia dónde puede llevarte tu curiosidad. 
            Conoce tus intereses, descubre carreras que conectan 
            contigo y explora dónde podrías estudiar.
          </p>

          <Link 
            href="/cuestionario"
            className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#00C2E0] hover:bg-[#0EA5C6] px-7 text-[15px] font-bold text-white shadow-[0_8px_25px_rgba(0,194,224,0.35)] transition-all duration-300 hover:-translate-y-1 mb-10 w-full sm:w-auto"
          >
            Comenzar aventura
            <ArrowRight className="ml-2.5 h-4 w-4" />
          </Link>

          {/* Features Pill Dock */}
          <div className="w-full max-w-[600px] flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-3 md:gap-2 bg-white/95 backdrop-blur-md px-5 py-3 rounded-3xl md:rounded-full border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            
            <div className="flex items-center gap-2.5">
              <div className="text-[#00C2E0]">
                <Map className="w-5 h-5 md:w-6 md:h-6 stroke-[2]" />
              </div>
              <div className="text-left">
                <p className="text-[13px] md:text-[14px] font-extrabold text-[#082A4A] leading-none">16</p>
                <p className="text-[10px] md:text-[11px] font-medium text-[#4F6B85]">decisiones</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-7 bg-gray-200"></div>

            <div className="flex items-center gap-2.5">
              <div className="text-[#00C2E0]">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 stroke-[2]" />
              </div>
              <div className="text-left">
                <p className="text-[13px] md:text-[14px] font-extrabold text-[#082A4A] leading-none">8</p>
                <p className="text-[10px] md:text-[11px] font-medium text-[#4F6B85]">dimensiones</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-7 bg-gray-200"></div>

            <div className="flex items-center gap-2.5">
              <div className="text-[#00C2E0]">
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6 stroke-[2]" />
              </div>
              <div className="text-left">
                <p className="text-[13px] md:text-[14px] font-extrabold text-[#082A4A] leading-none">Universidades</p>
                <p className="text-[10px] md:text-[11px] font-medium text-[#4F6B85]">del Perú</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-7 bg-gray-200"></div>

            <div className="flex items-center gap-2.5">
              <div className="text-[#00C2E0]">
                <FileText className="w-5 h-5 md:w-6 md:h-6 stroke-[2]" />
              </div>
              <div className="text-left">
                <p className="text-[13px] md:text-[14px] font-extrabold text-[#082A4A] leading-none">Reporte</p>
                <p className="text-[10px] md:text-[11px] font-medium text-[#4F6B85]">en PDF</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Floating Speech Bubble (Desktop Only) */}
      <div className="hidden lg:block absolute top-[45%] right-[25%] z-20">
        <div className="relative animate-bounce" style={{ animationDuration: '4s' }}>
          <div className="bg-white px-4 py-3 rounded-[20px] rounded-br-sm shadow-xl font-medium text-[#082A4A] text-[13px] leading-snug transform -rotate-2 border border-gray-50 italic">
            ¡Hola!<br/>
            Soy Chaski,<br/>
            tu compañero en<br/>
            esta aventura.
          </div>
          {/* Arrow pointing to the robot */}
          <div className="absolute -bottom-6 right-5 text-[#082A4A]">
             <svg width="32" height="32" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-rotate-12">
               <path d="M5 5 Q 10 25 30 35" />
               <path d="M22 35 L 30 35 L 28 27" />
             </svg>
          </div>
        </div>
      </div>

      {/* Floating Bottom Right Text (Desktop Only) */}
      <div className="hidden lg:block absolute bottom-8 right-10 z-20">
        <p className="text-white text-[20px] font-serif italic drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] -rotate-3 text-right font-medium">
          Grandes<br/>
          historias comienzan<br/>
          con una decisión
        </p>
      </div>

    </div>
  );
}
