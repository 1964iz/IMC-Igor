import { ImcClassification, ImcClassificationInfo, IdealWeightRange } from '../types';

export const WHO_CLASSIFICATIONS: Record<ImcClassification, ImcClassificationInfo> = {
  abaixo_peso: {
    key: 'abaixo_peso',
    label: 'Abaixo do Peso',
    minImc: 0,
    maxImc: 18.49,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    bgClass: 'bg-amber-50/70',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    riskLevel: 'Elevado (risco de desnutrição, imunidade baixa e osteoporose)',
    summary: 'O IMC está abaixo da faixa recomendada pela Organização Mundial da Saúde (OMS). É importante avaliar se há carência nutricional ou perda de massa magra.',
    generalGuidance: [
      'Agende uma consulta médica e nutricional para investigar as causas do baixo peso.',
      'Priorize ganho de massa muscular através de exercícios de força associados a aporte proteico adequado.',
      'Evite pular refeições e procure manter regularidade de horários.'
    ],
    nutritionalGuidance: [
      'Aumente a densidade calórica e nutricional das refeições com fontes saudáveis (castanhas, sementes, abacate, azeite de oliva).',
      'Consuma boas fontes de proteínas magras em todas as refeições principais (ovos, peixes, frango, leguminosas).',
      'Inclua lanches intermediários nutritivos entre café da manhã, almoço e jantar.'
    ],
    physicalGuidance: [
      'Foque em treinamento de força/musculação progressiva para hipertrofia muscular.',
      'Evite excesso de exercícios aeróbicos prolongados sem orientação nutricional correspondente.'
    ],
    medicalAlert: 'Atenção: Quedas repentinas de peso sem causa aparente exigem investigação clínica imediata com médico generalista.'
  },
  peso_normal: {
    key: 'peso_normal',
    label: 'Peso Normal (Eutrofia)',
    minImc: 18.5,
    maxImc: 24.99,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    bgClass: 'bg-emerald-50/70',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-800',
    riskLevel: 'Baixo / Mínimo (faixa de menor risco cardiovascular e metabólico)',
    summary: 'Parabéns! O seu IMC está dentro da faixa considerada saudável pela OMS. O foco deve ser a manutenção dos hábitos saudáveis e composição corporal.',
    generalGuidance: [
      'Mantenha seu estilo de vida ativo e continue monitorando seus parâmetros de saúde anualmente.',
      'Priorize a qualidade do sono (7 a 8 horas por noite) e manejo adequado do estresse.',
      'Lembre-se de que o IMC não mede diretamente a porcentagem de gordura e massa magra; mantenha exames periódicos.'
    ],
    nutritionalGuidance: [
      'Mantenha uma dieta equilibrada e variada, rica em vegetais, frutas da estação, grãos integrais e proteínas.',
      'Mantenha hidratação constante ao longo de todo o dia.',
      'Evite consumo frequente de ultraprocessados, bebidas açucaradas e excesso de sódio.'
    ],
    physicalGuidance: [
      'Pratique pelo menos 150 a 300 minutos de atividade física moderada ou 75 minutos vigorosos por semana.',
      'Combine exercícios aeróbicos (caminhada, corrida, ciclismo) com exercícios de fortalecimento muscular 2 a 3 vezes por semana.'
    ]
  },
  sobrepeso: {
    key: 'sobrepeso',
    label: 'Sobrepeso (Pré-obesidade)',
    minImc: 25.0,
    maxImc: 29.99,
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
    bgClass: 'bg-orange-50/70',
    borderClass: 'border-orange-200',
    textClass: 'text-orange-800',
    riskLevel: 'Moderado (atenção preventiva para hipertensão, glicemia e colesterol)',
    summary: 'O IMC está ligeiramente acima da faixa de referência. Pequenas mudanças de hábitos alimentares e estilo de vida trazem grandes benefícios preventivos.',
    generalGuidance: [
      'Considere consultar um profissional de nutrição e educação física para traçar um plano sustentável de reeducação.',
      'Monitore a circunferência abdominal e parâmetros bioquímicos (glicemia de jejum, perfil lipídico, pressão arterial).',
      'Evite dietas restritivas extremas que provocam efeito sanfona; priorize mudanças graduais e duradouras.'
    ],
    nutritionalGuidance: [
      'Aumente o consumo de fibras (verduras cruas, legumes, farelo de aveia, chia) para aumentar a saciedade.',
      'Reduza porções de carboidratos refinados, frituras, doces e bebidas açucaradas.',
      'Faça refeições com atenção plena, mastigando devagar e evitando telas durante a alimentação.'
    ],
    physicalGuidance: [
      'Inicie ou intensifique atividades físicas aeróbicas diárias (caminhadas rápidas de 30 a 45 minutos).',
      'Incorpore treinos de resistência muscular para preservar massa magra e elevar o gasto calórico basal.'
    ],
    medicalAlert: 'Dica preventiva: Uma perda modesta de 5% a 7% do peso corporal já reduz significativamente marcadores inflamatórios e riscos cardiovasculares.'
  },
  obesidade_grau_1: {
    key: 'obesidade_grau_1',
    label: 'Obesidade Grau I',
    minImc: 30.0,
    maxImc: 34.99,
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
    bgClass: 'bg-red-50/70',
    borderClass: 'border-red-200',
    textClass: 'text-red-800',
    riskLevel: 'Aumentado (maior probabilidade de diabetes tipo 2, esteatose hepática e dislipidemias)',
    summary: 'O IMC encontra-se na faixa de Obesidade Grau I. Recomenda-se acompanhamento multidisciplinar com médico e nutricionista para metas de saúde personalizadas.',
    generalGuidance: [
      'Procure orientação médica para avaliação metabólica global e exclusão de comorbidades associadas.',
      'Estabeleça metas graduais e realistas de perda ponderal (0,5 a 1 kg por semana).',
      'Cuide da saúde mental e dos gatilhos emocionais relacionados à alimentação.'
    ],
    nutritionalGuidance: [
      'Siga um plano alimentar hipocalórico equilibrado prescrito por nutricionista.',
      'Substitua alimentos de alta densidade energética por alimentos ricos em água, fibras e micronutrientes.',
      'Elimine refrigerantes, sucos industrializados e alimentos ultraprocessados.'
    ],
    physicalGuidance: [
      'Inicie atividades com baixo impacto articular (natação, hidroginástica, bicicleta ergométrica, caminhada assistida).',
      'Consulte um médico antes de iniciar programas intensos de exercícios.'
    ],
    medicalAlert: 'Importante: Realize exames periódicos de sangue e eletrocardiograma antes de elevar a intensidade dos treinos.'
  },
  obesidade_grau_2: {
    key: 'obesidade_grau_2',
    label: 'Obesidade Grau II (Severa)',
    minImc: 35.0,
    maxImc: 39.99,
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    bgClass: 'bg-rose-50/70',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-800',
    riskLevel: 'Muito Elevado (risco substancial de doenças cardiovasculares, apneia do sono e sobrecarga articular)',
    summary: 'O IMC indica Obesidade Grau II. É essencial o suporte de equipe multiprofissional (médico, nutricionista, psicólogo e educador físico).',
    generalGuidance: [
      'Acompanhamento médico contínuo (endocrinologia/cardiologia) é altamente recomendado.',
      'Investigue possíveis sintomas de apneia obstrutiva do sono (ronco intenso, sonolência diurna).',
      'Avalie com seu médico as opções de tratamento farmacológico ou comportamental.'
    ],
    nutritionalGuidance: [
      'Acompanhamento nutricional individualizado e rigoroso para evitar deficiências de vitaminas e minerais.',
      'Fracionamento adequado das refeições para controle de compulsões alimentares.',
      'Controle rígido da ingestão de sódio e açúcares adicionados.'
    ],
    physicalGuidance: [
      'Prática de exercícios físicos com supervisão profissional, respeitando as articulações dos joelhos e coluna.',
      'Foco inicial em mobilidade, fortalecimento suave e exercícios aquáticos.'
    ],
    medicalAlert: 'Alerta Clínico: Não inicie dietas restritivas drásticas sem monitoramento laboratorial médico.'
  },
  obesidade_grau_3: {
    key: 'obesidade_grau_3',
    label: 'Obesidade Grau III (Mórbida)',
    minImc: 40.0,
    maxImc: 100,
    badgeClass: 'bg-purple-50 text-purple-900 border-purple-200',
    bgClass: 'bg-purple-50/70',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-900',
    riskLevel: 'Extremamente Elevado (risco agudo de complicações vasculares, metabólicas e respiratórias)',
    summary: 'O IMC está na classificação de Obesidade Grau III. Requer atenção clínica integral e prioritária com equipe especializada.',
    generalGuidance: [
      'Agende consulta médica com urgência para planejamento terapêutico detalhado.',
      'Investigação completa de comorbidades (cardíacas, renais, hepáticas e pulmonares).',
      'Considere avaliação para terapias avançadas e cirurgia bariátrica conforme indicação médica.'
    ],
    nutritionalGuidance: [
      'Plano alimentar clínico especializado com acompanhamento frequente.',
      'Suplementação de micronutrientes se constatada deficiência nos exames laboratoriais.',
      'Apoio comportamental e psicológico constante.'
    ],
    physicalGuidance: [
      'Atividades físicas adaptadas sob prescrição médica e supervisão fisioterápica/educador físico.',
      'Prioridade inicial à movimentação diária sem dor ou sobrecarga excessiva.'
    ],
    medicalAlert: 'Prioridade Médica: Acompanhamento clínico indispensável para preservação da qualidade de vida e prevenção de eventos cardiovasculares.'
  }
};

