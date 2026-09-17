import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Briefcase } from 'lucide-react';

interface CurriculumComparatorProps {
  careerName: string;
}

export default function CurriculumComparator({ careerName }: CurriculumComparatorProps) {
  // Datos mock para el comparador. Idealmente esto se llenaría desde la BD,
  // pero para la demostración y utilidad de la zona norte usamos estos perfiles.
  const universityData = [
    {
      name: 'UPN',
      campus: 'Los Olivos / Comas',
      focus: 'Enfoque Práctico y Corporativo',
      keyCourses: ['Gestión de Proyectos', 'Desarrollo de Soluciones', 'Taller de Liderazgo'],
      color: '#F48225', // Naranja UPN
    },
    {
      name: 'UTP',
      campus: 'Lima Norte',
      focus: 'Tecnología Aplicada y Laboratorios',
      keyCourses: ['Integración Tecnológica', 'Innovación Práctica', 'Sistemas Aplicados'],
      color: '#E3003F', // Rojo UTP
    },
    {
      name: 'UCV',
      campus: 'Lima Norte',
      focus: 'Gestión y Emprendimiento',
      keyCourses: ['Formación Emprendedora', 'Gestión de Calidad', 'Desarrollo Sostenible'],
      color: '#13215C', // Azul UCV
    }
  ];

  return (
    <section className="w-full bg-white rounded-[24px] shadow-sm border border-[#D6E5EF] p-6 sm:p-10 mb-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#00C2E0]/10 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F0F5F9] rounded-lg text-xs font-bold text-[#00C2E0] uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" /> Comparador Académico
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#082A4A] leading-tight">
            ¿Cómo enseñan <span className="text-[#00C2E0]">{careerName}</span>?
          </h2>
          <p className="text-[#4F6B85] mt-2 max-w-2xl">
            Cada universidad tiene un enfoque distinto en su malla curricular. Descubre cuál encaja mejor con tu estilo de aprendizaje en las sedes de Lima Norte.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {universityData.map((uni, idx) => (
          <motion.div 
            key={uni.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="flex flex-col bg-[#F8FCFF] rounded-2xl border border-[#D6E5EF] hover:border-[#00C2E0]/40 hover:shadow-md transition-all p-5 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: uni.color }} />
            
            <div className="flex items-center justify-between mb-4 pl-3">
              <h3 className="text-xl font-bold text-[#082A4A]">{uni.name}</h3>
              <span className="text-xs font-medium px-2 py-1 bg-white rounded-md border border-[#EAF2F8] text-[#4F6B85]">
                {uni.campus}
              </span>
            </div>

            <div className="pl-3 flex-1 flex flex-col gap-4">
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-[#4F6B85] mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#00C2E0]" /> Enfoque Principal
                </h4>
                <p className="text-[#082A4A] font-semibold text-sm leading-snug">{uni.focus}</p>
              </div>

              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-[#4F6B85] mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#00C2E0]" /> Cursos Destacados
                </h4>
                <ul className="space-y-1.5">
                  {uni.keyCourses.map((course, i) => (
                    <li key={i} className="text-xs text-[#4F6B85] flex items-start gap-1.5">
                      <span className="text-[#00C2E0] font-bold mt-0.5">•</span> {course}
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
