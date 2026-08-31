import React from 'react';
import { Printer, X, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ImcRecord, ImcClassificationInfo } from '../types';
import { calculateIdealWeightRange, calculateWaterIntake, formatDateTime, WHO_CLASSIFICATIONS } from '../utils/imc';

interface ImcPrintReportProps {
  record: {
    name: string;
    weight: number;
    height: number;
    imc: number;
    classification: string;
    classificationLabel: string;
    gender?: string;
    age?: number;
    notes?: string;
    createdAt?: string;
  };
  classificationInfo: ImcClassificationInfo;
  onClose: () => void;
}

export const ImcPrintReport: React.FC<ImcPrintReportProps> = ({
  record,
  classificationInfo,
  onClose
}) => {
  const idealRange = calculateIdealWeightRange(record.height, record.weight);
  const water = calculateWaterIntake(record.weight);
  const evalDate = record.createdAt ? formatDateTime(record.createdAt) : formatDateTime(new Date().toISOString());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      {/* Modal / Report Container */}
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto">
        {/* Top Control Bar (Hidden when printed) */}
        <div className="no-print bg-stone-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-teal-400" />
            <span className="font-semibold text-sm">Visualização de Impressão do Laudo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="Fechar janela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 sm:p-10 bg-white text-stone-900 printable-document">
          {/* Header */}
          <div className="border-b-2 border-stone-800 pb-4 mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                <Activity className="w-7 h-7 text-teal-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-display">
                  LAUDO ANTROPOMÉTRICO • SSD DE IMC
                </h1>
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Sistema de Suporte à Decisão • Padrão OMS / ABESO
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-stone-600">
              <p className="font-bold text-stone-900">Emissão:</p>
              <p>{evalDate}</p>
            </div>
          </div>

          {/* Patient Identification Card */}
          <div className="bg-stone-50 border border-stone-300 rounded-xl p-4 mb-6">
            <h2 className="text-xs uppercase font-bold tracking-wider text-stone-600 mb-2.5">
              1. Identificação do Paciente
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-stone-500 block">Nome do Paciente:</span>
                <span className="font-bold text-stone-900 text-sm">{record.name}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Idade:</span>
                <span className="font-semibold text-stone-900">{record.age ? `${record.age} anos` : 'Não informada'}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Gênero Biológico:</span>
                <span className="font-semibold text-stone-900">
                  {record.gender === 'male' ? 'Masculino' : record.gender === 'female' ? 'Feminino' : 'Geral'}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Código / ID:</span>
                <span className="font-mono text-stone-700">{('id' in record && record.id) ? (record.id as string).slice(0, 8) : 'AVAL-ONLINE'}</span>
              </div>
            </div>
          </div>

          {/* Anthropometric Results Grid */}
          <div className="mb-6">
            <h2 className="text-xs uppercase font-bold tracking-wider text-stone-600 mb-2.5">
              2. Parâmetros e Diagnóstico Antropométrico
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-stone-100/70 border border-stone-300 rounded-lg text-center">
                <span className="text-[11px] text-stone-600 block">Peso Aferido</span>
                <span className="text-lg font-bold text-stone-900">{record.weight} kg</span>
              </div>

              <div className="p-3 bg-stone-100/70 border border-stone-300 rounded-lg text-center">
                <span className="text-[11px] text-stone-600 block">Estatura</span>
                <span className="text-lg font-bold text-stone-900">{(record.height / 100).toFixed(2)} m</span>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-300 rounded-lg text-center">
                <span className="text-[11px] text-teal-800 font-semibold block">IMC Calculado</span>
                <span className="text-xl font-black text-teal-900">{record.imc.toFixed(2)}</span>
                <span className="text-[10px] text-teal-700 block">kg/m²</span>
              </div>

              <div className="p-3 bg-stone-100/70 border border-stone-300 rounded-lg text-center">
                <span className="text-[11px] text-stone-600 block">Classificação OMS</span>
                <span className="text-xs font-bold text-stone-900 block mt-1">{classificationInfo.label}</span>
              </div>
            </div>

            {/* Target and Delta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-lg border border-stone-200">
              <div>
                <span className="text-stone-500 font-medium">Faixa de Peso Saudável (IMC 18,5 - 24,9):</span>
                <p className="font-bold text-stone-900">{idealRange.minWeight} kg a {idealRange.maxWeight} kg</p>
              </div>
              <div>
                <span className="text-stone-500 font-medium">Situação em Relação à Meta:</span>
                <p className="font-bold text-stone-900">
                  {idealRange.status === 'normal'
                    ? '✓ Peso dentro do intervalo recomendado'
                    : idealRange.status === 'above'
                    ? `Excedente de ${idealRange.weightDifference} kg para o limite saudável`
                    : `Déficit de ${idealRange.weightDifference} kg para o limite saudável`}
                </p>
              </div>
            </div>
          </div>

          {/* Reference Table */}
          <div className="mb-6">
            <h2 className="text-xs uppercase font-bold tracking-wider text-stone-600 mb-2">
              3. Tabela de Referência da OMS para Adultos
            </h2>
            <table className="w-full text-left text-xs border border-stone-300 rounded-lg overflow-hidden">
              <thead className="bg-stone-200 text-stone-800 font-bold">
                <tr>
                  <th className="p-2 border-b border-stone-300">Faixa de IMC (kg/m²)</th>
                  <th className="p-2 border-b border-stone-300">Classificação</th>
                  <th className="p-2 border-b border-stone-300">Grau de Risco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr className={classificationInfo.key === 'abaixo_peso' ? 'bg-amber-100 font-bold' : ''}>
                  <td className="p-2">Menor que 18,5</td>
                  <td className="p-2">Abaixo do peso</td>
                  <td className="p-2">Elevado (desnutrição/osteoporose)</td>
                </tr>
                <tr className={classificationInfo.key === 'peso_normal' ? 'bg-emerald-100 font-bold' : ''}>
                  <td className="p-2">18,5 – 24,9</td>
                  <td className="p-2">Peso normal (Eutrofia)</td>
                  <td className="p-2">Mínimo / Baixo</td>
                </tr>
                <tr className={classificationInfo.key === 'sobrepeso' ? 'bg-orange-100 font-bold' : ''}>
                  <td className="p-2">25,0 – 29,9</td>
                  <td className="p-2">Sobrepeso (Pré-obesidade)</td>
                  <td className="p-2">Moderado</td>
                </tr>
                <tr className={classificationInfo.key === 'obesidade_grau_1' ? 'bg-red-100 font-bold' : ''}>
                  <td className="p-2">30,0 – 34,9</td>
                  <td className="p-2">Obesidade Grau I</td>
                  <td className="p-2">Aumentado</td>
                </tr>
                <tr className={classificationInfo.key === 'obesidade_grau_2' ? 'bg-rose-100 font-bold' : ''}>
                  <td className="p-2">35,0 – 39,9</td>
                  <td className="p-2">Obesidade Grau II (Severa)</td>
                  <td className="p-2">Muito Elevado</td>
                </tr>
                <tr className={classificationInfo.key === 'obesidade_grau_3' ? 'bg-purple-100 font-bold' : ''}>
                  <td className="p-2">40,0 ou mais</td>
                  <td className="p-2">Obesidade Grau III (Mórbida)</td>
                  <td className="p-2">Extremamente Elevado</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Clinical Recommendations */}
          <div className="mb-6">
            <h2 className="text-xs uppercase font-bold tracking-wider text-stone-600 mb-2">
              4. Parecer e Recomendações Clínicas
            </h2>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 space-y-2 text-xs text-stone-800">
              <p className="font-semibold">{classificationInfo.summary}</p>
              <ul className="list-disc pl-4 space-y-1">
                {classificationInfo.nutritionalGuidance.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
                {classificationInfo.physicalGuidance.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              {record.notes && (
                <div className="pt-2 border-t border-stone-200">
                  <span className="font-bold text-stone-900 block">Anotações do Avaliador:</span>
                  <p className="text-stone-700 italic">{record.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Signature & Validation Footer */}
          <div className="pt-8 border-t border-stone-300 grid grid-cols-2 gap-8 text-center text-xs text-stone-600 print-avoid-break">
            <div>
              <div className="border-b border-stone-400 pb-1 mb-1 mx-6"></div>
              <p className="font-semibold text-stone-800">Assinatura do Paciente / Usuário</p>
              <p className="text-[10px] text-stone-500">Ciente da avaliação antropométrica</p>
            </div>
            <div>
              <div className="border-b border-stone-400 pb-1 mb-1 mx-6"></div>
              <p className="font-semibold text-stone-800">Profissional Responsável / Avaliador</p>
              <p className="text-[10px] text-stone-500">CRN / CRM / CREF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
