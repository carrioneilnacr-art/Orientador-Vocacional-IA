import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Briefcase } from 'lucide-react';

interface CurriculumComparatorProps {
  careerName: string;
}

export default function CurriculumComparator({ careerName }: CurriculumComparatorProps) {
  // Datos mock para el comparador. Idealmente esto se llenaría desde la BD.
  const universityData = [
    {
      name: 'UPN',
      campus: 'Los Olivos / Comas',
      focus: 'Práctico y Corporativo',
      keyCourses: ['Gestión de Proyectos', 'Desarrollo de Soluciones', 'Liderazgo'],
      color: '#F48225', // Naranja
    },
    {
      name: 'UTP',
      campus: 'Lima Norte',
      focus: 'Tecnología Aplicada',
      keyCourses: ['Integración Tecnológica', 'Innovación Práctica', 'Sistemas'],
      color: '#E3003F', // Rojo
    },
    {
      name: 'UCV',
      campus: 'Lima Norte',
      focus: 'Gestión y Emprendimiento',
      keyCourses: ['Formación Emprendedora', 'Gestión de Calidad', 'Sostenibilidad'],
      color: '#00C2E0', // Cyan (Ajustado para dark theme)
    },
    {
      name: 'UCH',
      campus: 'Los Olivos',
      focus: 'Investigación y Humanidades',
      keyCourses: ['Fundamentos de Software', 'Metodología Científica', 'Ética'],
      color: '#18A86B', // Verde
    },
    {
      name: 'UCSUR',
      campus: 'Campus Norte',
      focus: 'Innovación y Sostenibilidad',
      keyCourses: ['Biotecnología', 'Desarrollo Sostenible', 'Gestión Moderna'],
      color: '#F4C95D', // Amarillo/Dorado
    },
    {
      name: 'USMP',
      campus: 'Lima Norte',
      focus: 'Especialización y Prestigio',
      keyCourses: ['Seminario de Especialidad', 'Alta Dirección', 'Prácticas Pro.'],
      color: '#E84A5F', // Rojo Coral
    }
  ];

  return (
    <section className="w-full bg-gradient-to-br from-[#082A4A] to-[#0A3459] rounded-[24px] shadow-lg border border-[#00C2E0]/20 p-6 sm:p-10 mb-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2E0]/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#18A86B]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00C2E0]/20 border border-[#00C2E0]/30 rounded-lg text-xs font-bold text-[#00C2E0] uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" /> Comparador Académico
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            ¿Cómo enseñan <span className="text-[#00C2E0]">{careerName}</span>?
          </h2>
          <p className="text-[#A2C0D9] mt-2 max-w-2xl text-sm">
            Compara el enfoque curricular de las principales universidades y sedes de la zona.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {universityData.map((uni, idx) => (
          <motion.div 
            key={uni.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="flex flex-col bg-white/5 border border-white/10 hover:border-white/30 rounded-2xl p-5 relative overflow-hidden group backdrop-blur-sm transition-all"
          >
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: uni.color }} />
            
            <div className="flex items-center justify-between mb-4 pl-3">
              <h3 className="text-xl font-bold text-white">{uni.name}</h3>
              <span className="text-[10px] font-medium px-2 py-1 bg-white/10 rounded-md border border-white/10 text-[#A2C0D9]">
                {uni.campus}
              </span>
            </div>

            <div className="pl-3 flex-1 flex flex-col gap-4">
              <div>
                <h4 className="text-[10px] uppercase tracking-wider font-bold text-[#A2C0D9] mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" style={{ color: uni.color }} /> Enfoque
                </h4>
                <p className="text-white font-semibold text-sm leading-snug">{uni.focus}</p>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-wider font-bold text-[#A2C0D9] mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" style={{ color: uni.color }} /> Cursos Clave
                </h4>
                <ul className="space-y-1.5">
                  {uni.keyCourses.map((course, i) => (
                    <li key={i} className="text-xs text-[#A2C0D9] flex items-start gap-1.5">
                      <span className="font-bold mt-0.5" style={{ color: uni.color }}>•</span> {course}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
