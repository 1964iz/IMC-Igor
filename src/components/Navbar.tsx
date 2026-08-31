import React from 'react';
import { Activity, Database, History, BookOpen, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { DbStatus } from '../types';

interface NavbarProps {
  activeTab: 'calculator' | 'history' | 'reference';
  setActiveTab: (tab: 'calculator' | 'history' | 'reference') => void;
  dbStatus: DbStatus | null;
  onOpenDbModal: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  dbStatus,
  onOpenDbModal,
  historyCount
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-6 h-6 text-teal-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-stone-900 tracking-tight font-display">
                  SSD de IMC
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-teal-50 text-teal-800 rounded-md border border-teal-200">
                  Sistema de Suporte à Decisão
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Avaliação antropométrica, classificação e orientação nutricional (OMS / ABESO)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="tab-calculator"
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'calculator'
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Calculadora</span>
            </button>

            <button
              id="tab-history"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'history'
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Histórico</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-xs rounded-full bg-teal-700 text-white font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              id="tab-reference"
              onClick={() => setActiveTab('reference')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'reference'
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Tabela OMS</span>
            </button>

            {/* Database status button */}
            <button
              id="btn-db-status"
              onClick={onOpenDbModal}
              title="Clique para ver detalhes do banco de dados"
              className="ml-1 sm:ml-3 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden md:inline">
                {dbStatus?.type === 'postgres' ? 'PostgreSQL' : 'JSON Local'}
              </span>
              {dbStatus?.connected ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
