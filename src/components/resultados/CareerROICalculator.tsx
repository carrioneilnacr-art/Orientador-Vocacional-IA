'use client';

import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Clock,
  PiggyBank,
  CheckCircle,
} from 'lucide-react';

interface CareerROICalculatorProps {
  careerName: string;
  careerSlug: string;
}

interface UniversityCostPreset {
  name: string;
  monthlyFee: number;
  initialMatricula: number;
  expectedSalary: number;
}

const UNI_PRESETS: Record<string, UniversityCostPreset> = {
  'UPN (Los Olivos, Comas)': {
    name: 'UPN — Universidad Privada del Norte',
    monthlyFee: 890,
    initialMatricula: 300,
    expectedSalary: 2850,
  },
  'UTP (Lima Norte)': {
    name: 'UTP — Universidad Tecnológica del Perú',
    monthlyFee: 820,
    initialMatricula: 280,
    expectedSalary: 2750,
  },
  'UCV (Lima Norte)': {
    name: 'UCV — Universidad César Vallejo',
    monthlyFee: 650,
    initialMatricula: 250,
    expectedSalary: 2400,
  },
  'UCH (Los Olivos)': {
    name: 'UCH — Univ. de Ciencias y Humanidades',
    monthlyFee: 680,
    initialMatricula: 260,
    expectedSalary: 2500,
  },
  'UCSUR (Campus Norte)': {
    name: 'UCSUR — Univ. Científica del Sur',
    monthlyFee: 1350,
    initialMatricula: 450,
    expectedSalary: 3400,
  },
  'USMP (Comas)': {
    name: 'USMP — Univ. de San Martín de Porres',
    monthlyFee: 1250,
    initialMatricula: 400,
    expectedSalary: 3300,
  },
};

