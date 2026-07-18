/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Cpu,
  Wifi,
  HelpCircle,
  Brain,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
  Printer,
  FileSpreadsheet
} from "lucide-react";
import { getDeviceInfo } from "../utils/device";
import { runNetworkDiagnostics } from "../utils/network";
import { generateSmartDiagnosis } from "../utils/diagnostic";
import { DeviceInfo, NetworkTestResults, UserAnswers, DiagnosticReport } from "../types";
import { saveReportToHistory } from "../utils/storage";
import { exportReportToPdf } from "../utils/report";

interface DiagnosticsRunnerProps {
  onCancel: () => void;
  onCompleted: (report: DiagnosticReport) => void;
}

type Step = "system" | "network" | "form" | "loading" | "result";

const REASSURANCE_PHRASES = [
  "Lendo informações do dispositivo e navegador...",
  "Iniciando testes HTTPS de baixa latência...",
  "Testando rotas do IMVU...",
  "Avaliando estabilidade com DNS Cloudflare...",
  "Cruzando dados de latência e hardware...",
  "Consultando Inteligência Artificial do Gemini...",
  "Gerando hipóteses diagnósticas profissionais..."
];

export default function DiagnosticsRunner({ onCancel, onCompleted }: DiagnosticsRunnerProps) {
  const [currentStep, setCurrentStep] = useState<Step>("system");
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [networkResults, setNetworkResults] = useState<NetworkTestResults | null>(null);
  const [currentTestName, setCurrentTestName] = useState("");
  const [testProgress, setTestProgress] = useState(0);

  // Questionnaire answers
  const [answers, setAnswers] = useState<UserAnswers>({
    platformUsed: "IMVU Desktop (Windows/macOS)",
    issueType: "Problemas para Logar",
    frequency: "Sempre",
    additionalDetails: "",
  });

  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Detect system immediately on mount
  useEffect(() => {
    setDeviceInfo(getDeviceInfo());
  }, []);

  // Interval for changing loading phrases
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === "loading") {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % REASSURANCE_PHRASES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  const handleStartNetworkTests = async () => {
    setCurrentStep("network");
    setTestProgress(0);
    try {
      const results = await runNetworkDiagnostics((testName, current, total) => {
        setCurrentTestName(testName);
        setTestProgress(Math.round((current / total) * 100));
      });
      setNetworkResults(results);
      // Wait briefly so the user sees 100% progress completed
      setTimeout(() => {
        setCurrentStep("form");
      }, 800);
    } catch (err: any) {
      setErrorMessage("Ocorreu um erro ao rodar os testes de rede.");
      setCurrentStep("system");
    }
  };

  const handleRunAiAnalysis = async () => {
    if (!deviceInfo || !networkResults) return;
    setCurrentStep("loading");
    setErrorMessage(null);

    try {
      const report = await generateSmartDiagnosis(
        deviceInfo,
        networkResults,
        null, // No screenshot in default diagnostic runner
        answers
      );

      setDiagnosticReport(report);
      saveReportToHistory(report);
      setCurrentStep("result");
    } catch (err: any) {
      console.error("Erro no diagnóstico:", err);
      setErrorMessage(err.message || "Falha ao gerar diagnóstico com a IA. Verifique sua conexão ou tente mais tarde.");
      setCurrentStep("form");
    }
  };

  const getStepProgress = (): number => {
    switch (currentStep) {
      case "system": return 20;
      case "network": return 40;
      case "form": return 60;
      case "loading": return 85;
      case "result": return 100;
      default: return 0;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl relative" id="diagnostics-runner-container">
      {/* Top Header/Progress */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500 animate-pulse" />
            Assistente de Diagnóstico
          </h2>
          <p className="text-xs text-slate-400">Verificação técnica assistida passo a passo</p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
          id="btn-cancel-diagnostics"
        >
          Sair
        </button>
      </div>

      {/* Main Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
          animate={{ width: `${getStepProgress()}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-sm text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="flex-1 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Step Components Routing */}
      <AnimatePresence mode="wait">
        {/* Step 1: System Coleta */}
        {currentStep === "system" && deviceInfo && (
          <motion.div
            key="system"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 text-slate-800 dark:text-slate-100 font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              <Cpu className="w-5 h-5 text-blue-500" />
              <h3>Passo 1: Varredura de Sistema e Hardware</h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Os dados abaixo foram coletados de forma segura e local através do seu navegador. Eles serão usados para cruzarmos informações de compatibilidade com os requisitos mínimos de conectividade e hardware do IMVU.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Sistema Operacional</span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{deviceInfo.os}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Navegador</span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{deviceInfo.browser}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tipo de Dispositivo</span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{deviceInfo.deviceType}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Processador (Núcleos de CPU)</span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{deviceInfo.hardwareConcurrency} núcleos</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Resolução de Tela</span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{deviceInfo.resolution}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Timezone</span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{deviceInfo.timezone}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleStartNetworkTests}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/10 transition-all cursor-pointer"
                id="btn-goto-network"
              >
                <span>Próximo: Testes de Rede</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Network Testing */}
        {currentStep === "network" && (
          <motion.div
            key="network"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center py-8"
          >
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Executando Testes de Rede</h3>
              <p className="text-sm text-blue-500 font-semibold animate-pulse">{currentTestName}</p>
              <p className="text-xs text-slate-400">Medindo tempos de resposta HTTP e conexões com domínios de CDN do IMVU.</p>
            </div>

            <div className="max-w-md mx-auto bg-slate-100 dark:bg-slate-800/80 h-3 rounded-full overflow-hidden border border-slate-200/30 dark:border-slate-700/30">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${testProgress}%` }}
              />
            </div>
            <p className="text-xs font-bold text-slate-500">{testProgress}% concluído</p>
          </motion.div>
        )}

        {/* Step 3: Support Form / Questionnaire */}
        {currentStep === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 text-slate-800 dark:text-slate-100 font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <h3>Passo 2: Entender o seu problema</h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Responda estas perguntas rápidas sobre a falha para guiar nossa Inteligência Artificial na criação de hipóteses e soluções personalizadas.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Qual plataforma do IMVU você está utilizando?</label>
                  <select
                    value={answers.platformUsed}
                    onChange={(e) => setAnswers({ ...answers, platformUsed: e.target.value })}
                    className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-2.5 outline-none focus:border-blue-500 transition-colors"
                  >
                    <option>IMVU Desktop (Windows/macOS)</option>
                    <option>IMVU Mobile App (Android)</option>
                    <option>IMVU Mobile App (iOS - iPhone/iPad)</option>
                    <option>IMVU Website Clássico</option>
                    <option>IMVU Next / IMVU Web</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Qual o tipo do problema?</label>
                  <select
                    value={answers.issueType}
                    onChange={(e) => setAnswers({ ...answers, issueType: e.target.value })}
                    className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-2.5 outline-none focus:border-blue-500 transition-colors"
                  >
                    <option>Problemas para Logar (Erro de senha/auth)</option>
                    <option>Só consigo conectar usando VPN (Bloqueio de IP/Rota do Provedor)</option>
                    <option>Erro: "Estamos enfrentando alguns problemas técnicos aqui" no Login</option>
                    <option>Desconexões frequentes durante o jogo</option>
                    <option>Lentidão, Latência ou Lag alto em Salas de Chat</option>
                    <option>Carregamento infinito de roupas ou salas</option>
                    <option>O jogo sequer abre ou fecha sozinho</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Com que frequência isso ocorre?</label>
                <select
                  value={answers.frequency}
                  onChange={(e) => setAnswers({ ...answers, frequency: e.target.value })}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-2.5 outline-none focus:border-blue-500 transition-colors animate-none"
                >
                  <option>Sempre (Impossível jogar)</option>
                  <option>Intermitente (Vem e vai)</option>
                  <option>É a primeira vez que acontece</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Detalhes Adicionais (Opcional)</label>
                <textarea
                  value={answers.additionalDetails}
                  onChange={(e) => setAnswers({ ...answers, additionalDetails: e.target.value })}
                  placeholder="Ex: Ocorre há 3 dias após atualizar meu Windows; o erro mostra o código X..."
                  rows={3}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-2.5 outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setCurrentStep("system")}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                onClick={handleRunAiAnalysis}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/10 transition-all cursor-pointer"
                id="btn-run-ai-analysis"
              >
                <span>Analisar com IA</span>
                <Brain className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Loading AI Diagnosis */}
        {currentStep === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 text-center py-12"
          >
            <div className="relative flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
              </div>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Análise Inteligente por IA</h3>
              <p className="text-xs text-slate-400">Nossos algoritmos do Gemini estão processando os tempos de rota e logs do dispositivo...</p>
            </div>

            {/* Reassurance text */}
            <div className="h-6 overflow-hidden">
              <motion.p
                key={loadingPhraseIndex}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400"
              >
                {REASSURANCE_PHRASES[loadingPhraseIndex]}
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Step 5: Report Results */}
        {currentStep === "result" && diagnosticReport && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Success Banner */}
            <div className="flex items-start space-x-4 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-2xl">
              <div className="p-2 bg-blue-500 text-white rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Diagnóstico Concluído com Sucesso!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">A IA cruzou todas as informações de latência e gerou soluções práticas para seu caso.</p>
              </div>
            </div>

            {/* Summary Box */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resumo do Problema</h4>
              <p className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-sm text-slate-700 dark:text-slate-300 border border-slate-200/40 dark:border-slate-800/40 italic leading-relaxed">
                "{diagnosticReport.summary}"
              </p>
            </div>

            {/* Diagnostical Hypotheses */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Causas Prováveis & Recomendações Técnicas</h4>
              
              {diagnosticReport.hypotheses.map((hyp, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                      {hyp.title}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wide ${
                      hyp.confidence === "Alta"
                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                        : hyp.confidence === "Média"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}>
                      Confiança: {hyp.confidence}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong>Por que esta hipótese?</strong> {hyp.reason}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Como Resolver (Passo a Passo)</span>
                    <ul className="space-y-1.5 list-disc list-inside">
                      {hyp.recommendations.map((rec, recIdx) => (
                        <li key={recIdx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* System limitations */}
            <div className="bg-slate-100 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-200/40 dark:border-slate-700/30">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Limitações Técnicas do Navegador</span>
              <ul className="list-disc list-inside space-y-1">
                {diagnosticReport.limitations.map((lim, idx) => (
                  <li key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {lim}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => exportReportToPdf(diagnosticReport)}
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                id="btn-print-pdf"
              >
                <Printer className="w-4 h-4" />
                <span>Exportar PDF Profissional</span>
              </button>

              <button
                onClick={() => onCompleted(diagnosticReport)}
                className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/15 transition-all cursor-pointer"
                id="btn-done-diagnostics"
              >
                <span>Concluir e Voltar</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
