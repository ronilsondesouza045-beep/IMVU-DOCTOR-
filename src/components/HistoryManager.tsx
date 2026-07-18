/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  History,
  Search,
  Trash2,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  Calendar,
  X
} from "lucide-react";
import { getReportHistory, searchReportHistory, deleteReportFromHistory, clearReportHistory } from "../utils/storage";
import { exportReportToPdf } from "../utils/report";
import { DiagnosticReport } from "../types";

interface HistoryManagerProps {
  onCancel: () => void;
}

export default function HistoryManager({ onCancel }: HistoryManagerProps) {
  const [reports, setReports] = useState<DiagnosticReport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    setReports(getReportHistory());
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setReports(searchReportHistory(val));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid expanding card
    if (confirm("Deseja realmente excluir este diagnóstico do histórico?")) {
      deleteReportFromHistory(id);
      setReports(searchReportHistory(searchQuery));
      if (expandedReportId === id) setExpandedReportId(null);
    }
  };

  const handleClearAll = () => {
    if (confirm("Atenção: Isso excluirá permanentemente todos os relatórios salvos localmente. Continuar?")) {
      clearReportHistory();
      setReports([]);
      setExpandedReportId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedReportId(expandedReportId === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl" id="history-manager-container">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <History className="w-5 h-5 mr-2 text-emerald-500" />
            Histórico Técnico de Diagnósticos
          </h2>
          <p className="text-xs text-slate-400">Pesquise, filtre e imprima diagnósticos arquivados</p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
        >
          Sair
        </button>
      </div>

      {/* Control bar (Search + Clear All) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por erro, OS, etc..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {reports.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline inline-flex items-center space-x-1 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Histórico Completo</span>
          </button>
        )}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800/40 text-slate-400 rounded-full">
              <History className="w-10 h-10" />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Nenhum diagnóstico registrado no histórico.</p>
            <p className="text-xs text-slate-400">Inicie um novo diagnóstico ou envie uma captura para salvá-la aqui.</p>
          </div>
        ) : (
          reports.map((report) => {
            const isExpanded = expandedReportId === report.id;
            const formattedDate = new Date(report.timestamp).toLocaleString();

            return (
              <div
                key={report.id}
                className={`border rounded-xl transition-all duration-300 ${
                  isExpanded
                    ? "border-emerald-500/50 bg-emerald-500/[0.01] dark:bg-emerald-500/[0.02]"
                    : "border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(report.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {report.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {report.userAnswers.issueType || "Diagnóstico de Rede"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {formattedDate} • {report.deviceInfo.os}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <button
                      onClick={(e) => handleDelete(report.id, e)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Excluir do histórico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportReportToPdf(report);
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Exportar como PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <span className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                    </span>
                  </div>
                </div>

                {/* Expanded Details Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-slate-100 dark:border-slate-800/80"
                    >
                      <div className="p-4 space-y-4 text-xs">
                        {/* Summary */}
                        <div className="space-y-1 bg-slate-100/50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-200/20">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Sumário Técnico</span>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                            "{report.summary}"
                          </p>
                        </div>

                        {/* Hypotheses */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Soluções Identificadas</span>
                          <div className="space-y-2">
                            {report.hypotheses.map((hyp, hIdx) => (
                              <div key={hIdx} className="bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center">
                                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-500" />
                                    {hyp.title}
                                  </span>
                                  <span className="text-[9px] font-bold uppercase text-amber-600 dark:text-amber-400">Confiança: {hyp.confidence}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-[11px] mb-2 leading-relaxed">
                                  {hyp.reason}
                                </p>
                                <ul className="list-disc list-inside space-y-0.5 pl-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                                  {hyp.recommendations.map((rec, rIdx) => (
                                    <li key={rIdx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Hardware/Network quick info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block">Estatísticas de Rede</span>
                            <div className="space-y-1 text-slate-600 dark:text-slate-400">
                              <p>Conexão Local: <span className="font-semibold text-emerald-500">ONLINE</span></p>
                              {report.testResults.tests.map((t, idx) => (
                                <p key={idx} className="text-[10px] pl-2 font-mono flex justify-between">
                                  <span>{t.name}:</span>
                                  <span className={t.status === "success" ? "text-emerald-500" : "text-red-500"}>
                                    {t.latencyMs !== undefined ? `${t.latencyMs}ms` : "Falhou"}
                                  </span>
                                </p>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block">Configurações do Dispositivo</span>
                            <div className="space-y-0.5 text-slate-600 dark:text-slate-400">
                              <p>Navegador: <span className="font-semibold">{report.deviceInfo.browser}</span></p>
                              <p>Idioma: <span className="font-semibold">{report.deviceInfo.language}</span></p>
                              <p>Resolução: <span className="font-semibold">{report.deviceInfo.resolution}</span></p>
                              <p>Fuso Horário: <span className="font-semibold">{report.deviceInfo.timezone}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