/**
 * Calculates BMI according to standard WHO formula: peso (kg) / [altura (m)]²
 * @param weightInKg Weight in kilograms (e.g. 70.5)
 * @param heightInCm Height in centimeters (e.g. 175) or meters (e.g. 1.75)
 */
export function calculateImc(weightInKg: number, heightInCm: number): number {
  if (!weightInKg || !heightInCm || weightInKg <= 0 || heightInCm <= 0) {
    return 0;
  }

  // Handle case where user entered height in meters instead of cm (e.g. 1.75)
  const heightInMeters = heightInCm < 3 ? heightInCm : heightInCm / 100;
  if (heightInMeters <= 0) return 0;

  const imc = weightInKg / (heightInMeters * heightInMeters);
  return Number(imc.toFixed(2));
}

/**
 * Returns the classification key for a given IMC value
 */
export function getImcClassificationKey(imc: number): ImcClassification {
  if (imc < 18.5) return 'abaixo_peso';
  if (imc <= 24.99) return 'peso_normal';
  if (imc <= 29.99) return 'sobrepeso';
  if (imc <= 34.99) return 'obesidade_grau_1';
  if (imc <= 39.99) return 'obesidade_grau_2';
  return 'obesidade_grau_3';
}

/**
 * Returns full classification info object
 */
