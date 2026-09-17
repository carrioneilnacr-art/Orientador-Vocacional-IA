import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Building2, CheckCircle, GraduationCap, MapPin, Sparkles } from "lucide-react";

const UNIVERSITIES = [
  {
    id: "utp",
    name: "Universidad Tecnológica del Perú",
    acronym: "UTP",
    logoUrl: "/assets/logo_utp.jpg",
    fallbackLogo: "/assets/chaski/chaski-10.png",
    slogan: "Educación tecnológica de alta calidad",
    features: ["Infraestructura moderna", "Múltiples sedes", "Bolsa de trabajo top"],
    color: "#D3153A",
    bg: "rgba(211,21,58,0.06)",
  },
  {
    id: "upn",
    name: "Universidad Privada del Norte",
    acronym: "UPN",
    logoUrl: "/assets/logo_upn.png",
    fallbackLogo: "/assets/chaski/chaski-10.png",
    slogan: "Lleva tu potencial al máximo",
    features: ["Internacionalización", "Calidad acreditada", "Empleabilidad"],
    color: "#E29724",
    bg: "rgba(226,151,36,0.06)",
  },
  {
    id: "ucv",
    name: "Universidad César Vallejo",
    acronym: "UCV",
    logoUrl: "/assets/logo_ucv.png",
    fallbackLogo: "/assets/chaski/chaski-10.png",
    slogan: "Para los que quieren salir adelante",
    features: ["Amplia cobertura nacional", "Accesibilidad", "Convenios"],
    color: "#18325B",
    bg: "rgba(24,50,91,0.06)",
  },
  {
    id: "usmp",
    name: "Univ. de San Martín de Porres",
    acronym: "USMP",
    logoUrl: "/assets/logo_usmp.png",
    fallbackLogo: "/assets/chaski/chaski-10.png",
    slogan: "Ama lo que haces. Aprende cómo.",
    features: ["Trayectoria y prestigio", "Red global", "Investigación científica"],
    color: "#BE0F34",
    bg: "rgba(190,15,52,0.06)",
  },
  {
    id: "ucsur",
    name: "Universidad Científica del Sur",
    acronym: "UCSUR",
    logoUrl: "/assets/logo_ucsur.jpg",
    fallbackLogo: "/assets/chaski/chaski-10.png",
    slogan: "Mejoras tú, mejora el mundo",
    features: ["Enfoque humanista", "Sostenibilidad", "Ciencias y salud"],
    color: "#0055A5",
    bg: "rgba(0,85,165,0.06)",
  },
  {
    id: "uch",
    name: "Universidad de Ciencias y Humanidades",
    acronym: "UCH",
    logoUrl: "/assets/logo_uch.jpg",
    fallbackLogo: "/assets/chaski/chaski-10.png",
    slogan: "Formación integral para la vida",
    features: ["Innovación educativa", "Arte y cultura", "Formación ética"],
    color: "#0067A1",
    bg: "rgba(0,103,161,0.06)",
  },
];

export default function UniversidadesPage() {
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#08BBD5]/10 rounded-full blur-[100px] -z-10" />
          
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white border border-[#E1EDF3] shadow-sm">
            <Building2 className="w-4 h-4 text-[#18A86B]" />
            <span className="text-[12px] font-bold tracking-widest text-[#18A86B] uppercase">
              Red Educativa Integrada
            </span>
          </div>

          <h1 className="text-[40px] md:text-[56px] font-extrabold tracking-tight mb-6 text-[#0B2D4D] leading-tight">
            Descubre dónde <br className="hidden md:block" />
            <span style={{ color: "#08BBD5" }}>construir tu futuro</span>
          </h1>
          
          <p className="text-[16px] md:text-[19px] text-[#355B78] max-w-2xl mx-auto font-medium leading-relaxed">
            Nuestra inteligencia artificial cruza tu perfil vocacional con la oferta académica de las mejores universidades del Perú. Conoce nuestras instituciones aliadas y mapeadas en el sistema.
          </p>
        </div>

        {/* Grid de Universidades */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {UNIVERSITIES.map((uni) => (
            <div
              key={uni.id}
              className="group bg-white rounded-[24px] p-8 border border-[#E1EDF3] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(8,43,77,0.08)] hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Resplandor decorativo de color por universidad */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-bl-full -z-10 opacity-30 transition-opacity group-hover:opacity-60"
                style={{ background: uni.bg }}
              />

              {/* Logo container */}
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-[#E1EDF3] flex items-center justify-center p-2.5 mb-6 relative overflow-hidden group-hover:scale-105 transition-transform">
                <Image
                  src={uni.logoUrl}
                  alt={`Logo ${uni.name}`}
                  fill
                  className="object-contain p-2"
                  unoptimized // Para cargar dominios externos directamente sin config previa
                />
              </div>

              {/* Info */}
              <h2 className="text-[20px] font-bold text-[#0B2D4D] leading-tight mb-2 pr-4">
                {uni.name}
              </h2>
              <p className="text-[14px] font-semibold mb-6" style={{ color: uni.color }}>
                {uni.slogan}
              </p>

              <div className="space-y-3">
                {uni.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#18A86B]" />
                    <span className="text-[#355B78] text-[14px] font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Call to action */}
        <div className="mt-24 text-center bg-white rounded-[32px] p-12 border border-[#E1EDF3] shadow-sm relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#08BBD5]/10 rounded-full blur-3xl" />
          <h2 className="text-[28px] font-bold text-[#0B2D4D] mb-4 relative z-10">¿Listo para encontrar tu match perfecto?</h2>
          <p className="text-[#355B78] mb-8 max-w-lg mx-auto relative z-10">
            Realiza la evaluación y Chaski te recomendará la universidad y carrera ideales para tu perfil.
          </p>
          <Link
            href="/cuestionario"
            className="inline-flex items-center gap-2 font-bold text-white transition-transform hover:-translate-y-0.5 relative z-10"
            style={{
              background: "#08BBD5",
              padding: "16px 32px",
              borderRadius: "14px",
              boxShadow: "0 6px 20px rgba(8,187,213,0.3)",
            }}
          >
            Iniciar Orientación
            <Sparkles className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </main>
    </div>
  );
}
