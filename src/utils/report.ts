/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DiagnosticReport } from "../types";

/**
 * Gera um layout HTML limpo e profissional focado em impressão e abre a caixa de diálogo de impressão
 * do navegador para exportar o relatório de diagnóstico como um PDF impecável.
 */
export function exportReportToPdf(report: DiagnosticReport): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Por favor, permita pop-ups para exportar o relatório como PDF.");
    return;
  }

  const formattedDate = new Date(report.timestamp).toLocaleString();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>IMVU Doctor AI Pro - Relatório Técnico [${report.id}]</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #1f2937;
          line-height: 1.5;
          margin: 0;
          padding: 40px;
          background-color: #ffffff;
        }
        .header {
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-title {
          font-size: 24px;
          font-weight: bold;
          color: #1e3a8a;
          margin: 0;
        }
        .meta-id {
          font-size: 14px;
          color: #6b7280;
          text-align: right;
        }
        .section {
          margin-bottom: 35px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #1e3a8a;
          text-transform: uppercase;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        .grid-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        th, td {
          font-size: 13px;
          padding: 8px 12px;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
        }
        th {
          background-color: #f9fafb;
          color: #4b5563;
          font-weight: 600;
        }
        .td-label {
          font-weight: 600;
          color: #4b5563;
          width: 40%;
        }
        .summary-box {
          background-color: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          border-radius: 4px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .hypothesis-card {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 15px;
          background-color: #fbfbfb;
        }
        .hypothesis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .hypothesis-title {
          font-weight: bold;
          font-size: 14px;
          color: #111827;
        }
        .badge {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: bold;
        }
        .badge-alta { background-color: #fecaca; color: #991b1b; }
        .badge-media { background-color: #fef08a; color: #854d0e; }
        .badge-baixa { background-color: #d1fae5; color: #065f46; }
        .bullet-list {
          margin: 0;
          padding-left: 20px;
          font-size: 13px;
        }
        .bullet-list li {
          margin-bottom: 4px;
        }
        .footer {
          margin-top: 50px;
          border-top: 1px solid #e5e7eb;
          padding-top: 15px;
          font-size: 11px;
          color: #9ca3af;
          text-align: center;
        }
        @media print {
          body {
            padding: 20px;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="logo-title">IMVU DOCTOR AI PRO</h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #4b5563;">Relatório Completo de Diagnóstico de Rede</p>
        </div>
        <div class="meta-id">
          <div>ID: <strong>${report.id}</strong></div>
          <div>Gerado em: ${formattedDate}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Resumo do Diagnóstico</div>
        <div class="summary-box">
          ${report.summary}
        </div>
      </div>

      <div class="grid-two">
        <div class="section">
          <div class="section-title">Informações do Dispositivo</div>
          <table>
            <tr><td class="td-label">Sistema Operacional</td><td>${report.deviceInfo.os}</td></tr>
            <tr><td class="td-label">Navegador</td><td>${report.deviceInfo.browser}</td></tr>
            <tr><td class="td-label">Dispositivo</td><td>${report.deviceInfo.deviceType}</td></tr>
            <tr><td class="td-label">Resolução</td><td>${report.deviceInfo.resolution}</td></tr>
            <tr><td class="td-label">Núcleos de CPU</td><td>${report.deviceInfo.hardwareConcurrency} núcleos</td></tr>
            <tr><td class="td-label">Timezone</td><td>${report.deviceInfo.timezone}</td></tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Resultados dos Testes de Rede</div>
          <table>
            <thead>
              <tr>
                <th>Servidor / Alvo</th>
                <th>Latência</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${report.testResults.tests.map(test => `
                <tr>
                  <td>${test.name}</td>
                  <td>${test.latencyMs !== undefined ? `${test.latencyMs}ms` : 'N/A'}</td>
                  <td style="color: ${test.status === 'success' ? '#059669' : '#dc2626'}; font-weight: bold;">
                    ${test.status === 'success' ? 'ONLINE' : 'FALHOU'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="font-size: 11px; color: #6b7280; margin: 5px 0 0 0;">
            Velocidade Estimada Local: ${report.testResults.connectionSpeed || 'Não disponível'}
          </p>
        </div>
      </div>

      ${report.ocrResult ? `
        <div class="section">
          <div class="section-title">Informações Extraídas de Screenshot</div>
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 15px; font-size: 13px;">
            <p style="margin-top: 0;"><strong>Título Encontrado:</strong> ${report.ocrResult.title || 'Nenhum'}</p>
            <p><strong>Mensagens de Erro:</strong> ${report.ocrResult.errorMessages.length > 0 ? report.ocrResult.errorMessages.join(' | ') : 'Nenhuma detectada'}</p>
            <p><strong>Códigos de Erro:</strong> ${report.ocrResult.codes.length > 0 ? report.ocrResult.codes.join(', ') : 'Nenhum'}</p>
            <p style="margin-bottom: 0; white-space: pre-line; font-family: monospace; font-size: 11px; background: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${report.ocrResult.rawText}
            </p>
          </div>
        </div>
      ` : ''}

      <div class="section">
        <div class="section-title font-bold">Relato do Usuário</div>
        <table style="margin-bottom: 0;">
          <tr><td class="td-label">Plataforma Usada</td><td>${report.userAnswers.platformUsed}</td></tr>
          <tr><td class="td-label">Tipo de Problema</td><td>${report.userAnswers.issueType}</td></tr>
          <tr><td class="td-label">Frequência</td><td>${report.userAnswers.frequency}</td></tr>
          <tr><td class="td-label">Detalhes Adicionais</td><td>${report.userAnswers.additionalDetails || 'Nenhum detalhe adicional fornecido.'}</td></tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Análise de Hipóteses & Soluções com IA</div>
        ${report.hypotheses.map(hyp => `
          <div class="hypothesis-card">
            <div class="hypothesis-header">
              <span class="hypothesis-title">${hyp.title}</span>
              <span class="badge badge-${hyp.confidence.toLowerCase()}">Confiança: ${hyp.confidence}</span>
            </div>
            <p style="font-size: 13px; margin: 0 0 10px 0; color: #4b5563;">
              <strong>Evidência:</strong> ${hyp.reason}
            </p>
            <div style="font-size: 13px; font-weight: 600; margin-bottom: 5px; color: #1e3a8a;">Ações Recomendadas:</div>
            <ul class="bullet-list">
              ${hyp.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Limitações Técnicas do Diagnóstico</div>
        <ul class="bullet-list" style="color: #6b7280; font-size: 12px;">
          ${report.limitations.map(lim => `<li>${lim}</li>`).join('')}
          <li>Este diagnóstico é baseado em testes HTTPS no navegador e não substitui uma verificação direta de rede do console do sistema ou uma solicitação oficial ao suporte do IMVU.</li>
        </ul>
      </div>

      <div class="footer">
        <p>IMVU Doctor AI Pro v1.0 • Diagnósticos inteligentes para jogos virtuais.</p>
        <p style="font-size: 9px; margin-top: 5px; color: #d1d5db;">Não possui qualquer afiliação oficial com a IMVU Inc.</p>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
