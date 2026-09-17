import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Building, Coins } from 'lucide-react';

interface LaborFieldProps {
  careerName: string;
}

export default function LaborField({ careerName }: LaborFieldProps) {
  return (
    <section className="w-full bg-white rounded-[24px] shadow-sm border border-[#D6E5EF] p-6 sm:p-10 mb-8 relative overflow-hidden">
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00C2E0]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#18A86B]/5 to-transparent rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F0F5F9] rounded-lg text-xs font-bold text-[#00C2E0] uppercase tracking-wider mb-3">
            <TrendingUp className="w-4 h-4" /> Proyección Profesional
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-[#082A4A]">
            ¿Cómo es el mercado para <span className="text-[#00C2E0]">{careerName}</span>?
          </h2>
          <p className="text-[#4F6B85] mt-2 max-w-2xl text-sm">
            Basado en datos actuales del mercado laboral peruano, especialmente en empresas formales y startups de rápido crecimiento.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        
        {/* Card 1: Puestos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#F8FCFF] border border-[#D6E5EF] rounded-2xl p-6"
        >
          <div className="w-10 h-10 rounded-xl bg-[#00C2E0]/10 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-[#00C2E0]" />
          </div>
          <h3 className="text-lg font-bold text-[#082A4A] mb-2">Roles Típicos</h3>
          <ul className="space-y-2 text-sm text-[#4F6B85]">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00C2E0]" /> Analista Junior / Trainee</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00C2E0]" /> Consultor Especializado</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00C2E0]" /> Líder de Proyecto / Senior</li>
          </ul>
        </motion.div>

        {/* Card 2: Sectores */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#F8FCFF] border border-[#D6E5EF] rounded-2xl p-6"
        >
          <div className="w-10 h-10 rounded-xl bg-[#18A86B]/10 flex items-center justify-center mb-4">
            <Building className="w-5 h-5 text-[#18A86B]" />
          </div>
          <h3 className="text-lg font-bold text-[#082A4A] mb-2">Sectores Top</h3>
          <ul className="space-y-2 text-sm text-[#4F6B85]">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#18A86B]" /> Banca, Finanzas y Seguros</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#18A86B]" /> Startups y Empresas Tecnológicas</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#18A86B]" /> Retail y E-commerce</li>
          </ul>
        </motion.div>

        {/* Card 3: Salarios */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#F8FCFF] border border-[#D6E5EF] rounded-2xl p-6 md:col-span-2 lg:col-span-1"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F4C95D]/20 flex items-center justify-center mb-4">
            <Coins className="w-5 h-5 text-[#E5A800]" />
          </div>
          <h3 className="text-lg font-bold text-[#082A4A] mb-4">Ingreso Promedio Mensual</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-[#4F6B85] mb-1">
                <span>Recién Egresado (Junior)</span>
                <span className="font-bold text-[#082A4A]">S/ 1,800 - S/ 2,500</span>
              </div>
              <div className="w-full bg-[#EAF2F8] rounded-full h-1.5">
                <div className="bg-[#F4C95D] h-1.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-[#4F6B85] mb-1">
                <span>Con Experiencia (Senior)</span>
                <span className="font-bold text-[#082A4A]">S/ 3,500 - S/ 6,000+</span>
              </div>
              <div className="w-full bg-[#EAF2F8] rounded-full h-1.5">
                <div className="bg-[#00C2E0] h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] text-[#4F6B85]/80 mt-4 leading-tight">
            * Valores referenciales basados en el observatorio Ponte en Carrera y ofertas actuales en el mercado formal peruano.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