export default function CareerROICalculator({
  careerName,
  careerSlug,
}: CareerROICalculatorProps) {
  const [selectedUniKey, setSelectedUniKey] = useState<string>(
    'UPN (Los Olivos, Comas)'
  );
  const [hasScholarship, setHasScholarship] = useState<boolean>(false);
  const [scholarshipPercent, setScholarshipPercent] = useState<number>(20);

  const preset = UNI_PRESETS[selectedUniKey] || UNI_PRESETS['UPN (Los Olivos, Comas)'];

  // Cálculos Financieros
  const effectiveMonthlyFee = hasScholarship
    ? preset.monthlyFee * (1 - scholarshipPercent / 100)
    : preset.monthlyFee;

  // 10 ciclos académicos = 50 mensualidades (5 meses por ciclo x 10 ciclos)
  const totalTuitionCost = effectiveMonthlyFee * 50;
  // 10 matrículas (1 por ciclo)
  const totalMatriculaCost = preset.initialMatricula * 10;
  const totalInvestment = Math.round(totalTuitionCost + totalMatriculaCost);

  // Estimación de meses para recuperar la inversión
  // Suponiendo que el egresado destina el 40% de su sueldo neto a amortizar la inversión formativa
  const monthlySavingsForRepayment = preset.expectedSalary * 0.40;
  const monthsToPayback = Math.max(
    1,
    Math.round(totalInvestment / monthlySavingsForRepayment)
  );
  const yearsToPayback = (monthsToPayback / 12).toFixed(1);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-[#D6E5EF] shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EAF2F8]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F7FB] flex items-center justify-center text-[#00C2E0]">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F7FB] text-[#00C2E0] text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Finanzas Educativas para Familias</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#082A4A] tracking-tight">
              Calculadora de Retorno de Inversión (ROI Vocacional)
            </h3>
            <p className="text-xs sm:text-sm text-[#4F6B85]">
              Estima el costo total de la carrera en Lima Norte y el tiempo proyectado de recuperación económica.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F8FCFF] px-4 py-2 rounded-2xl border border-[#E1EDF3]">
          <GraduationCap className="w-4 h-4 text-[#00C2E0]" />
          <span className="text-xs font-bold text-[#082A4A]">{careerName}</span>
        </div>
      </div>

      {/* Controles de Configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selector de Universidad */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#082A4A] uppercase tracking-wider block">
            Universidad de Referencia (Sede Lima Norte):
          </label>
          <select
            value={selectedUniKey}
            onChange={(e) => setSelectedUniKey(e.target.value)}
            className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-[#D6E5EF] bg-white text-[#082A4A] focus:outline-none focus:ring-2 focus:ring-[#00C2E0]"
          >
            {Object.keys(UNI_PRESETS).map((key) => (
              <option key={key} value={key}>
                {UNI_PRESETS[key].name} ({key})
              </option>
            ))}
          </select>
          <span className="text-[11px] text-[#6A8AA3] block">
            Pensión mensual referencial: S/. {preset.monthlyFee} | Matrícula: S/. {preset.initialMatricula}
          </span>
        </div>

        {/* Toggle de Beca o Convenio Escolar */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#082A4A] uppercase tracking-wider block">
            Convenio de Colegio / Beca por Rendimiento:
          </label>
          <div className="p-3 bg-[#F8FCFF] border border-[#E1EDF3] rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="scholarship"
                checked={hasScholarship}
                onChange={(e) => setHasScholarship(e.target.checked)}
                className="w-4 h-4 text-[#00C2E0] rounded border-gray-300 focus:ring-[#00C2E0]"
              />
              <label htmlFor="scholarship" className="text-xs font-bold text-[#082A4A] cursor-pointer">
                Aplicar descuento por convenio escolar (20%)
              </label>
            </div>
            {hasScholarship && (
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                -20% Ahorro
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#6A8AA3] block">
            Muchos colegios en convenio ofrecen entre 10% y 25% de escala preferencial.
          </span>
        </div>
      </div>

      {/* Tarjetas de Resultados Financieros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-[#F8FCFF] border border-[#D6E5EF] rounded-2xl p-5 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6A8AA3] uppercase">
            <PiggyBank className="w-4 h-4 text-[#00C2E0]" />
            <span>Inversión Total (5 Años)</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#082A4A]">
            S/. {totalInvestment.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#6A8AA3]">
            10 ciclos académicos completos (50 cuotas)
          </p>
        </div>

        <div className="bg-[#F8FCFF] border border-[#D6E5EF] rounded-2xl p-5 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6A8AA3] uppercase">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Sueldo Inicial Estimado</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">
            S/. {preset.expectedSalary.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#6A8AA3]">
            Promedio mensual de egresado (MTPE / INEI)
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#082A4A] to-[#0D3B66] text-white rounded-2xl p-5 space-y-1 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00C2E0] uppercase">
            <Clock className="w-4 h-4 text-[#00C2E0]" />
            <span>Tiempo de Retorno (ROI)</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {yearsToPayback} Años
          </p>
          <p className="text-[11px] text-[#C4D9EB]">
            Aprox. {monthsToPayback} meses de amortización
          </p>
        </div>
      </div>

      {/* Diagnóstico y Consejo de Chaski para la Familia */}
      <div className="bg-[#E8F7FB]/60 border border-[#BCE4F2] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <CheckCircle className="w-5 h-5 text-[#00C2E0] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-[#0B2D4D]">
          <strong className="font-bold block">Recomendación Estratégica de Chaski:</strong>
          <p className="leading-relaxed text-[#355B78]">
            Con un retorno proyectado de <span className="font-bold text-[#082A4A]">{yearsToPayback} años</span>, {careerName} presenta un balance financiero altamente favorable en Lima Norte. Se sugiere a la familia postular en la modalidad de <strong>Tercio Superior</strong> o <strong>Convenio Escolar</strong> para asegurar escalas económicas preferenciales.
          </p>
        </div>
      </div>
    </div>
  );
}
