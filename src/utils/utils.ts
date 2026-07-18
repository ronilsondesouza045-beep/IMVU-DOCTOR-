/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Faz o fluxo de execução esperar um tempo específico em milissegundos.
 */
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Formata tamanhos em bytes para leituras humanas (KB, MB, GB, etc.)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Corta um texto se ultrapassar um certo limite de caracteres.
 */
export function truncateText(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + "...";
}