export function getImcClassificationInfo(imc: number): ImcClassificationInfo {
  const key = getImcClassificationKey(imc);
  return WHO_CLASSIFICATIONS[key];
}

/**
 * Calculates ideal weight range (IMC 18.5 - 24.9) for a given height
 */
export function calculateIdealWeightRange(heightInCm: number, currentWeight: number): IdealWeightRange {
  const heightInMeters = heightInCm < 3 ? heightInCm : heightInCm / 100;
  const minWeight = Number((18.5 * heightInMeters * heightInMeters).toFixed(1));
  const maxWeight = Number((24.9 * heightInMeters * heightInMeters).toFixed(1));

  let weightDifference = 0;
  let status: IdealWeightRange['status'] = 'normal';

  if (currentWeight < minWeight) {
    status = 'below';
    weightDifference = Number((minWeight - currentWeight).toFixed(1)); // needs to gain
  } else if (currentWeight > maxWeight) {
    status = 'above';
    weightDifference = Number((currentWeight - maxWeight).toFixed(1)); // needs to lose
  }

  return {
    minWeight,
    maxWeight,
    weightDifference,
    status
  };
}

/**
 * Calculates recommended daily water intake (approx. 35ml per kg of body weight)
 */
export function calculateWaterIntake(weightInKg: number): { liters: number; glasses: number } {
  const ml = weightInKg * 35;
  const liters = Number((ml / 1000).toFixed(1));
  const glasses = Math.round(ml / 250); // standard 250ml glass
  return { liters, glasses };
}

/**
 * Sanitizes input string to prevent XSS / malicious data
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // remove angle brackets
    .slice(0, 100); // limit length
}

/**
 * Formats a date string nicely in pt-BR
 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return isoString;
  }
}
