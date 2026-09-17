import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, Target, Briefcase, MapPin, ChevronRight, School } from 'lucide-react';

interface CurriculumComparatorProps {
  careerName: string;
}

export default function CurriculumComparator({ careerName }: CurriculumComparatorProps) {
  
  // Función para obtener información dinámica (enfoque y cursos) basada en la carrera y la universidad
  const getDynamicUniInfo = (uniName: string, career: string) => {
    const c = career.toLowerCase();
    
    // Default info
    let focus = 'Práctico y Corporativo';
    let courses = ['Gestión de Proyectos', 'Desarrollo de Soluciones'];

    if (c.includes('software') || c.includes('sistemas') || c.includes('computación')) {
      if (uniName === 'UPN') { focus = 'Desarrollo y Arquitectura'; courses = ['Ingeniería de Requisitos', 'Arquitectura de Software']; }
      if (uniName === 'UTP') { focus = 'Tecnología Aplicada'; courses = ['Desarrollo de Aplicaciones', 'Inteligencia Artificial']; }
      if (uniName === 'UCV') { focus = 'Gestión TI y Emprendimiento'; courses = ['Gestión de Proyectos TI', 'Desarrollo Web']; }
      if (uniName === 'UCH') { focus = 'Fundamentos y Lógica'; courses = ['Algoritmia Avanzada', 'Sistemas Operativos']; }
      if (uniName === 'UCSUR') { focus = 'Innovación Tecnológica'; courses = ['Ciencia de Datos', 'Biotecnología Aplicada']; }
      if (uniName === 'USMP') { focus = 'Especialización y Calidad'; courses = ['Auditoría de Sistemas', 'Ingeniería de Software']; }
    } 
    else if (c.includes('psicología')) {
      if (uniName === 'UPN') { focus = 'Clínico y Organizacional'; courses = ['Pruebas Psicológicas', 'Comportamiento Organizacional']; }
      if (uniName === 'UTP') { focus = 'Psicología Experimental'; courses = ['Neuropsicología', 'Metodología de Investigación']; }
      if (uniName === 'UCV') { focus = 'Psicología Educativa y Social'; courses = ['Psicología del Desarrollo', 'Intervención Comunitaria']; }
      if (uniName === 'UCH') { focus = 'Investigación Psicológica'; courses = ['Bases Biológicas', 'Psicometría']; }
      if (uniName === 'UCSUR') { focus = 'Psicología Clínica y Salud'; courses = ['Psicofarmacología', 'Terapia Cognitivo-Conductual']; }
      if (uniName === 'USMP') { focus = 'Trayectoria y Prestigio Clínico'; courses = ['Psicopatología', 'Terapia Familiar']; }
    }
    else if (c.includes('negocios') || c.includes('administración') || c.includes('marketing')) {
      if (uniName === 'UPN') { focus = 'Liderazgo Corporativo'; courses = ['Gestión Estratégica', 'Finanzas Corporativas']; }
      if (uniName === 'UTP') { focus = 'Negocios Digitales'; courses = ['E-commerce', 'Business Intelligence']; }
      if (uniName === 'UCV') { focus = 'Emprendimiento y MYPEs'; courses = ['Creación de Empresas', 'Marketing Operativo']; }
      if (uniName === 'UCH') { focus = 'Economía e Investigación'; courses = ['Microeconomía', 'Investigación de Mercados']; }
      if (uniName === 'UCSUR') { focus = 'Negocios Internacionales'; courses = ['Comercio Exterior', 'Logística Internacional']; }
      if (uniName === 'USMP') { focus = 'Alta Dirección'; courses = ['Dirección Comercial', 'Planificación Estratégica']; }
    }
    else if (c.includes('diseño') || c.includes('comunicación')) {
      if (uniName === 'UPN') { focus = 'Diseño Digital y UX'; courses = ['Experiencia de Usuario', 'Diseño de Interfaces']; }
      if (uniName === 'UTP') { focus = 'Producción Multimedia'; courses = ['Animación 3D', 'Edición Audiovisual']; }
      if (uniName === 'UCV') { focus = 'Comunicación Corporativa'; courses = ['Identidad Visual', 'Relaciones Públicas']; }
      if (uniName === 'UCH') { focus = 'Diseño Editorial y Gráfico'; courses = ['Tipografía', 'Diagramación']; }
      if (uniName === 'UCSUR') { focus = 'Publicidad e Innovación'; courses = ['Dirección de Arte', 'Campañas Publicitarias']; }
      if (uniName === 'USMP') { focus = 'Ciencias de la Comunicación'; courses = ['Periodismo Digital', 'Producción Radial y Televisiva']; }
    }
    else if (c.includes('ingeniería') || c.includes('civil') || c.includes('industrial')) {
      if (uniName === 'UPN') { focus = 'Ingeniería Aplicada'; courses = ['Mecánica de Materiales', 'Gestión de Operaciones']; }
      if (uniName === 'UTP') { focus = 'Tecnología Industrial'; courses = ['Automatización', 'Procesos de Manufactura']; }
      if (uniName === 'UCV') { focus = 'Gestión de Construcción'; courses = ['Tecnología de Materiales', 'Costos y Presupuestos']; }
      if (uniName === 'UCH') { focus = 'Investigación y Desarrollo'; courses = ['Física Aplicada', 'Termodinámica']; }
      if (uniName === 'UCSUR') { focus = 'Ingeniería Sostenible'; courses = ['Impacto Ambiental', 'Eficiencia Energética']; }
      if (uniName === 'USMP') { focus = 'Ingeniería Civil y Estructural'; courses = ['Análisis Estructural', 'Ingeniería Antisísmica']; }
    }

    return { focus, courses };
  };

  const universityData = [
    { name: 'UPN', fullName: 'Universidad Privada del Norte', campus: 'Los Olivos / Comas', color: '#F48225', logo: '/assets/logo_upn.png' },
    { name: 'UTP', fullName: 'Universidad Tecnológica del Perú', campus: 'Lima Norte', color: '#E3003F', logo: '/assets/logo_utp.jpg' },
    { name: 'UCV', fullName: 'Universidad César Vallejo', campus: 'Lima Norte', color: '#00C2E0', logo: '/assets/logo_ucv.png' },
    { name: 'UCH', fullName: 'Universidad de Ciencias y Humanidades', campus: 'Los Olivos', color: '#18A86B', logo: '/assets/logo_uch.jpg' },
    { name: 'UCSUR', fullName: 'Universidad Científica del Sur', campus: 'Campus Norte', color: '#F4C95D', logo: '/assets/logo_ucsur.jpg' },
    { name: 'USMP', fullName: 'Universidad San Martín de Porres', campus: 'Lima Norte', color: '#E84A5F', logo: '/assets/logo_usmp.png' }
  ].map(uni => ({
    ...uni,
    focus: getDynamicUniInfo(uni.name, careerName).focus,
    keyCourses: getDynamicUniInfo(uni.name, careerName).courses
  }));

  return (
    <section className="w-full bg-white rounded-[24px] shadow-sm border border-[#D6E5EF] p-8 xl:p-12 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00C2E0]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      
      <div className="relative z-10 flex flex-col mb-10 gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F0F5F9] rounded-lg text-[11px] font-bold text-[#00C2E0] uppercase tracking-wider mb-2 border border-[#D6E5EF]/50 w-fit">
          <BookOpen className="w-4 h-4" /> Comparador Académico
        </div>
        <h2 className="text-[32px] sm:text-[36px] font-bold leading-tight text-[#082A4A]">
          ¿Cómo enseñan <span className="text-[#00C2E0]">{careerName}</span>?
        </h2>
        <p className="text-[#4F6B85] text-[15px] font-medium">
          Compara el enfoque curricular de las principales universidades y sedes de la zona.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-10">
        {universityData.map((uni, idx) => (
          <motion.div 
            key={uni.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="flex flex-col bg-white border border-[#D6E5EF] hover:border-[#00C2E0]/40 rounded-[20px] overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1"
          >
            {/* Cabecera / Fotografía */}
            <div className="h-28 relative bg-white border-b border-[#D6E5EF] flex items-center justify-center overflow-hidden p-6">
              <div className="absolute inset-0 opacity-5" style={{ backgroundColor: uni.color }} />
              {uni.logo ? (
                <div className="relative w-full h-full">
                  <Image src={uni.logo} alt={`Logo ${uni.name}`} fill className="object-contain drop-shadow-sm" />
                </div>
              ) : (
                <School className="w-12 h-12 text-[#4F6B85]/20" />
              )}
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="mb-4">
                <h3 className="text-[15px] font-bold text-[#082A4A] leading-tight mb-1">{uni.fullName}</h3>
                <div className="flex items-center gap-1.5 text-[12px] text-[#4F6B85] font-medium">
                  <MapPin className="w-3.5 h-3.5" /> {uni.campus}
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-[#4F6B85] mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" style={{ color: uni.color }} /> Enfoque
                  </h4>
                  <p className="text-[#082A4A] font-bold text-[13.5px] leading-snug">{uni.focus}</p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-[#4F6B85] mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" style={{ color: uni.color }} /> Cursos Clave
                  </h4>
                  <ul className="space-y-1">
                    {uni.keyCourses.map((course, i) => (
                      <li key={i} className="text-[12px] font-medium text-[#4F6B85] flex items-start gap-1.5">
                        <span className="font-bold mt-0.5" style={{ color: uni.color }}>•</span> {course}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chaski Footer */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-[#D6E5EF]/60">
        <div className="relative w-16 h-16 shrink-0">
          <Image src="/assets/chaski/chaski-2.png" alt="Chaski" fill className="object-contain" />
        </div>
        <p className="text-[15px] text-[#4F6B85] font-medium text-center sm:text-left max-w-lg">
          <strong className="text-[#082A4A] block sm:inline">No se trata solo de una universidad,</strong> sino del lugar donde comenzarás a construir tu futuro.
        </p>
      </div>

    </section>
  );
}
