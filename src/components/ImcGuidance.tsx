import React from 'react';
import { Apple, Dumbbell, Stethoscope, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ImcClassificationInfo } from '../types';

interface ImcGuidanceProps {
  info: ImcClassificationInfo;
}

export const ImcGuidance: React.FC<ImcGuidanceProps> = ({ info }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-7 mt-6">
      <div className="border-b border-stone-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-stone-900 tracking-tight font-display flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            Orientações e Recomendações Personalizadas
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Diretrizes fundamentadas nas recomendações da Organização Mundial da Saúde (OMS) e ABESO
          </p>
        </div>

        <span className={`self-start sm:self-center text-xs font-bold px-2.5 py-1 rounded-md border ${info.badgeClass}`}>
          {info.label}
        </span>
      </div>

      {info.medicalAlert && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            {info.medicalAlert}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Nutritional Guidance */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Apple className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              Nutrição & Hábitos
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-stone-700 leading-relaxed">
            {info.nutritionalGuidance.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Physical Exercise Guidance */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              Atividade Física
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-stone-700 leading-relaxed">
            {info.physicalGuidance.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Clinical Guidance & Follow-up */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              Cuidados Clínicos
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-stone-700 leading-relaxed">
            {info.generalGuidance.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-5 pt-4 border-t border-stone-100 text-center">
        <p className="text-[11px] text-stone-400">
          * As orientações fornecidas possuem caráter exclusivamente informativo e educativo. A avaliação clínica individualizada realizada por profissional médico ou nutricionista habilitado é indispensável.
        </p>
      </div>
    </div>
  );
};
