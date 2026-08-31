/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ImcCalculator } from './components/ImcCalculator';
import { ImcResultCard } from './components/ImcResultCard';
import { ImcGuidance } from './components/ImcGuidance';
import { ImcHistory } from './components/ImcHistory';
import { WhoReferenceView } from './components/WhoTableModal';
import { DatabaseInfoModal } from './components/DatabaseInfoModal';
import { ImcPrintReport } from './components/ImcPrintReport';
import { StatsOverview } from './components/StatsOverview';
import { ImcRecord, DbStatus } from './types';
import { getImcClassificationInfo } from './utils/imc';
import { Shield, Sparkles, Scale, Info, HeartPulse } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'history' | 'reference'>('calculator');
  const [records, setRecords] = useState<ImcRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);
  const [printRecord, setPrintRecord] = useState<ImcRecord | null>(null);

  // Live calculated state for instant feedback
  const [liveData, setLiveData] = useState<{
    imc: number;
    name: string;
    weight: number;
    height: number;
    gender?: 'male' | 'female' | 'other';
    age?: number;
    notes?: string;
  } | null>({
    imc: 23.66,
    name: 'Paciente',
    weight: 70,
    height: 172,
    gender: 'male'
  });

  // Fetch records from API
  const fetchRecords = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      const res = await fetch('/api/imc');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setRecords(json.data);
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar histórico da API:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Fetch database status
  const fetchDbStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/imc/db-status');
      if (res.ok) {
        const json = await res.json();
        setDbStatus(json);
      }
    } catch (err) {
      console.warn('Erro ao verificar status do banco:', err);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
    fetchDbStatus();
  }, [fetchRecords, fetchDbStatus]);

  // Handle saving a new record
  const handleRecordSaved = (newRecord: ImcRecord) => {
    setRecords((prev) => [newRecord, ...prev.filter((r) => r.id !== newRecord.id)]);
    fetchDbStatus();
  };

  // Handle deleting a record
  const handleDeleteRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/imc/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        fetchDbStatus();
      } else {
        alert('Não foi possível excluir o registro.');
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao se comunicar com o servidor.');
    }
  };

  // Trigger print view
  const handleOpenPrint = (recordToPrint?: ImcRecord) => {
    if (recordToPrint) {
      setPrintRecord(recordToPrint);
    } else if (liveData && liveData.imc > 0) {
      const classificationInfo = getImcClassificationInfo(liveData.imc);
      const tempRecord: ImcRecord = {
        id: `temp_${Date.now()}`,
        name: liveData.name || 'Paciente',
        weight: liveData.weight,
        height: liveData.height,
        imc: liveData.imc,
        classification: classificationInfo.key,
        classificationLabel: classificationInfo.label,
        gender: liveData.gender,
        age: liveData.age,
        notes: liveData.notes,
        createdAt: new Date().toISOString()
      };
      setPrintRecord(tempRecord);
    }
  };

  const currentClassification = liveData?.imc
    ? getImcClassificationInfo(liveData.imc)
    : getImcClassificationInfo(22);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbStatus={dbStatus}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        historyCount={records.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Overview */}
        <StatsOverview records={records} />

        {/* Tab 1: Calculator & Interactive Evaluation */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Input Column (5 cols) */}
              <div className="lg:col-span-5">
                <ImcCalculator
                  onRecordSaved={handleRecordSaved}
                  onInstantCalculated={(data) => setLiveData(data)}
                  initialValues={{
                    weight: liveData?.weight || 70,
                    height: liveData?.height || 172
                  }}
                />
              </div>

              {/* Result Preview & Diagnostics Column (7 cols) */}
              <div className="lg:col-span-7">
                {liveData && liveData.imc > 0 ? (
                  <ImcResultCard
                    imc={liveData.imc}
                    name={liveData.name}
                    weight={liveData.weight}
                    height={liveData.height}
                    classificationInfo={currentClassification}
                    onPrint={() => handleOpenPrint()}
                  />
                ) : (
                  <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                    <Scale className="w-12 h-12 text-stone-300 mb-3" />
                    <h3 className="font-bold text-stone-700 text-base">Aguardando Parâmetros</h3>
                    <p className="text-xs text-stone-500 max-w-xs mt-1">
                      Informe o peso e a altura nos campos ao lado para visualizar a classificação do IMC em tempo real.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comprehensive Guidance Module */}
            {liveData && liveData.imc > 0 && (
              <ImcGuidance info={currentClassification} />
            )}
          </div>
        )}

        {/* Tab 2: Persistent History */}
        {activeTab === 'history' && (
          <ImcHistory
            records={records}
            onDeleteRecord={handleDeleteRecord}
            onPrintRecord={(rec) => handleOpenPrint(rec)}
            isLoading={isLoadingHistory}
          />
        )}

        {/* Tab 3: WHO Standards & Medical Reference */}
        {activeTab === 'reference' && (
          <WhoReferenceView />
        )}
      </main>

      {/* Database Setup Info Modal */}
      {isDbModalOpen && (
        <DatabaseInfoModal
          status={dbStatus}
          onClose={() => setIsDbModalOpen(false)}
        />
      )}

      {/* Print Report Modal */}
      {printRecord && (
        <ImcPrintReport
          record={printRecord}
          classificationInfo={getImcClassificationInfo(printRecord.imc)}
          onClose={() => setPrintRecord(null)}
        />
      )}

      {/* Minimalist Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500 no-print mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-700" />
            <span className="font-medium text-stone-700">SSD de IMC • Sistema de Suporte à Decisão Nutricional</span>
          </div>
          <p className="text-[11px] text-stone-400">
            Fórmula OMS: Peso (kg) / Altura (m)² • Padrões ABESO / Ministério da Saúde
          </p>
        </div>
      </footer>
    </div>
  );
}
