import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Shield, Map, Star, Users, CheckCircle } from "lucide-react";

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

      {/* Hero Section Full Screen */}
      <main className="relative flex-1 w-full min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-20">
        
        {/* Background Image full cover (Flipped so robot is on left) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/robot_bg.jpg" 
            alt="Robot explorador" 
            fill 
            className="object-cover object-center -scale-x-100"
            priority
          />
          {/* Gradients para desvanecido y legibilidad (Reducidos y en la derecha) */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#F8FCFF] via-[#F8FCFF]/70 to-transparent md:w-3/4 lg:w-2/3 ml-auto z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8FCFF] z-10 opacity-70" />
        </div>

        {/* Content Overlay (Right Aligned) */}
        <div className="relative z-20 max-w-[650px] py-12 md:py-20 mt-10 ml-auto">
          <h1 className="text-[48px] md:text-[64px] lg:text-[72px] font-extrabold tracking-tight text-[#082A4A] mb-6 leading-[1.05]">
            Tu futuro<br />
            también es parte de nuestra<br />
            <span className="text-[#00C2E0]">historia.</span>
          </h1>
          
          <p className="text-[16px] md:text-[20px] text-[#4F6B85] mb-10 max-w-lg font-medium leading-relaxed">
            Descubre tu vocación con IA y conecta tus talentos con las oportunidades del mundo real.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-16">
            <Link 
              href="/cuestionario"
              className="inline-flex h-[60px] items-center justify-center rounded-[16px] bg-[#00C2E0] hover:bg-[#0EA5C6] px-10 text-[18px] font-bold text-white shadow-xl shadow-[#00C2E0]/30 transition-all duration-300 hover:-translate-y-1"
            >
              Comenzar ahora
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </div>

          {/* Stats Bar integrado */}
          <div className="w-full max-w-[700px] bg-white/90 backdrop-blur-xl rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center shadow-[0_20px_40px_rgb(8,42,74,0.08)] border border-[#D6E5EF] gap-6 sm:gap-0">
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-5 w-5 text-[#00C2E0]" />
                <div className="font-bold text-[28px] md:text-[32px] text-[#082A4A] leading-none">+10K</div>
              </div>
              <div className="text-[#4F6B85] text-[14px] font-medium sm:ml-7">estudiantes</div>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-[#D6E5EF]"></div>
            
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-5 w-5 text-[#00C2E0] fill-[#00C2E0]" />
                <div className="font-bold text-[28px] md:text-[32px] text-[#082A4A] leading-none">95%</div>
              </div>
              <div className="text-[#4F6B85] text-[14px] font-medium sm:ml-7">recomiendan</div>
            </div>

            <div className="hidden sm:block w-px h-16 bg-[#D6E5EF]"></div>

            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-5 w-5 text-[#00C2E0]" />
                <div className="font-bold text-[28px] md:text-[32px] text-[#082A4A] leading-none">+100</div>
              </div>
              <div className="text-[#4F6B85] text-[14px] font-medium sm:ml-7">carreras analizadas</div>
            </div>
          </div>
        </div>

        {/* Floating Note (Moved to left) */}
        <div className="hidden lg:block absolute bottom-24 left-24 z-20 max-w-[280px]">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-[24px] rounded-bl-none shadow-[0_20px_40px_rgb(8,42,74,0.12)] border border-[#D6E5EF] rotate-[2deg] hover:rotate-0 transition-transform duration-300">
             <p className="text-[18px] font-serif italic text-[#082A4A] leading-relaxed">
               "Grandes decisiones también empiezan con una pregunta."
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}
