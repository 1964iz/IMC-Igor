import React from 'react';
import { BookOpen, Info, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';
import { WHO_CLASSIFICATIONS } from '../utils/imc';

export const WhoReferenceView: React.FC = () => {
  const tableData = [
    {
      range: 'Menor que 18,5',
      classification: 'Abaixo do peso',
      status: 'Desnutrição / Magreza',
      risk: 'Elevado (infecções, osteoporose, fadiga crônica)',
      badge: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      range: '18,5 a 24,9',
      classification: 'Peso normal (Eutrofia)',
      status: 'Saudável',
      risk: 'Mínimo / Faixa de menor risco cardiovascular',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    {
      range: '25,0 a 29,9',
      classification: 'Sobrepeso (Pré-obesidade)',
      status: 'Atenção Preventiva',
      risk: 'Moderado (hipertensão, triglicérides e glicemia)',
      badge: 'bg-orange-100 text-orange-900 border-orange-300'
    },
    {
      range: '30,0 a 34,9',
      classification: 'Obesidade Grau I',
      status: 'Obesidade Leve',
      risk: 'Aumentado (diabetes tipo 2, aterosclerose)',
      badge: 'bg-red-100 text-red-900 border-red-300'
    },
    {
      range: '35,0 a 39,9',
      classification: 'Obesidade Grau II (Severa)',
      status: 'Obesidade Moderada a Alta',
      risk: 'Muito Elevado (apneia do sono, sobrecarga articular)',
      badge: 'bg-rose-100 text-rose-900 border-rose-300'
    },
    {
      range: '40,0 ou superior',
      classification: 'Obesidade Grau III (Mórbida)',
      status: 'Obesidade Crítica',
      risk: 'Extremamente Elevado (risco agudo cardiovascular)',
      badge: 'bg-purple-100 text-purple-900 border-purple-300'
    }
  ];

  return (
    <div className="space-y-6">
      {/* WHO Reference Table Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-7">
        <div className="border-b border-stone-100 pb-4 mb-5">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            Tabela de Classificação do IMC (Padrão OMS & ABESO)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Critérios diagnósticos antropométricos para adultos segundo a Organização Mundial da Saúde
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
            <thead className="bg-stone-100 text-stone-800 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5 border-b border-stone-200">Faixa de IMC (kg/m²)</th>
                <th className="p-3.5 border-b border-stone-200">Classificação</th>
                <th className="p-3.5 border-b border-stone-200">Condição</th>
                <th className="p-3.5 border-b border-stone-200">Nível de Risco para a Saúde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-stone-900 text-sm">
                    {row.range}
                  </td>
                  <td className="p-3.5 font-semibold text-stone-900">
                    <span className={`inline-block px-2.5 py-1 text-xs rounded-md border font-bold ${row.badge}`}>
                      {row.classification}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-700 font-medium">
                    {row.status}
                  </td>
                  <td className="p-3.5 text-stone-600">
                    {row.risk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Context & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">
              O que é o IMC e como é calculado?
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed mb-3">
            O Índice de Massa Corporal (IMC) é uma medida internacional adotada pela OMS para avaliar se uma pessoa está com peso proporcional à sua altura.
          </p>
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-center font-mono text-xs font-bold text-stone-800 mb-3">
            IMC = Peso (kg) ÷ [ Altura (m) × Altura (m) ]
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Exemplo: Uma pessoa de 70 kg e 1,75 m de altura calcula: <span className="font-semibold text-stone-800">70 ÷ (1,75 × 1,75) = 70 ÷ 3,0625 = 22,86 kg/m²</span> (Peso Normal).
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">
              Limitações do IMC na Prática Clínica
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
              <span><strong>Massa Muscular vs. Gordura:</strong> Atletas e praticantes de musculação podem ter IMC alto devido à densidade muscular, sem excesso de adiposidade.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
              <span><strong>Idosos (&gt; 60 anos):</strong> Apresentam pontos de corte distintos (faixa recomendada de 22 a 27 kg/m² pela Sociedade Brasileira de Geriatria).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
              <span><strong>Gestantes:</strong> Exigem curvas específicas de ganho ponderal gestacional (curva de Atalah).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
