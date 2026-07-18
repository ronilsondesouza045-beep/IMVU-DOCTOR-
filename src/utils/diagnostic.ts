/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeviceInfo, NetworkTestResults, OCRResult, UserAnswers, DiagnosticReport } from "../types";

/**
 * Envia uma imagem codificada em base64 para o servidor para extração de OCR via Gemini Vision.
 */
export async function runOcrOnServer(imageBase64: string, mimeType: string): Promise<OCRResult> {
  const response = await fetch("/api/ocr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageBase64, mimeType }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro de rede no servidor: ${response.status}`);
  }

  return response.json();
}

/**
 * Envia as métricas reais do sistema e respostas para o servidor gerar o diagnóstico inteligente via IA.
 */
export async function generateSmartDiagnosis(
  deviceInfo: DeviceInfo,
  testResults: NetworkTestResults,
  ocrResult: OCRResult | null,
  userAnswers: UserAnswers
): Promise<DiagnosticReport> {
  const response = await fetch("/api/diagnose", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deviceInfo,
      testResults,
      ocrResult,
      userAnswers,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro de rede no servidor: ${response.status}`);
  }

  const result = await response.json();

  return {
    id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    deviceInfo,
    testResults,
    ocrResult,
    userAnswers,
    summary: result.summary,
    hypotheses: result.hypotheses,
    limitations: result.limitations,
    isFallback: result.isFallback,
  };
}
