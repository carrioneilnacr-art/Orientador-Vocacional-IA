import React from 'react';
import { Clock, CheckCircle, Sparkles } from 'lucide-react';

export function TestIntroStats() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-[#08BBD5]">
        <Clock size={16} />
        <span>3–5 minutos</span>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-[#18A86B]">
        <CheckCircle size={16} />
        <span>Sin respuestas correctas</span>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-[#08BBD5]">
        <Sparkles size={16} />
        <span>8 dimensiones evaluadas</span>
      </div>
    </div>
  );
}
