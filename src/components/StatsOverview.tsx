import React from 'react';
import { Users, Activity, CheckCircle, TrendingUp } from 'lucide-react';
import { ImcRecord } from '../types';

interface StatsOverviewProps {
  records: ImcRecord[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ records }) => {
  if (records.length === 0) return null;

  const total = records.length;
  const avgImc = total > 0 ? (records.reduce((acc, r) => acc + r.imc, 0) / total).toFixed(1) : '0.0';
  const normalCount = records.filter((r) => r.classification === 'peso_normal').length;
  const normalPercent = total > 0 ? Math.round((normalCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 no-print">
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2 text-stone-500 mb-1">
          <Users className="w-3.5 h-3.5 text-teal-700" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Total Avaliados</span>
        </div>
        <p className="text-xl font-bold text-stone-900 font-display">{total}</p>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2 text-stone-500 mb-1">
          <Activity className="w-3.5 h-3.5 text-teal-700" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Média de IMC</span>
        </div>
        <p className="text-xl font-bold text-stone-900 font-display">{avgImc} <span className="text-xs font-normal text-stone-500">kg/m²</span></p>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2 text-stone-500 mb-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Peso Normal</span>
        </div>
        <p className="text-xl font-bold text-emerald-700 font-display">{normalPercent}% <span className="text-xs font-normal text-stone-500">({normalCount})</span></p>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2 text-stone-500 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Última Aferição</span>
        </div>
        <p className="text-sm font-bold text-stone-900 truncate" title={records[0]?.name}>
          {records[0]?.name || 'N/A'}
        </p>
        <p className="text-[10px] text-stone-500 truncate">{records[0]?.classificationLabel}</p>
      </div>
    </div>
  );
};
