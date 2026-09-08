import Link from "next/link";
import { ArrowLeft, CheckCircle2, Target, Heart, Lightbulb, Database, Sparkles } from "lucide-react";

export default function ComoFunciona() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent font-sans text-[#082A4A] selection:bg-[#00C2E0] selection:text-white pb-20">
      {/* Header simple */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between w-full max-w-[1400px] mx-auto relative border-b border-[#D6E5EF] bg-white">
        <Link href="/" className="inline-flex items-center text-[14px] font-medium text-[#4F6B85] hover:text-[#082A4A] transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
        <div className="w-20"></div>
      </header>

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 md:px-12 pt-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-[32px] md:text-[48px] font-bold tracking-tight mb-6 text-[#082A4A]">
            Descubre tu camino en <span className="text-[#00C2E0]">tres pasos</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#4F6B85] max-w-2xl mx-auto font-normal leading-relaxed">
            No somos un test vocacional tradicional. Utilizamos inteligencia artificial para entender quién eres y mostrarte opciones reales respaldadas por datos.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-24 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[2px] bg-[#D6E5EF] -z-10 w-2/3 mx-auto"></div>
          
          <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#D6E5EF] relative z-10 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#082A4A] text-white rounded-2xl flex items-center justify-center font-bold text-[24px] mb-6 shadow-sm border border-[#00C2E0]/20">
              1
            </div>
            <h3 className="font-semibold text-[20px] mb-3 text-[#082A4A]">Conócete</h3>
            <p className="text-[#4F6B85] text-[14px] leading-relaxed">Responde preguntas dinámicas sobre tus intereses, habilidades y pasiones. Sin respuestas correctas o incorrectas.</p>
          </div>
          
          <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#D6E5EF] relative z-10 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#082A4A] text-white rounded-2xl flex items-center justify-center font-bold text-[24px] mb-6 shadow-sm border border-[#00C2E0]/20">
              2
            </div>
            <h3 className="font-semibold text-[20px] mb-3 text-[#082A4A]">Análisis IA</h3>
            <p className="text-[#4F6B85] text-[14px] leading-relaxed">Nuestra inteligencia artificial procesa tu perfil, cruzando datos de personalidad con perfiles profesionales reales.</p>
          </div>

          <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#D6E5EF] relative z-10 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#082A4A] text-white rounded-2xl flex items-center justify-center font-bold text-[24px] mb-6 shadow-sm border border-[#00C2E0]/20">
              3
            </div>
            <h3 className="font-semibold text-[20px] mb-3 text-[#082A4A]">Tu Futuro</h3>
            <p className="text-[#4F6B85] text-[14px] leading-relaxed">Recibe recomendaciones de carreras y descubre opciones que quizás no sabías que existían, adaptadas a ti.</p>
          </div>
        </div>

        {/* Misión, Visión, Propósito */}
        <div className="bg-[#082A4A] text-white rounded-[20px] p-10 md:p-16 mb-24 shadow-sm relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-3 gap-12">
            <div>
              <Target className="h-10 w-10 text-[#00C2E0] mb-6" strokeWidth={1.5} />
              <h3 className="text-[24px] font-semibold mb-4">Misión</h3>
              <p className="text-[#F8FCFF] text-[14px] leading-relaxed opacity-90">
                Democratizar el acceso a una orientación vocacional de calidad, utilizando tecnología de vanguardia para guiar a los jóvenes hacia su futuro profesional ideal.
              </p>
            </div>
            <div>
              <Lightbulb className="h-10 w-10 text-[#00C2E0] mb-6" strokeWidth={1.5} />
              <h3 className="text-[24px] font-semibold mb-4">Visión</h3>
              <p className="text-[#F8FCFF] text-[14px] leading-relaxed opacity-90">
                Ser la plataforma de descubrimiento vocacional líder en la región, donde cada estudiante encuentre su verdadera vocación sin limitaciones económicas.
              </p>
            </div>
            <div>
              <Heart className="h-10 w-10 text-[#00C2E0] mb-6" strokeWidth={1.5} />
              <h3 className="text-[24px] font-semibold mb-4">Propósito</h3>
              <p className="text-[#F8FCFF] text-[14px] leading-relaxed opacity-90">
                Creemos que un joven que elige la carrera correcta es un profesional feliz. Nuestro propósito es reducir la deserción universitaria y construir mejores futuros.
              </p>
            </div>
          </div>
        </div>

        {/* Por qué somos diferentes */}
        <div className="bg-white rounded-[20px] p-10 md:p-16 shadow-sm border border-[#D6E5EF]">
          <div className="flex items-center gap-4 mb-10">
            <Sparkles className="h-8 w-8 text-[#00C2E0]" />
            <h2 className="text-[32px] font-bold text-[#082A4A]">¿Por qué somos diferentes?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-[#4F6B85] mb-8 leading-relaxed text-[16px]">
                A diferencia de los cuestionarios vocacionales tradicionales de los años 90 que te encasillan en áreas rígidas, nosotros entendemos que el mundo ha cambiado. Las carreras de hoy son multidisciplinarias.
              </p>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-[#00C2E0] shrink-0" />
                  <span className="text-[14px] font-medium text-[#082A4A] leading-relaxed">Análisis dinámico impulsado por Inteligencia Artificial.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-[#00C2E0] shrink-0" />
                  <span className="text-[14px] font-medium text-[#082A4A] leading-relaxed">Exploración de carreras emergentes y habilidades blandas.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-[#00C2E0] shrink-0" />
                  <span className="text-[14px] font-medium text-[#082A4A] leading-relaxed">Cero sesgos tradicionales.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#F8FCFF] p-8 rounded-[20px] border border-[#D6E5EF] flex flex-col justify-center">
              <Database className="h-10 w-10 text-[#00C2E0] mb-6" strokeWidth={1.5} />
              <h3 className="font-semibold text-[20px] mb-3 text-[#082A4A]">Datos reales de Universidades</h3>
              <p className="text-[#4F6B85] text-[14px] leading-relaxed mb-8">
                No inventamos las recomendaciones. Nuestra base de datos está alimentada con planes de estudio, mallas curriculares y perfiles de egreso de las principales universidades.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white border border-[#D6E5EF] text-[#082A4A] text-[12px] font-semibold px-3 py-1.5 rounded-full">+50 Universidades</span>
                <span className="bg-white border border-[#D6E5EF] text-[#082A4A] text-[12px] font-semibold px-3 py-1.5 rounded-full">+100 Carreras</span>
                <span className="bg-[#EAF6FF] border border-[#00C2E0]/30 text-[#082A4A] text-[12px] font-semibold px-3 py-1.5 rounded-full">Datos actualizados</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
