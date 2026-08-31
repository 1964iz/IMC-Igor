import React, { useState } from 'react';
import { Search, Filter, Trash2, Printer, Download, User, Calendar, Scale, Ruler, FileText, AlertCircle } from 'lucide-react';
import { ImcRecord, ImcClassification } from '../types';
import { formatDateTime, WHO_CLASSIFICATIONS } from '../utils/imc';

interface ImcHistoryProps {
  records: ImcRecord[];
  onDeleteRecord: (id: string) => Promise<void>;
  onPrintRecord: (record: ImcRecord) => void;
  isLoading: boolean;
}

export const ImcHistory: React.FC<ImcHistoryProps> = ({
  records,
  onDeleteRecord,
  onPrintRecord,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter records in memory
  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || r.classification === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o registro de avaliação de "${name}"?`)) {
      setDeletingId(id);
      try {
        await onDeleteRecord(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;

    const headers = ['ID', 'Data', 'Nome', 'Peso (kg)', 'Altura (cm)', 'IMC', 'Classificação', 'Idade', 'Gênero', 'Observações'];
    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${formatDateTime(r.createdAt)}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      r.weight,
      r.height,
      r.imc,
      `"${r.classificationLabel}"`,
      r.age || '',
      r.gender || '',
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `historico_avaliacoes_imc_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-7">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-5 mb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight font-display flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-700" />
            Histórico de Avaliações Salvas
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Registros persistidos no banco de dados com laudos disponíveis para consulta e impressão
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={records.length === 0}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
          title="Exportar dados para planilha Excel / CSV"
        >
          <Download className="w-3.5 h-3.5 text-stone-600" />
          <span>Exportar Planilha (CSV)</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do paciente..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-sm placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-teal-700 bg-white"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-stone-300 text-stone-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-700 bg-white font-medium cursor-pointer"
          >
            <option value="all">Todas as Classificações</option>
            <option value="abaixo_peso">Abaixo do Peso</option>
            <option value="peso_normal">Peso Normal</option>
            <option value="sobrepeso">Sobrepeso</option>
            <option value="obesidade_grau_1">Obesidade Grau I</option>
            <option value="obesidade_grau_2">Obesidade Grau II</option>
            <option value="obesidade_grau_3">Obesidade Grau III</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-12 text-center text-stone-500">
          <div className="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Carregando histórico do banco de dados...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-stone-200 rounded-xl p-6">
          <User className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-700">Nenhuma avaliação encontrada</p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {records.length === 0
              ? 'Realize sua primeira avaliação na aba "Calculadora" e clique em "Salvar Avaliação" para criar o histórico.'
              : 'Nenhum registro corresponde aos filtros ou termo de busca informado.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 border-b border-stone-200">Data</th>
                  <th className="p-3 border-b border-stone-200">Paciente</th>
                  <th className="p-3 border-b border-stone-200 text-center">Peso</th>
                  <th className="p-3 border-b border-stone-200 text-center">Altura</th>
                  <th className="p-3 border-b border-stone-200 text-center">IMC</th>
                  <th className="p-3 border-b border-stone-200">Classificação</th>
                  <th className="p-3 border-b border-stone-200 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredRecords.map((record) => {
                  const info = WHO_CLASSIFICATIONS[record.classification] || WHO_CLASSIFICATIONS.peso_normal;
                  return (
                    <tr key={record.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                        {formatDateTime(record.createdAt)}
                      </td>
                      <td className="p-3 font-bold text-stone-900">
                        <div className="flex items-center gap-1.5">
                          <span>{record.name}</span>
                          {record.age && (
                            <span className="text-[10px] font-normal text-stone-500">({record.age}a)</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-stone-700 text-center font-medium">
                        {record.weight} kg
                      </td>
                      <td className="p-3 text-stone-700 text-center font-medium">
                        {(record.height / 100).toFixed(2)} m
                      </td>
                      <td className="p-3 text-center">
                        <span className="font-extrabold text-stone-900 text-sm">
                          {record.imc.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded-md border ${info.badgeClass}`}>
                          {record.classificationLabel}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPrintRecord(record)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-teal-50 text-stone-700 hover:text-teal-800 border border-stone-200 transition-colors cursor-pointer"
                            title="Imprimir laudo clínico"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id, record.name)}
                            disabled={deletingId === record.id}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 border border-stone-200 transition-colors cursor-pointer disabled:opacity-50"
                            title="Excluir avaliação"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredRecords.map((record) => {
              const info = WHO_CLASSIFICATIONS[record.classification] || WHO_CLASSIFICATIONS.peso_normal;
              return (
                <div key={record.id} className="p-4 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{record.name}</h4>
                      <p className="text-[11px] text-stone-500">{formatDateTime(record.createdAt)}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${info.badgeClass}`}>
                      {record.classificationLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs">
                    <div>
                      <span className="text-stone-500 block text-[10px]">Peso</span>
                      <span className="font-bold text-stone-800">{record.weight} kg</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px]">Altura</span>
                      <span className="font-bold text-stone-800">{(record.height / 100).toFixed(2)} m</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px]">IMC</span>
                      <span className="font-extrabold text-stone-900 text-sm">{record.imc.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-100">
                    <button
                      onClick={() => onPrintRecord(record)}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir</span>
                    </button>
                    <button
                      onClick={() => handleDelete(record.id, record.name)}
                      disabled={deletingId === record.id}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-red-700 border border-stone-200 cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
