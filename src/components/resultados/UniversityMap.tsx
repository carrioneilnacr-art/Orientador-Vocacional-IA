import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';

export function UniversityMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D4D] mb-1.5">
          Tu mapa universitario
        </h2>
        <p className="text-[#466579] text-[15px]">
          Explora universidades cercanas y descubre nuevas oportunidades.
        </p>
      </div>

      <div className="bg-white rounded-[28px] border border-[#D9EAF2] overflow-hidden shadow-[0_10px_40px_rgba(11,45,77,0.06)] grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
        
        {/* Mock Map Area */}
        <div className="bg-[#E1EDF3] relative min-h-[350px] lg:min-h-[450px] flex items-center justify-center p-6">
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#08BBD5 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-[#466579] opacity-70">
             <MapPin className="w-12 h-12 mb-3 text-[#0B2D4D]" />
             <p className="font-bold text-lg text-[#0B2D4D]">Mapa Interactivo</p>
             <p className="text-sm">Exploración geográfica de campus</p>
          </div>
          
          {/* Mock Markers */}
          <div className="absolute top-[30%] left-[35%] w-4 h-4 bg-[#18A86B] rounded-full ring-4 ring-white shadow-md"></div>
          <div className="absolute top-[50%] left-[55%] w-4 h-4 bg-[#08BBD5] rounded-full ring-4 ring-white shadow-md"></div>
          <div className="absolute bottom-[35%] right-[25%] w-4 h-4 bg-[#08BBD5] rounded-full ring-4 ring-white shadow-md"></div>
        </div>

        {/* Universities List */}
        <div className="p-6 lg:p-8 flex flex-col h-full border-t lg:border-t-0 lg:border-l border-[#D9EAF2]">
          <h3 className="font-bold text-lg text-[#0B2D4D] mb-5">Universidades destacadas</h3>
          
          <div className="space-y-3 flex-1">
            {['Universidad Peruana de Ciencias Aplicadas (UPC)', 'Universidad Nacional de Ingeniería (UNI)', 'Pontificia Universidad Católica del Perú (PUCP)'].map((uni, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-[#D9EAF2] hover:border-[#08BBD5] hover:bg-[#F5FAFD] transition-colors cursor-pointer group">
                <span className="font-bold text-[13px] text-[#0B2D4D] pr-4">{uni}</span>
                <Navigation className="w-4 h-4 text-[#C8DCE6] group-hover:text-[#08BBD5] shrink-0" />
              </div>
            ))}
          </div>
          
          <Link href="/universidades" className="mt-6 w-full flex items-center justify-center py-3.5 bg-white border border-[#D9EAF2] text-[#0B2D4D] font-bold text-sm rounded-[14px] hover:bg-[#F5FAFD] transition-colors shadow-sm">
            Ver todas las universidades
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
