import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building, GraduationCap, Briefcase, Trophy, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LaborFieldProps {
  careerName: string;
}

export default function LaborField({ careerName }: LaborFieldProps) {
  // Generar datos dinámicos basados en la carrera
  const getLaborMarketData = (name: string) => {
    const career = name.toLowerCase();
    
    if (career.includes("software") || career.includes("computación") || career.includes("sistemas")) {
      return {
        roles: [
          { title: "Desarrollador Junior / Trainee", desc: "Primeros proyectos y resolución de bugs." },
          { title: "Ingeniero de Software Semi-Senior", desc: "Arquitectura de aplicaciones y mentoría." },
          { title: "Tech Lead / Arquitecto Cloud", desc: "Liderazgo técnico y decisiones críticas." }
        ],
        salaries: { junior: "S/ 2,500 - S/ 3,500", senior: "S/ 6,000 - S/ 12,000+" },
        sectors: ["Startups y Big Tech", "Banca y Fintech", "Consultoría TI y Software Factory"],
        message: "La tecnología avanza rápido, pero tu capacidad de adaptarte y liderar te llevará a la cima."
      };
    }
    
    if (career.includes("psicología")) {
      return {
        roles: [
          { title: "Asistente Psicológico", desc: "Apoyo en evaluaciones y dinámicas iniciales." },
          { title: "Psicólogo Especialista", desc: "Consultas clínicas o selección de talento clave." },
          { title: "Jefe de Bienestar / Director Clínico", desc: "Estrategias organizacionales o dirección clínica." }
        ],
        salaries: { junior: "S/ 1,500 - S/ 2,200", senior: "S/ 3,500 - S/ 6,000+" },
        sectors: ["Clínicas y Hospitales", "Recursos Humanos y Corporativo", "Consultorios Privados"],
        message: "La empatía es tu mayor herramienta; mientras más vidas toques, más lejos llegarás."
      };
    }
    
    if (career.includes("negocios") || career.includes("administración") || career.includes("marketing")) {
      return {
        roles: [
          { title: "Analista Comercial / Trainee", desc: "Investigación de mercado y reportes." },
          { title: "Coordinador de Estrategia", desc: "Gestión de campañas y equipos directos." },
          { title: "Gerente de Marca / Director", desc: "Liderazgo de unidades de negocio completas." }
        ],
        salaries: { junior: "S/ 1,800 - S/ 2,800", senior: "S/ 5,000 - S/ 9,000+" },
        sectors: ["Retail y Consumo Masivo", "Agencias de Publicidad", "Emprendimiento Propio"],
        message: "El mercado cambia constantemente; quien entiende al consumidor, domina el juego."
      };
    }
    
    if (career.includes("diseño") || career.includes("comunicación") || career.includes("publicidad")) {
      return {
        roles: [
          { title: "Diseñador Junior / Asistente", desc: "Creación de piezas gráficas y apoyo creativo." },
          { title: "Director de Arte / Especialista", desc: "Conceptos visuales y liderazgo creativo." },
          { title: "Director Creativo Senior", desc: "Campañas globales y estrategia de marca." }
        ],
        salaries: { junior: "S/ 1,500 - S/ 2,500", senior: "S/ 4,000 - S/ 7,000+" },
        sectors: ["Agencias de Diseño Creativo", "Medios de Comunicación", "Estudios de Animación"],
        message: "Tu creatividad no tiene límites; el mundo necesita nuevas formas de ver la realidad."
      };
    }

    if (career.includes("ingeniería") || career.includes("civil") || career.includes("industrial")) {
      return {
        roles: [
          { title: "Asistente de Ingeniería / CAD", desc: "Planos, procesos iniciales y soporte." },
          { title: "Ingeniero de Proyectos", desc: "Supervisión de obras y optimización de procesos." },
          { title: "Gerente de Operaciones", desc: "Liderazgo de megaproyectos y rentabilidad." }
        ],
        salaries: { junior: "S/ 2,000 - S/ 3,000", senior: "S/ 5,500 - S/ 10,000+" },
        sectors: ["Minería y Construcción", "Logística y Operaciones", "Industria Manufacturera"],
        message: "Construyes el mundo en el que vivimos; cada proyecto es un legado duradero."
      };
    }
    
    // Default fallback
    return {
      roles: [
        { title: "Analista Junior / Trainee", desc: "Primeras experiencias formales." },
        { title: "Consultor Especializado", desc: "Manejo de proyectos y clientes." },
        { title: "Líder de Proyecto / Senior", desc: "Liderazgo de equipos y estrategia." }
      ],
      salaries: { junior: "S/ 1,800 - S/ 2,500", senior: "S/ 3,500 - S/ 6,000+" },
      sectors: ["Banca, Finanzas y Seguros", "Startups y Empresas Tecnológicas", "Retail y E-commerce"],
      message: "Tu capacidad de adaptarte y especializarte te abrirá puertas increíbles en cualquier sector."
    };
  };

  const data = getLaborMarketData(careerName);

  return (
    <section className="w-full bg-white rounded-[24px] shadow-sm border border-[#D6E5EF] p-8 lg:p-12 mb-8 relative overflow-hidden">
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00C2E0]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#18A86B]/5 to-transparent rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F0F5F9] rounded-lg text-[11px] font-bold text-[#00C2E0] uppercase tracking-wider mb-4 border border-[#D6E5EF]/50">
            <TrendingUp className="w-4 h-4" /> Proyección Profesional
          </div>
          <h2 className="text-[32px] sm:text-[36px] font-bold leading-tight text-[#082A4A]">
            Tu camino profesional en <span className="text-[#00C2E0]">{careerName}</span>
          </h2>
          <p className="text-[#4F6B85] mt-3 max-w-2xl text-[15px] font-medium">
            Visualiza cómo crecerás a lo largo de los años. Basado en datos actuales del mercado laboral peruano para tu área.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 relative z-10">
        
        {/* Timeline - Tu Camino Profesional */}
        <div>
          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#D6E5EF] before:via-[#00C2E0] before:to-[#18A86B]">
            
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#F8FCFF] text-[#4F6B85] shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-[16px] bg-[#F8FCFF] border border-[#D6E5EF] shadow-sm">
                <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">Estudiante</h4>
                <p className="text-[13px] text-[#4F6B85]">Formación y primeros proyectos académicos.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#00C2E0] text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-[16px] bg-white border border-[#00C2E0]/40 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#00C2E0]/10 rounded-bl-full" />
                <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">{data.roles[0].title}</h4>
                <p className="text-[13px] text-[#4F6B85] mb-2">{data.roles[0].desc}</p>
                <div className="inline-block bg-[#EAF6FF] text-[#00C2E0] text-[12px] font-bold px-2.5 py-1 rounded-[6px]">
                  {data.salaries.junior}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#00C2E0] text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-[16px] bg-white border border-[#D6E5EF] shadow-sm">
                <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">{data.roles[1].title}</h4>
                <p className="text-[13px] text-[#4F6B85]">{data.roles[1].desc}</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#18A86B] text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-[16px] bg-[#E8F8F1] border border-[#18A86B]/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#18A86B]/10 rounded-bl-full" />
                <h4 className="font-bold text-[#082A4A] text-[15px] mb-1">{data.roles[2].title}</h4>
                <p className="text-[13px] text-[#4F6B85] mb-2">{data.roles[2].desc}</p>
                <div className="inline-block bg-white text-[#18A86B] border border-[#18A86B]/20 text-[12px] font-bold px-2.5 py-1 rounded-[6px] shadow-sm">
                  {data.salaries.senior}
                </div>
              </div>
            </div>

          </div>
          
          <p className="text-[11px] text-[#4F6B85]/80 mt-6 text-center italic">
            * Valores referenciales basados en el observatorio Ponte en Carrera.
          </p>
        </div>

        {/* Right side: Sectores Top */}
        <div className="flex flex-col justify-center">
          <h3 className="text-[20px] font-bold text-[#082A4A] mb-5 flex items-center gap-2">
            Sectores Top para ti <Building className="w-5 h-5 text-[#00C2E0]" />
          </h3>
          
          <div className="space-y-4">
            {data.sectors.map((sector, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-[#D6E5EF] rounded-[16px] shadow-sm hover:border-[#00C2E0]/50 hover:shadow-md transition-all group">
                <div className="bg-[#EAF6FF] text-[#00C2E0] p-2 rounded-full group-hover:bg-[#00C2E0] group-hover:text-white transition-colors shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#082A4A] text-[15px]">{sector}</h4>
              </div>
            ))}
          </div>
          
          {/* Tarjeta motivacional pequeña */}
          <div className="mt-8 bg-gradient-to-r from-[#082A4A] to-[#0A3D6B] p-5 rounded-[20px] text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <h4 className="font-bold text-[16px] mb-1">El crecimiento nunca se detiene</h4>
            <p className="text-[13px] text-white/80 leading-relaxed">
              {data.message}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
