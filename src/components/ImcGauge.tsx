import React from 'react';
import { ImcClassification } from '../types';

interface ImcGaugeProps {
  imc: number;
  classificationKey: ImcClassification;
}

export const ImcGauge: React.FC<ImcGaugeProps> = ({ imc, classificationKey }) => {
  // Scale IMC from range 15 to 45 for visual position percentage
  // 15 => 0%, 45 => 100%
  const minScale = 15;
  const maxScale = 45;
  const clampedImc = Math.min(Math.max(imc, minScale), maxScale);
  const positionPercent = ((clampedImc - minScale) / (maxScale - minScale)) * 100;

  const zones = [
    { label: '< 18.5', name: 'Abaixo', key: 'abaixo_peso', color: 'bg-amber-400', width: '11.6%' },
    { label: '18.5 - 24.9', name: 'Normal', key: 'peso_normal', color: 'bg-emerald-500', width: '21.3%' },
    { label: '25 - 29.9', name: 'Sobrepeso', key: 'sobrepeso', color: 'bg-orange-400', width: '16.6%' },
    { label: '30 - 34.9', name: 'Grau I', key: 'obesidade_grau_1', color: 'bg-red-400', width: '16.6%' },
    { label: '35 - 39.9', name: 'Grau II', key: 'obesidade_grau_2', color: 'bg-rose-500', width: '16.6%' },
    { label: '≥ 40', name: 'Grau III', key: 'obesidade_grau_3', color: 'bg-purple-600', width: '17.3%' },
  ];

  return (
    <div className="w-full my-4">
      {/* Gauge bar */}
      <div className="relative pt-6 pb-2">
        {/* Needle / Marker */}
        {imc > 0 && (
          <div
            className="absolute top-0 transition-all duration-500 transform -translate-x-1/2 flex flex-col items-center z-10"
            style={{ left: `${positionPercent}%` }}
          >
            <div className="bg-stone-900 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
              {imc.toFixed(1)}
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-stone-900"></div>
          </div>
        )}

        {/* Multi-segment colored progress bar */}
        <div className="h-3.5 w-full flex rounded-full overflow-hidden bg-stone-200 shadow-inner">
          {zones.map((zone) => (
            <div
              key={zone.key}
              style={{ width: zone.width }}
              className={`${zone.color} h-full transition-opacity duration-300 ${
                classificationKey === zone.key ? 'opacity-100 ring-2 ring-stone-900 ring-offset-1 z-1' : 'opacity-70'
              }`}
              title={`${zone.name} (${zone.label})`}
            />
          ))}
        </div>
      </div>

      {/* Range labels */}
      <div className="grid grid-cols-6 text-[10px] sm:text-xs text-stone-500 text-center font-medium mt-1 gap-0.5">
        <div>
          <span className="block font-semibold text-stone-700">Abaixo</span>
          <span>&lt; 18.5</span>
        </div>
        <div>
          <span className="block font-semibold text-emerald-700">Normal</span>
          <span>18.5 - 24.9</span>
        </div>
        <div>
          <span className="block font-semibold text-orange-700">Sobrepeso</span>
          <span>25 - 29.9</span>
        </div>
        <div>
          <span className="block font-semibold text-red-700">Obes. I</span>
          <span>30 - 34.9</span>
        </div>
        <div>
          <span className="block font-semibold text-rose-700">Obes. II</span>
          <span>35 - 39.9</span>
        </div>
        <div>
          <span className="block font-semibold text-purple-800">Obes. III</span>
          <span>≥ 40</span>
        </div>
      </div>
    </div>
  );
};
