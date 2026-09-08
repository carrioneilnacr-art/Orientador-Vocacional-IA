import Link from "next/link";
import { ArrowLeft, Brain, Target, Database, Sparkles, TrendingDown, Users, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ComoFunciona() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FCFF] font-sans text-[#082A4A] selection:bg-[#00C2E0] selection:text-white pb-20">
      {/* Header */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between w-full max-w-[1400px] mx-auto relative bg-transparent z-10">
        <Link href="/" className="inline-flex items-center text-[14px] font-semibold text-[#082A4A] hover:text-[#00C2E0] transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-[#D6E5EF]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-8">
        {/* Hero Section */}
        <div className="text-center mb-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#00C2E0]/10 rounded-full blur-[100px] -z-10" />
          <h1 className="text-[40px] md:text-[64px] font-extrabold tracking-tight mb-6 text-[#082A4A] leading-tight">
            No es magia, es <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2E0] to-[#082A4A]">
              Ciencia de Datos e IA
            </span>
          </h1>
          <p className="text-[16px] md:text-[20px] text-[#4F6B85] max-w-3xl mx-auto font-normal leading-relaxed">
            Nuestra plataforma nació con un propósito claro: combatir la desinformación vocacional utilizando tecnología de vanguardia, inteligencia artificial generativa y datos universitarios 100% reales.
          </p>
        </div>

        {/* El Problema (Deserción) */}
        <div className="mb-32">
          <div className="flex items-center justify-center gap-3 mb-12">
            <TrendingDown className="h-8 w-8 text-[#00C2E0]" strokeWidth={2.5} />
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#082A4A] text-center">La Realidad Educativa</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#D6E5EF] relative overflow-hidden group hover:border-[#00C2E0] transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#EAF6FF] to-transparent rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="text-[#00C2E0] font-black text-[56px] leading-none mb-4">7<span className="text-[32px] text-[#4F6B85]">/10</span></div>
              <h3 className="text-[18px] font-bold text-[#082A4A] mb-3">Jóvenes indecisos</h3>
              <p className="text-[#4F6B85] text-[14px] leading-relaxed">
                Siete de cada diez estudiantes de secundaria terminan el colegio sin saber qué carrera estudiar, generando ansiedad y decisiones apresuradas basadas en presión social.
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#D6E5EF] relative overflow-hidden group hover:border-[#082A4A] transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#DEEEFF] to-transparent rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="text-[#082A4A] font-black text-[56px] leading-none mb-4">27<span className="text-[32px]">%</span></div>
              <h3 className="text-[18px] font-bold text-[#082A4A] mb-3">Deserción en 1er Año</h3>
              <p className="text-[#4F6B85] text-[14px] leading-relaxed">
                Aproximadamente el 27% de universitarios en el Perú abandonan o cambian su carrera en el primer año. La causa principal: falta de orientación y mala elección vocacional.
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#D6E5EF] relative overflow-hidden group hover:border-[#00C2E0] transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#EAF6FF] to-transparent rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="text-[#00C2E0] font-black text-[56px] leading-none mb-4">#1</div>
              <h3 className="text-[18px] font-bold text-[#082A4A] mb-3">Soluciones Obsoletas</h3>
              <p className="text-[#4F6B85] text-[14px] leading-relaxed">
                Los tests vocacionales tradicionales te encasillan en áreas rígidas. Hoy, las carreras son multidisciplinarias y los jóvenes exigen datos precisos e inmediatos.
              </p>
            </div>
          </div>
        </div>

        {/* Como Funciona el Sistema (Timeline Dinamico) */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#082A4A] mb-4">El Motor del Sistema</h2>
            <p className="text-[#4F6B85] text-[18px]">Una arquitectura diseñada para precisión, personalización y empatía.</p>
          </div>

          <div className="relative max-w-[900px] mx-auto">
            {/* Línea conectora central (solo en desktop) */}
            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-[2px] bg-gradient-to-b from-[#00C2E0] via-[#082A4A] to-transparent -translate-x-1/2 z-0" />
            
            <div className="space-y-12 md:space-y-0 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0">
                <div className="w-full md:w-1/2 md:pr-16 flex flex-col items-center md:items-end md:text-right">
                  <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#D6E5EF] hover:shadow-md transition-shadow w-full">
                    <div className="inline-flex w-12 h-12 bg-[#EAF6FF] text-[#00C2E0] rounded-[12px] items-center justify-center font-bold text-xl mb-6">1</div>
                    <h3 className="text-[22px] font-bold text-[#082A4A] mb-3">Evaluación Cognitiva</h3>
                    <p className="text-[#4F6B85] text-[15px] leading-relaxed">
                      El usuario responde un cuestionario moderno diseñado para perfilar 8 dimensiones de personalidad y aptitud. Rompemos el mito de "ciencias vs letras" para entender su verdadero ADN vocacional.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-[48px] h-[48px] bg-[#00C2E0] rounded-full border-[6px] border-[#F8FCFF] shadow-sm items-center justify-center z-20">
                  <Users className="text-white h-5 w-5" />
                </div>
                <div className="hidden md:block md:w-1/2 md:pl-16" />
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-0 mt-0 md:-mt-12">
                <div className="w-full md:w-1/2 md:pl-16 flex flex-col items-center md:items-start text-left">
                  <div className="bg-[#082A4A] p-8 rounded-[24px] shadow-sm border border-[#082A4A] hover:shadow-lg transition-shadow relative overflow-hidden w-full">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full -z-10" />
                    <div className="inline-flex w-12 h-12 bg-[#00C2E0]/20 text-[#00C2E0] rounded-[12px] items-center justify-center font-bold text-xl mb-6">2</div>
                    <h3 className="text-[22px] font-bold text-white mb-3">Algoritmo de Matching</h3>
                    <p className="text-[#D6E5EF] text-[15px] leading-relaxed">
                      El sistema calcula la afinidad cruzando el puntaje del alumno contra nuestra base de datos relacional. Se aplican reglas y pesos específicos por dimensión para empatar con perfiles de egreso universitarios reales.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-[48px] h-[48px] bg-[#082A4A] rounded-full border-[6px] border-[#F8FCFF] shadow-sm items-center justify-center z-20 md:mt-12">
                  <Brain className="text-[#00C2E0] h-5 w-5" />
                </div>
                <div className="hidden md:block md:w-1/2 md:pr-16" />
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0 mt-0 md:-mt-12">
                <div className="w-full md:w-1/2 md:pr-16 flex flex-col items-center md:items-end md:text-right">
                  <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#D6E5EF] hover:shadow-md transition-shadow w-full">
                    <div className="inline-flex w-12 h-12 bg-[#EAF6FF] text-[#00C2E0] rounded-[12px] items-center justify-center font-bold text-xl mb-6">3</div>
                    <h3 className="text-[22px] font-bold text-[#082A4A] mb-3">Asistencia IA Generativa</h3>
                    <p className="text-[#4F6B85] text-[15px] leading-relaxed">
                      Implementamos un Asistente Virtual conversacional. Cuando un alumno pregunta por costos o sedes, la IA no inventa: ejecuta herramientas internas que extraen la información verídica de nuestra base de datos en tiempo real.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-[48px] h-[48px] bg-[#00C2E0] rounded-full border-[6px] border-[#F8FCFF] shadow-sm items-center justify-center z-20 md:mt-12">
                  <Sparkles className="text-white h-5 w-5" />
                </div>
                <div className="hidden md:block md:w-1/2 md:pl-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Compromiso con la Verdad / Tech Stack */}
        <div className="bg-white rounded-[32px] p-8 md:p-16 mb-16 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#D6E5EF] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EAF6FF] rounded-bl-full -z-10 opacity-70" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <ShieldCheck className="h-12 w-12 text-[#00C2E0] mb-6" strokeWidth={2} />
              <h2 className="text-[32px] md:text-[40px] font-bold text-[#082A4A] mb-6 leading-tight">
                Garantía de Datos: <br className="hidden md:block" />
                <span className="text-[#00C2E0]">Cero Alucinaciones</span>
              </h2>
              <p className="text-[#4F6B85] text-[16px] leading-relaxed mb-8">
                En educación, la precisión lo es todo. Nuestro agente de inteligencia artificial opera bajo un sistema de llamadas a herramientas controlado. Las respuestas de los chats están ancladas estrictamente a datos verificados.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-[#DEEEFF] p-1.5 rounded-full"><Database className="h-4 w-4 text-[#00C2E0]" strokeWidth={3} /></div>
                  <span className="text-[#082A4A] font-semibold text-[15px] pt-1">Conexión directa a PostgreSQL (Supabase)</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-[#DEEEFF] p-1.5 rounded-full"><Target className="h-4 w-4 text-[#00C2E0]" strokeWidth={3} /></div>
                  <span className="text-[#082A4A] font-semibold text-[15px] pt-1">Costos y sedes extraídos mediante queries precisos</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-[#DEEEFF] p-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 text-[#00C2E0]" strokeWidth={3} /></div>
                  <span className="text-[#082A4A] font-semibold text-[15px] pt-1">Protección contra información fabricada (AI Hallucinations)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#082A4A] p-8 md:p-10 rounded-[24px] text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00C2E0]/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#00C2E0]/20 blur-3xl rounded-full" />
              
              <h3 className="text-[22px] font-bold mb-8 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-[#00C2E0]" />
                Stack Tecnológico
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div className="bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="text-[12px] text-[#00C2E0] font-bold uppercase tracking-wider mb-1.5">Frontend & Framework</div>
                  <div className="font-semibold text-[16px] text-white">Next.js 15 (App Router) + Tailwind CSS v4</div>
                </div>
                <div className="bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="text-[12px] text-[#00C2E0] font-bold uppercase tracking-wider mb-1.5">Arquitectura de Datos</div>
                  <div className="font-semibold text-[16px] text-white">PostgreSQL + Drizzle ORM</div>
                </div>
                <div className="bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="text-[12px] text-[#00C2E0] font-bold uppercase tracking-wider mb-1.5">Cerebro de Inteligencia Artificial</div>
                  <div className="font-semibold text-[16px] text-white">Google Gemini 2.5 Flash + Vercel AI SDK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
