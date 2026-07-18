/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UploadCloud,
  FileImage,
  Eye,
  Brain,
  Cpu,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Printer,
  X
} from "lucide-react";
import { readImageAsBase64 } from "../utils/ocr";
import { runOcrOnServer, generateSmartDiagnosis } from "../utils/diagnostic";
import { getDeviceInfo } from "../utils/device";
import { runNetworkDiagnostics } from "../utils/network";
import { saveReportToHistory } from "../utils/storage";
import { exportReportToPdf } from "../utils/report";
import { OCRResult, DiagnosticReport } from "../types";

interface ScreenshotAnalyzerProps {
  onCancel: () => void;
  onCompleted: (report: DiagnosticReport) => void;
}

export default function ScreenshotAnalyzer({ onCancel, onCompleted }: ScreenshotAnalyzerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadingStep, setLoadingStep] = useState<"none" | "ocr" | "network" | "diagnose">("none");
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear states on component clean
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (file: File) => {
    if (!file.type.match("image/(png|jpeg|jpg|webp)")) {
      setErrorMessage("Por favor, selecione apenas imagens válidas (PNG, JPG, JPEG ou WEBP).");
      return;
    }
    setErrorMessage(null);
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
    setOcrResult(null);
    setDiagnosticReport(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setErrorMessage(null);
    setLoadingStep("ocr");

    try {
      // 1. Converter imagem para base64
      const { base64, mimeType } = await readImageAsBase64(imageFile);

      // 2. Chamar o endpoint OCR
      const ocr = await runOcrOnServer(base64, mimeType);
      setOcrResult(ocr);

      // 3. Rodar diagnóstico completo combinando OCR, rede e hardware
      setLoadingStep("network");
      const devInfo = getDeviceInfo();
      const netResults = await runNetworkDiagnostics();

      setLoadingStep("diagnose");
      const report = await generateSmartDiagnosis(
        devInfo,
        netResults,
        ocr,
        {
          platformUsed: "Detectado na Screenshot",
          issueType: ocr.title || "Erro no aplicativo/tela",
          frequency: "Sempre",
          additionalDetails: `Análise automática disparada por captura de tela com OCR.\nMensagens extraídas: ${ocr.errorMessages.join(" | ")}`,
        }
      );

      setDiagnosticReport(report);
      saveReportToHistory(report);
      setLoadingStep("none");
    } catch (err: any) {
      console.error("Erro na análise da screenshot:", err);
      setErrorMessage(err.message || "Falha na análise. Por favor, tente novamente.");
      setLoadingStep("none");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setOcrResult(null);
    setDiagnosticReport(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl relative" id="screenshot-analyzer-container">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <FileImage className="w-5 h-5 mr-2 text-indigo-500" />
            Analisador Inteligente de Screenshots
          </h2>
          <p className="text-xs text-slate-400">Arraste uma captura de tela para extrairmos o texto e gerar diagnóstico</p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
        >
          Sair
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-sm text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="flex-1 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Main Panel Content */}
      <AnimatePresence mode="wait">
        {loadingStep === "none" && !diagnosticReport && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Image Drag and Drop and File Pick Zone */}
            {!imagePreview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? "border-indigo-500 bg-indigo-500/5"
                    : "border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 hover:border-indigo-500 hover:bg-slate-100/50 dark:hover:bg-slate-900/50"
                }`}
                id="dropzone-area"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                />
                <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                  <UploadCloud className="w-10 h-10 animate-bounce" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Arraste sua captura de tela ou clique para fazer upload
                  </p>
                  <p className="text-xs text-slate-400">PNG, JPG, JPEG ou WEBP (Max 10MB)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preview Card */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-video max-h-72 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Erro do IMVU"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-md"
                    title="Remover imagem"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* File details */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                    <FileImage className="w-5 h-5 text-indigo-500" />
                    <span className="text-xs font-semibold truncate max-w-xs">{imageFile?.name}</span>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    className="inline-flex items-center space-x-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
                    id="btn-trigger-screenshot-analysis"
                  >
                    <span>Analisar com IA</span>
                    <Brain className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Loading Steps screen */}
        {loadingStep !== "none" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 text-center py-12"
          >
            <div className="relative flex justify-center">
              <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {loadingStep === "ocr" && "Extraindo texto via OCR inteligente..."}
                {loadingStep === "network" && "Executando testes rápidos de rede..."}
                {loadingStep === "diagnose" && "Compilando resultados e gerando diagnóstico..."}
              </h3>
              <p className="text-xs text-slate-400">
                {loadingStep === "ocr" && "O Gemini está analisando pixels, identificando mensagens e códigos de erro..."}
                {loadingStep === "network" && "Iniciando conexões de teste com a CDN pública do IMVU..."}
                {loadingStep === "diagnose" && "Nossa IA em nuvem está cruzando as mensagens do erro com os parâmetros locais..."}
              </p>
            </div>
          </motion.div>
        )}

        {/* Diagnostic Result view */}
        {loadingStep === "none" && diagnosticReport && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Header Success info */}
            <div className="flex items-start space-x-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/50 rounded-2xl">
              <div className="p-2 bg-indigo-500 text-white rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Análise de Captura Concluída!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  O Gemini traduziu as mensagens extraídas do screenshot e sugeriu soluções corretivas.
                </p>
              </div>
            </div>

            {/* OCR Extracted Text */}
            {ocrResult && (
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 space-y-3">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Texto Extraído via OCR</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Título da Janela:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">{ocrResult.title || "Não identificado"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Códigos de Erro:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-mono font-bold">
                      {ocrResult.codes.length > 0 ? ocrResult.codes.join(", ") : "Nenhum código explícito"}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-slate-400 block text-xs font-semibold mb-1">Texto bruto encontrado:</span>
                  <p className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-lg text-[11px] font-mono leading-relaxed text-slate-600 dark:text-slate-400 max-h-24 overflow-y-auto whitespace-pre-line border border-slate-200/20">
                    {ocrResult.rawText}
                  </p>
                </div>
              </div>
            )}

            {/* AI Diagnosis Report summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parecer Geral da IA</h4>
              <p className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-sm text-slate-700 dark:text-slate-300 border border-slate-200/40 dark:border-slate-800/40 italic leading-relaxed">
                "{diagnosticReport.summary}"
              </p>
            </div>

            {/* Hypotheses */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hipóteses Identificadas & Soluções</h4>
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
                    <strong>Evidência da Screenshot:</strong> {hyp.reason}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Passos Recomendados para Resolução</span>
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => exportReportToPdf(diagnosticReport)}
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                id="btn-export-screenshot-pdf"
              >
                <Printer className="w-4 h-4" />
                <span>Exportar PDF Profissional</span>
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleRemoveImage}
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Nova Foto</span>
                </button>

                <button
                  onClick={() => onCompleted(diagnosticReport)}
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/15 transition-all cursor-pointer"
                  id="btn-finish-screenshot"
                >
                  <span>Concluir</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
