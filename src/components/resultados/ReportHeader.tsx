"use client";

import Link from "next/link";
import { BrainCircuit, RefreshCcw, Download } from "lucide-react";

interface ReportHeaderProps {
  isDownloading: boolean;
  onDownload: () => void;
  onRestart: () => void;
}

export default function ReportHeader({ isDownloading, onDownload, onRestart }: ReportHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#D6E5EF] no-print no-pdf">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-[10px] bg-[#EAF6FF] flex items-center justify-center text-[#00C2E0] group-hover:bg-[#00C2E0] group-hover:text-white transition-colors">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <span className="font-bold text-[17px] text-[#082A4A] tracking-tight">Inicio</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 text-[13.5px] font-medium border border-[#D6E5EF] rounded-[12px] px-4 py-2.5 hover:bg-[#F8FCFF] text-[#082A4A] transition-colors cursor-pointer"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>Volver a empezar</span>
          </button>
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 text-[13.5px] font-semibold bg-[#00C2E0] hover:bg-[#0EA5C6] text-white rounded-[12px] px-5 py-2.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-[#00C2E0]/20"
          >
            <Download className="h-4 w-4" />
            <span>{isDownloading ? "Preparando PDF..." : "Descargar PDF"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
