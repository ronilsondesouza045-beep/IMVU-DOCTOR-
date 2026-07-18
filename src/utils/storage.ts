/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DiagnosticReport } from "../types";

const STORAGE_KEY = "imvu_doctor_reports";

/**
 * Salva um relatório de diagnóstico no LocalStorage.
 */
export function saveReportToHistory(report: DiagnosticReport): void {
  try {
    const existing = getReportHistory();
    // Adicionar no início para que os mais recentes apareçam primeiro
    const updated = [report, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Falha ao salvar relatório no LocalStorage:", error);
  }
}

/**
 * Retorna todos os relatórios salvos no LocalStorage.
 */
export function getReportHistory(): DiagnosticReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error("Falha ao ler relatórios do LocalStorage:", error);
    return [];
  }
}

/**
 * Busca relatórios que correspondam ao termo de pesquisa na descrição, sumário ou plataforma.
 */
export function searchReportHistory(query: string): DiagnosticReport[] {
  const all = getReportHistory();
  if (!query.trim()) return all;

  const q = query.toLowerCase();
  return all.filter((r) => {
    const summaryMatch = r.summary?.toLowerCase().includes(q);
    const osMatch = r.deviceInfo?.os?.toLowerCase().includes(q);
    const issueMatch = r.userAnswers?.issueType?.toLowerCase().includes(q);
    const platformMatch = r.userAnswers?.platformUsed?.toLowerCase().includes(q);
    const errorMatch = r.ocrResult?.errorMessages?.some((msg) => msg.toLowerCase().includes(q));

    return summaryMatch || osMatch || issueMatch || platformMatch || errorMatch;
  });
}

/**
 * Deleta um relatório específico por ID.
 */
export function deleteReportFromHistory(id: string): void {
  try {
    const existing = getReportHistory();
    const filtered = existing.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Falha ao deletar relatório do LocalStorage:", error);
  }
}

/**
 * Limpa todo o histórico de diagnósticos.
 */
export function clearReportHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Falha ao limpar histórico do LocalStorage:", error);
  }
}
