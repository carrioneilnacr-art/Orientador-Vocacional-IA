import React from 'react';
import { ArrowDownToLine } from 'lucide-react';

interface ResultsHeaderProps {
  onRestart: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export function ResultsHeader({ onRestart, onDownload, isDownloading }: ResultsHeaderProps) {
  return (
    <header className="w-full bg-[#F5FAFD] border-b border-[#D9EAF2] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#08BBD5] flex items-center justify-center shrink-0">
             <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-[#0B2D4D] text-lg">Orientador Vocacional</span>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRestart}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#D9EAF2] rounded-[14px] text-[#0B2D4D] font-bold text-[13px] hover:bg-[#F5FAFD] transition-colors"
          >
            Volver a empezar
          </button>
          
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#08BBD5] hover:bg-[#07AFC8] text-white rounded-[14px] font-bold text-[13px] transition-colors shadow-sm disabled:opacity-50"
          >
            {isDownloading ? 'Generando...' : 'Descargar PDF'}
            <ArrowDownToLine className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </header>
  );
}
