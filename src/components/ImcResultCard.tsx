import React, { useState } from 'react';
import { Printer, Copy, Check, Droplets, Target, Award, HeartPulse, Info, FileSpreadsheet } from 'lucide-react';
import { ImcClassificationInfo, IdealWeightRange } from '../types';
import { ImcGauge } from './ImcGauge';
import { calculateIdealWeightRange, calculateWaterIntake } from '../utils/imc';

interface ImcResultCardProps {
  imc: number;
  name: string;
  weight: number;
  height: number;
  classificationInfo: ImcClassificationInfo;
  onPrint: () => void;
}

export const ImcResultCard: React.FC<ImcResultCardProps> = ({
  imc,
  name,
  weight,
  height,
  classificationInfo,
  onPrint
}) => {
  const [copied, setCopied] = useState(false);
  const idealRange = calculateIdealWeightRange(height, weight);
  const water = calculateWaterIntake(weight);

  const handleCopySummary = () => {
    const summaryText = `Avaliação de IMC - ${name}\nPeso: ${weight} kg | Altura: ${(height / 100).toFixed(2)} m\nIMC Calculado: ${imc} kg/m² (${classificationInfo.label})\nFaixa de Peso Ideal: ${idealRange.minWeight} kg a ${idealRange.maxWeight} kg\nIngestão Hídrica Recomendada: ${water.liters} L/dia`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-7 transition-all flex flex-col justify-between">
      <div>
        {/* Top bar: Classification badge */}
        <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Resultado para {name || 'Paciente'}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight font-display">
                {imc.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-stone-500">
                kg/m²
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-bold rounded-full border shadow-2xs ${classificationInfo.badgeClass}`}>
              {classificationInfo.label}
            </span>
            <p className="text-[11px] text-stone-500 mt-1 max-w-[170px] truncate">
              {classificationInfo.riskLevel.split('(')[0]}
            </p>
          </div>
        </div>

        {/* Visual Gauge Bar */}
        <div className="py-2">
          <ImcGauge imc={imc} classificationKey={classificationInfo.key} />
        </div>

        {/* Diagnostic Summary Quote */}
        <div className={`p-3.5 rounded-xl border ${classificationInfo.bgClass} ${classificationInfo.borderClass} mb-5`}>
          <p className={`text-xs sm:text-sm font-medium ${classificationInfo.textClass} leading-relaxed`}>
            {classificationInfo.summary}
          </p>
        </div>

        {/* Metrics Grid: Ideal Weight & Water Intake */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Ideal Weight Card */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Faixa Saudável (OMS)
              </p>
              <p className="text-sm font-bold text-stone-900 mt-0.5">
                {idealRange.minWeight} kg – {idealRange.maxWeight} kg
              </p>
              <p className="text-[11px] text-stone-600 mt-1">
                {idealRange.status === 'normal' ? (
                  <span className="text-emerald-700 font-semibold">✓ Peso atual dentro da meta</span>
                ) : idealRange.status === 'above' ? (
                  <span className="text-amber-800 font-semibold">Excedente: {idealRange.weightDifference} kg</span>
                ) : (
                  <span className="text-amber-800 font-semibold">Abaixo: {idealRange.weightDifference} kg</span>
                )}
              </p>
            </div>
          </div>

          {/* Water Intake Card */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Hidratação Mínima
              </p>
              <p className="text-sm font-bold text-stone-900 mt-0.5">
                {water.liters} Litros / dia
              </p>
              <p className="text-[11px] text-stone-600 mt-1">
                Aprox. <span className="font-semibold">{water.glasses} copos</span> de 250ml
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Print & Copy */}
      <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-2.5">
        <button
          id="btn-print-report"
          type="button"
          onClick={onPrint}
          className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-teal-300" />
          <span>Imprimir Laudo Clínico</span>
        </button>

        <button
          id="btn-copy-summary"
          type="button"
          onClick={handleCopySummary}
          className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          title="Copiar resumo para a área de transferência"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
