/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NetworkTestResults, NetworkTest } from "../types";

/**
 * Executa testes reais de conexão com servidores locais e remotos.
 * Utiliza o modo 'no-cors' para obter tempos de resposta legítimos de domínios públicos do IMVU.
 */
export async function runNetworkDiagnostics(
  onProgress?: (testName: string, index: number, total: number) => void
): Promise<NetworkTestResults> {
  const navigatorOnline = navigator.onLine;

  const testsToRun = [
    {
      name: "Conexão com o Servidor Local (API)",
      endpoint: "/api/health",
      useCors: true,
    },
    {
      name: "Site Público do IMVU (Home)",
      endpoint: "https://www.imvu.com/favicon.ico",
      useCors: false,
    },
    {
      name: "Servidor de Imagens IMVU (Static)",
      endpoint: "https://static-files.imvu.com/images/favicons/favicon.ico",
      useCors: false,
    },
    {
      name: "Servidor DNS Cloudflare (Status)",
      endpoint: "https://cloudflare.com/cdn-cgi/trace",
      useCors: false, // cloudflare doesn't allow cors on this, use no-cors to test route
    },
  ];

  const tests: NetworkTest[] = [];

  for (let i = 0; i < testsToRun.length; i++) {
    const t = testsToRun[i];
    if (onProgress) {
      onProgress(t.name, i + 1, testsToRun.length);
    }

    const startTime = performance.now();
    const testResult: NetworkTest = {
      name: t.name,
      endpoint: t.endpoint,
      status: "pending",
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const options: RequestInit = {
        signal: controller.signal,
        method: "GET",
      };

      if (!t.useCors) {
        options.mode = "no-cors";
      }

      const response = await fetch(t.endpoint, options);
      clearTimeout(timeoutId);

      const endTime = performance.now();
      testResult.latencyMs = Math.round(endTime - startTime);
      testResult.status = "success";
      testResult.statusCode = response.status || 200; // in no-cors, status is 0, we can default to 200
    } catch (err: any) {
      const endTime = performance.now();
      testResult.latencyMs = Math.round(endTime - startTime);
      testResult.status = "failed";
      testResult.errorMessage = err.name === "AbortError" 
        ? "Tempo limite de conexão esgotado (Timeout de 6s)" 
        : err.message || "Falha na requisição de rede";
    }

    tests.push(testResult);
  }

  // Obter velocidade estimada através da Connection API se suportado
  let connectionSpeed = "Desconhecida";
  const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (conn) {
    connectionSpeed = conn.downlink ? `${conn.downlink} Mbps` : "Disponível";
    if (conn.rtt) {
      connectionSpeed += ` (RTT: ${conn.rtt}ms)`;
    }
  }

  return {
    navigatorOnline,
    connectionSpeed,
    tests,
  };
}
