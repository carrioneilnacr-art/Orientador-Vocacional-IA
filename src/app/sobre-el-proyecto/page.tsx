import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Compass, Heart, Lightbulb, Map, Mountain, Target } from "lucide-react";

export default function SobreElProyectoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5FAFD] font-sans selection:bg-[#08BBD5] selection:text-white pb-20">
      {/* Header flotante */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between w-full max-w-[1400px] mx-auto relative z-10">
        <Link
          href="/"
          className="inline-flex items-center text-[13px] font-bold text-[#0B2D4D] hover:text-[#08BBD5] transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-[#E1EDF3]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-8">
        
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#18A86B]/10 rounded-full blur-[120px] -z-10" />
          
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white border border-[#E1EDF3] shadow-sm">
            <Heart className="w-4 h-4 text-[#D3153A]" />
            <span className="text-[12px] font-bold tracking-widest text-[#D3153A] uppercase">
              Nuestro Propósito
            </span>
          </div>

          <h1 className="text-[40px] md:text-[60px] font-extrabold tracking-tight mb-6 text-[#0B2D4D] leading-tight">
            Nuestra Misión: Guiar <br className="hidden md:block" />
            <span style={{ color: "#18A86B" }}>tu verdadera vocación</span>
          </h1>
          
          <p className="text-[16px] md:text-[20px] text-[#355B78] max-w-3xl mx-auto font-medium leading-relaxed">
            Creemos que cada estudiante merece un guía. Orientador Vocacional IA nació para cerrar la brecha de información en el Perú, empoderando a los jóvenes con datos y empatía.
          </p>
        </div>

        {/* Content Section: Por qué Chaski? */}
        <div className="bg-white rounded-[32px] p-8 md:p-16 mb-8 border border-[#E1EDF3] shadow-sm relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden border border-[#E1EDF3]">
               <Image
                  src="/assets/chaski-hero.png"
                  alt="Chaski en Machu Picchu"
                  fill
                  className="object-cover object-[center_20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D4D]/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-medium text-[15px] italic">
                    "Unimos nuestra identidad histórica con la tecnología del mañana."
                  </p>
                </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <Mountain className="w-8 h-8 text-[#08BBD5]" />
                <h2 className="text-[32px] font-bold text-[#0B2D4D]">¿Por qué un Chaski?</h2>
              </div>
              <p className="text-[#355B78] text-[16px] leading-relaxed mb-6">
                En el antiguo Perú, los Chaskis eran los mensajeros que recorrían los Andes llevando información vital para conectar al imperio. Hoy, en la era digital, la información vital es saber <strong>qué camino profesional elegir</strong>.
              </p>
              <p className="text-[#355B78] text-[16px] leading-relaxed mb-8">
                Nuestro "Chaski IA" es ese mensajero incansable. Representa la fusión perfecta entre nuestras raíces peruanas y el futuro tecnológico. Su labor no es darte una orden, sino entregarte un "mapa" personalizado de tu futuro académico.
              </p>

              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-[#F5FAFD] px-4 py-2 rounded-lg border border-[#E1EDF3]">
                  <Compass className="w-5 h-5 text-[#08BBD5]" />
                  <span className="text-[14px] font-bold text-[#0B2D4D]">Exploración</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F5FAFD] px-4 py-2 rounded-lg border border-[#E1EDF3]">
                  <Lightbulb className="w-5 h-5 text-[#18A86B]" />
                  <span className="text-[14px] font-bold text-[#0B2D4D]">Tecnología</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section: El Enfoque */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-[24px] border border-[#E1EDF3] shadow-sm">
            <div className="w-12 h-12 bg-[#E8F7FB] rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-[#08BBD5]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#0B2D4D] mb-3">Más empatía, menos estrés</h3>
            <p className="text-[#355B78] text-[15px] leading-relaxed">
              Sabemos que elegir una carrera asusta. Por eso diseñamos una interfaz cálida, conversacional y sin presiones. Queremos que te sientas acompañado.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[24px] border border-[#E1EDF3] shadow-sm">
            <div className="w-12 h-12 bg-[rgba(24,168,107,0.1)] rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-[#18A86B]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#0B2D4D] mb-3">No es un test genérico</h3>
            <p className="text-[#355B78] text-[15px] leading-relaxed">
              Dejamos atrás los aburridos exámenes de 100 preguntas. Integramos IA generativa para entender tu contexto, tus dudas y recomendar con precisión milimétrica.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[24px] border border-[#E1EDF3] shadow-sm">
            <div className="w-12 h-12 bg-[#FFF3E0] rounded-xl flex items-center justify-center mb-6">
              <Map className="w-6 h-6 text-[#E29724]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#0B2D4D] mb-3">El mapa de tu vida</h3>
            <p className="text-[#355B78] text-[15px] leading-relaxed">
              No te decimos "estudia esto". Te abrimos un abanico de posibilidades reales en el Perú, explicándote el "por qué" hace match contigo.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
