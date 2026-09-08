import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Shield, Map, Star, Users, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent font-sans selection:bg-[#00C2E0] selection:text-white transition-colors duration-500">
      {/* Header */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between w-full max-w-[1400px] mx-auto z-10 relative">
        <div className="flex items-center gap-3">
          {/* Espacio en blanco limpio sin nombre CHASKI ni logotipo */}
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-[14px] font-medium text-[#082A4A] hover:text-[#00C2E0] transition-colors">Inicio</Link>
          <Link href="/como-funciona" className="text-[14px] font-medium text-[#4F6B85] hover:text-[#082A4A] transition-colors">Cómo funciona</Link>
        </nav>
        
        {/* Placeholder to keep flex-between balanced if needed */}
        <div className="hidden md:block w-[100px]"></div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-8 px-6 md:px-12 pb-12 pt-4">
        {/* Left Column (Text Content) */}
        <div className="flex flex-col justify-center py-8 lg:pr-8">
          <h1 className="text-[48px] md:text-[56px] font-bold tracking-tight text-[#082A4A] mb-6 leading-tight">
            Tu futuro<br />
            también es parte de nuestra<br />
            <span className="text-[#00C2E0]">historia.</span>
          </h1>
          
          <p className="text-[16px] text-[#4F6B85] mb-10 max-w-lg font-normal leading-relaxed">
            Descubre tu vocación con IA y conecta tus talentos con las oportunidades del mundo real.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-lg">
            <div className="flex flex-col items-start gap-3">
              <div className="text-[#082A4A]">
                <Compass className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-[#082A4A] text-[16px]">Explora</h3>
                <p className="text-[13px] text-[#4F6B85] font-normal">Tus intereses</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="text-[#082A4A]">
                <Shield className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-[#082A4A] text-[16px]">Conoce</h3>
                <p className="text-[13px] text-[#4F6B85] font-normal">Tus fortalezas</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="text-[#082A4A]">
                <Map className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-[#082A4A] text-[16px]">Decide</h3>
                <p className="text-[13px] text-[#4F6B85] font-normal">Tu próximo paso</p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Link 
              href="/cuestionario"
              className="inline-flex h-[56px] items-center justify-center rounded-[16px] bg-[#00C2E0] hover:bg-[#0EA5C6] px-8 text-[18px] font-bold text-white shadow-lg shadow-[#00C2E0]/20 transition-all duration-300 hover:-translate-y-1"
            >
              Comenzar ahora
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Right Column (Image/Visuals) */}
        <div className="relative min-h-[500px] lg:min-h-[600px] rounded-[24px] overflow-hidden flex flex-col justify-end p-6 md:p-10 border border-[#D6E5EF] bg-white shadow-xl shadow-[#082A4A]/5">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
             <Image 
                src="/assets/robot_bg.jpg" 
                alt="Robot explorador en montañas" 
                fill 
                className="object-cover"
                priority
             />
             {/* Gradient Overlay for better text legibility */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#082A4A]/60 via-[#082A4A]/20 to-transparent"></div>
          </div>
          
          {/* Floating Handwritten Text */}
          <div className="absolute top-12 right-12 z-10 rotate-[-4deg] max-w-[200px] hover:rotate-0 transition-transform duration-300">
             <p className="text-[16px] font-serif italic text-[#082A4A] leading-snug bg-white/95 backdrop-blur-md p-4 rounded-[14px] shadow-lg shadow-[#082A4A]/10 border border-[#D6E5EF]">
               Grandes decisiones también empiezan con una pregunta.
             </p>
          </div>
          
          {/* Stats Bar */}
          <div className="relative z-10 w-full bg-white/95 backdrop-blur-xl rounded-[20px] p-6 flex flex-col sm:flex-row justify-between items-center shadow-xl shadow-[#082A4A]/10 border border-[#D6E5EF]/50 gap-4 sm:gap-0">
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-5 w-5 text-[#00C2E0]" />
                <div className="font-bold text-[28px] text-[#082A4A] leading-none">+10K</div>
              </div>
              <div className="text-[#4F6B85] text-[14px] font-medium ml-7">estudiantes</div>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-[#D6E5EF]"></div>
            
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-5 w-5 text-[#00C2E0] fill-[#00C2E0]" />
                <div className="font-bold text-[28px] text-[#082A4A] leading-none">95%</div>
              </div>
              <div className="text-[#4F6B85] text-[14px] font-medium ml-7">recomiendan</div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-[#D6E5EF]"></div>

            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-5 w-5 text-[#00C2E0]" />
                <div className="font-bold text-[28px] text-[#082A4A] leading-none">+100</div>
              </div>
              <div className="text-[#4F6B85] text-[14px] font-medium ml-7">carreras analizadas</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



