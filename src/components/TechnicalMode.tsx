/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Cpu,
  RefreshCw,
  Terminal,
  Activity,
  CheckCircle,
  XCircle,
  Network,
  Database,
  Chrome,
  Loader2
} from "lucide-react";
import { getDeviceInfo } from "../utils/device";
import { runNetworkDiagnostics } from "../utils/network";
import { DeviceInfo, NetworkTestResults } from "../types";

interface TechnicalModeProps {
  onCancel: () => void;
}

export default function TechnicalMode({ onCancel }: TechnicalModeProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [networkResults, setNetworkResults] = useState<NetworkTestResults | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiSupport, setApiSupport] = useState<Record<string, boolean>>({});

  const checkWebApis = () => {
    setApiSupport({
      "Connection API (navigator.connection)": "connection" in navigator,
      "Performance API (window.performance)": "performance" in window,
      "LocalStorage API": (() => {
        try {
          localStorage.setItem("__test__", "1");
          localStorage.removeItem("__test__");
          return true;
        } catch {
          return false;
        }
      })(),
      "IndexedDB API": "indexedDB" in window,
      "Service Workers API": "serviceWorker" in navigator,
      "WebSockets API": "WebSocket" in window,
      "WebGL rendering (Canvas 3D)": (() => {
        try {
          const canvas = document.createElement("canvas");
          return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
        } catch {
          return false;
        }
      })(),
      "Device Memory API": "deviceMemory" in navigator,
      "Hardware Concurrency API": "hardwareConcurrency" in navigator,
      "Screen Orientation API": "orientation" in screen,
      "Fetch API": "fetch" in window,
    });
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    setDeviceInfo(getDeviceInfo());
    checkWebApis();
    try {
      const results = await runNetworkDiagnostics();
      setNetworkResults(results);
    } catch (e) {
      console.error("Erro ao rodar diagnósticos no modo técnico:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    handleRefreshData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl space-y-8" id="technical-mode-container">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Terminal className="w-5 h-5 mr-2 text-amber-500 animate-pulse" />
            Console Técnico de Engenharia (Modo Técnico)
          </h2>
          <p className="text-xs text-slate-400">Verificação de baixo nível de APIs web, hardware e latências de rotas</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-300 rounded-lg transition-all cursor-pointer"
            title="Recarregar Métricas"
            id="btn-tech-refresh"
          >
            <RefreshCw className={`w-4.5 h-4.5 ${isRefreshing ? "animate-spin text-amber-500" : ""}`} />
          </button>
          <button
            onClick={onCancel}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Device & Browser metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Agent & Browser details */}
          {deviceInfo && (
            <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/30 dark:border-slate-800/40 space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Chrome className="w-4 h-4 mr-1.5 text-blue-500" />
                Dados do Navegador & Perfil OS
              </span>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">User Agent completo do navegador:</span>
                  <p className="bg-slate-100/80 dark:bg-slate-900 p-2.5 rounded-xl font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all border border-slate-200/10 leading-relaxed">
                    {deviceInfo.userAgent}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Tipo de Dispositivo:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{deviceInfo.deviceType}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Fuso Horário local:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{deviceInfo.timezone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Orientação da Tela:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{deviceInfo.orientation}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Resolução de renderização:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{deviceInfo.resolution}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Network ping logs */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/30 dark:border-slate-800/40 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <Network className="w-4 h-4 mr-1.5 text-indigo-500" />
              Tempo de Resposta Real de Alvos (RTT)
            </span>

            <div className="space-y-3">
              {networkResults ? (
                networkResults.tests.map((test, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-xl flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{test.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono block truncate max-w-xs">{test.endpoint}</span>
                    </div>

                    <div className="text-right flex items-center space-x-3">
                      {test.status === "success" ? (
                        <>
                          <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {test.latencyMs} ms
                          </span>
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                            FALHOU
                          </span>
                          <XCircle className="w-4.5 h-4.5 text-red-500" />
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: APIs and Web capabilities */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/30 dark:border-slate-800/40 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <Database className="w-4 h-4 mr-1.5 text-amber-500" />
              Verificação de APIs do Navegador
            </span>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              O IMVU depende de recursos de armazenamento e WebGL modernos para carregar itens 3D e renderizar janelas. Confira a compatibilidade de suas APIs locais abaixo:
            </p>

            <div className="space-y-2.5 text-xs">
              {Object.entries(apiSupport).map(([apiName, supported]) => (
                <div key={apiName} className="flex items-center justify-between py-1 border-b border-slate-200/20 dark:border-slate-800/40">
                  <span className="text-slate-600 dark:text-slate-400">{apiName}</span>
                  {supported ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Sim
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-500 flex items-center">
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Não
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hardware Concurrency panel */}
          {deviceInfo && (
            <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/30 dark:border-slate-800/40 space-y-3 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Cpu className="w-4 h-4 mr-1.5 text-blue-500" />
                Estatísticas de Hardware
              </span>

              <div className="flex justify-between">
                <span className="text-slate-400">Núcleos de Execução (Threads):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{deviceInfo.hardwareConcurrency} núcleos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Memória do Dispositivo:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{deviceInfo.deviceMemory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Proporção de Pixel de Tela:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{window.devicePixelRatio || 1}x</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
