import React, { useState, useEffect } from 'react';
import { User, Scale, Ruler, Sparkles, Save, RotateCcw, AlertCircle, Calendar, FileText } from 'lucide-react';
import { calculateImc, calculateIdealWeightRange, calculateWaterIntake, getImcClassificationInfo, sanitizeString } from '../utils/imc';
import { ImcRecord } from '../types';

interface ImcCalculatorProps {
  onRecordSaved: (record: ImcRecord) => void;
  onInstantCalculated?: (data: {
    imc: number;
    name: string;
    weight: number;
    height: number;
    gender?: 'male' | 'female' | 'other';
    age?: number;
    notes?: string;
  } | null) => void;
  initialValues?: {
    name?: string;
    weight?: number;
    height?: number;
  };
}

export const ImcCalculator: React.FC<ImcCalculatorProps> = ({
  onRecordSaved,
  onInstantCalculated,
  initialValues
}) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [weight, setWeight] = useState<string>(initialValues?.weight ? String(initialValues.weight) : '70');
  const [height, setHeight] = useState<string>(initialValues?.height ? String(initialValues.height) : '172');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const parsedWeight = parseFloat(weight.replace(',', '.')) || 0;
  let parsedHeight = parseFloat(height.replace(',', '.')) || 0;
  if (parsedHeight > 0 && parsedHeight < 3) {
    parsedHeight = parsedHeight * 100;
  }

  const liveImc = calculateImc(parsedWeight, parsedHeight);

  // Notify parent on state change for instant preview
  useEffect(() => {
    if (liveImc > 0 && parsedWeight >= 15 && parsedHeight >= 50) {
      onInstantCalculated?.({
        imc: liveImc,
        name: name.trim() || 'Paciente',
        weight: parsedWeight,
        height: parsedHeight,
        gender,
        age: age ? parseInt(age, 10) : undefined,
        notes: notes.trim() || undefined
      });
    } else {
      onInstantCalculated?.(null);
    }
  }, [name, parsedWeight, parsedHeight, gender, age, notes, liveImc, onInstantCalculated]);

  const handleWeightAdjust = (delta: number) => {
    const current = parseFloat(weight.replace(',', '.')) || 70;
    const nextVal = Math.max(20, Math.min(300, Number((current + delta).toFixed(1))));
    setWeight(String(nextVal));
  };

  const handleHeightAdjust = (delta: number) => {
    let current = parseFloat(height.replace(',', '.')) || 170;
    if (current < 3) current = current * 100;
    const nextVal = Math.max(50, Math.min(250, Math.round(current + delta)));
    setHeight(String(nextVal));
  };

  const handleReset = () => {
    setName('');
    setWeight('70');
    setHeight('170');
    setAge('');
    setNotes('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanName = sanitizeString(name);
    if (!cleanName || cleanName.length < 2) {
      setErrorMsg('Por favor, informe o nome do paciente/usuário (mínimo de 2 caracteres).');
      return;
    }

    if (!parsedWeight || parsedWeight < 10 || parsedWeight > 500) {
      setErrorMsg('Informe um peso válido entre 10 kg e 500 kg.');
      return;
    }

    if (!parsedHeight || parsedHeight < 40 || parsedHeight > 260) {
      setErrorMsg('Informe uma altura válida em centímetros (entre 40 cm e 260 cm).');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/imc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          weight: parsedWeight,
          height: parsedHeight,
          gender,
          age: age ? parseInt(age, 10) : undefined,
          notes: notes ? sanitizeString(notes) : undefined
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao salvar a avaliação.');
      }

      setSuccessMsg(`Avaliação de ${data.data.name} salva com sucesso no banco de dados!`);
      onRecordSaved(data.data);

      // Auto clear success message after 4 seconds
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro ao salvar o registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-7 transition-all">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight font-display flex items-center gap-2">
            <Scale className="w-5 h-5 text-teal-700" />
            Dados da Avaliação
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Preencha os dados antropométricos para cálculo imediato e laudo
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-medium text-stone-500 hover:text-stone-800 flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-stone-100 transition-colors"
          title="Limpar todos os campos"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Erro de validação</p>
            <p className="text-xs text-red-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900">Salvo com Sucesso!</p>
            <p className="text-xs text-emerald-700 mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient Name */}
        <div>
          <label htmlFor="input-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
            Nome Completo do Paciente / Usuário <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="input-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Carlos Eduardo de Souza"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Weight & Height Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Weight */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-weight" className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Peso Corporal <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-medium text-stone-500">em kg</span>
            </div>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Scale className="w-4 h-4" />
              </div>
              <input
                id="input-weight"
                type="number"
                step="0.1"
                min="10"
                max="500"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70.0"
                className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition-all shadow-xs"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleWeightAdjust(-0.5)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                  title="Diminuir 0.5 kg"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleWeightAdjust(0.5)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                  title="Aumentar 0.5 kg"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Height */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-height" className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Altura <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-medium text-stone-500">em cm (ex: 175)</span>
            </div>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Ruler className="w-4 h-4" />
              </div>
              <input
                id="input-height"
                type="number"
                step="0.5"
                min="40"
                max="260"
                required
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition-all shadow-xs"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleHeightAdjust(-1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                  title="Diminuir 1 cm"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleHeightAdjust(1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                  title="Aumentar 1 cm"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced details toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-1"
          >
            <span>{showAdvanced ? '− Ocultar campos opcionais' : '+ Adicionar Idade, Gênero e Observações'}</span>
          </button>
        </div>

        {showAdvanced && (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Gênero Biológico (Opcional)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'male', label: 'Masculino' },
                    { id: 'female', label: 'Feminino' },
                    { id: 'other', label: 'Outro' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id as any)}
                      className={`py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                        gender === g.id
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <label htmlFor="input-age" className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Idade (em anos)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="input-age"
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Ex: 34"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 focus:ring-2 focus:ring-teal-700 focus:outline-hidden bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="input-notes" className="block text-xs font-semibold text-stone-600 mb-1.5">
                Observações Clínicas / Histórico Pessoal
              </label>
              <textarea
                id="input-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Pratica corrida 3x na semana, sem queixas articulares..."
                className="w-full p-2.5 text-xs rounded-lg border border-stone-300 text-stone-900 focus:ring-2 focus:ring-teal-700 focus:outline-hidden bg-white"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            id="btn-save-evaluation"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Registrando Avaliação...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Avaliação no Banco de Dados</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
