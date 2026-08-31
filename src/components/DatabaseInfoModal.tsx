import React, { useState } from 'react';
import { X, Database, CheckCircle2, Copy, Check, ExternalLink, Server, AlertCircle } from 'lucide-react';
import { DbStatus } from '../types';

interface DatabaseInfoModalProps {
  status: DbStatus | null;
  onClose: () => void;
}

export const DatabaseInfoModal: React.FC<DatabaseInfoModalProps> = ({ status, onClose }) => {
  const [copied, setCopied] = useState(false);

  const schemaCode = `CREATE TABLE IF NOT EXISTS imc_records (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    height NUMERIC(5,2) NOT NULL,
    imc NUMERIC(5,2) NOT NULL,
    classification VARCHAR(32) NOT NULL,
    classification_label VARCHAR(64) NOT NULL,
    gender VARCHAR(16),
    age INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_imc_records_created_at ON imc_records (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_imc_records_name ON imc_records (name);`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base font-display">
              Status do Banco de Dados & Persistência
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-stone-800 text-xs sm:text-sm">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-stone-900">
                  {status?.type === 'postgres' ? 'PostgreSQL / Supabase Conectado' : 'Armazenamento Local Ativo (JSON File)'}
                </h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  Operacional
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                {status?.message || 'Registros de avaliações persistidos e sincronizados.'}
              </p>
              <p className="text-xs font-semibold text-stone-700 mt-1">
                Total de registros armazenados: <span className="text-teal-800 font-bold">{status?.recordCount ?? 0}</span>
              </p>
            </div>
          </div>

          {/* Vercel & Supabase Instructions */}
          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">
              Como conectar com Supabase / PostgreSQL na Vercel:
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-stone-600">
              <li>Crie um banco gratuito em <strong>supabase.com</strong> ou <strong>neon.tech</strong>.</li>
              <li>No painel do Supabase, abra o <strong>SQL Editor</strong> e execute o script abaixo.</li>
              <li>No painel da <strong>Vercel</strong> (em <em>Settings &gt; Environment Variables</em>), adicione a variável:
                <div className="mt-1 p-2 rounded bg-stone-100 font-mono text-[11px] text-stone-800 break-all select-all">
                  DATABASE_URL="postgresql://postgres:[SENHA]@db.[REF].supabase.co:5432/postgres"
                </div>
              </li>
            </ol>
          </div>

          {/* Schema preview with Copy button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Script DDL do Banco (schema.sql):
              </span>
              <button
                onClick={handleCopySchema}
                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-stone-100 text-[11px] font-mono rounded-xl overflow-x-auto max-h-40">
              {schemaCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
