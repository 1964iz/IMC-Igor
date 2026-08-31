export type ImcClassification =
  | 'abaixo_peso'
  | 'peso_normal'
  | 'sobrepeso'
  | 'obesidade_grau_1'
  | 'obesidade_grau_2'
  | 'obesidade_grau_3';

export interface ImcRecord {
  id: string;
  name: string;
  weight: number; // in kg
  height: number; // in cm
  imc: number; // calculated
  classification: ImcClassification;
  classificationLabel: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  notes?: string;
  createdAt: string; // ISO date
}

export interface ImcCalculationInput {
  name: string;
  weight: number;
  height: number;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  notes?: string;
}

export interface ImcClassificationInfo {
  key: ImcClassification;
  label: string;
  minImc: number;
  maxImc: number;
  badgeClass: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  riskLevel: string;
  summary: string;
  generalGuidance: string[];
  nutritionalGuidance: string[];
  physicalGuidance: string[];
  medicalAlert?: string;
}

export interface IdealWeightRange {
  minWeight: number; // weight at IMC 18.5
  maxWeight: number; // weight at IMC 24.9
  weightDifference: number; // difference to reach nearest normal bound (negative = lose, positive = gain, 0 = in range)
  status: 'below' | 'normal' | 'above';
}

export interface ImcStats {
  total: number;
  averageImc: number;
  classificationsCount: Record<ImcClassification, number>;
  latestRecord?: ImcRecord;
}

export interface DbStatus {
  connected: boolean;
  type: 'postgres' | 'local_file';
  message: string;
  recordCount: number;
}
