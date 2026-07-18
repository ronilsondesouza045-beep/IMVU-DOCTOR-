/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Image,
  History,
  Cpu,
  ShieldAlert,
  Sparkles,
  Globe,
  Zap,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Search,
  CheckCircle2
} from "lucide-react";
import { checkIpReputation } from "../utils/network";
import { IpReputationResult } from "../types";

interface DashboardProps {
  onStartDiagnostics: () => void;
  onStartOcr: () => void;
  onOpenHistory: () => void;
  onOpenTechMode: () => void;
  savedReportsCount: number;
}

export default function Dashboard({
  onStartDiagnostics,
  onStartOcr,
  onOpenHistory,
  onOpenTechMode,
  savedReportsCount,
}: DashboardProps) {
  const [isVpnGuideOpen, setIsVpnGuideOpen] = useState(false);
  const [ipData, setIpData] = useState<IpReputationResult | null>(null);
  const [isCheckingIp, setIsCheckingIp] = useState(false);
  const [ipInput, setIpInput] = useState("");
  const [ipError, setIpError] = useState<string | null>(null);

  const fetchIpReputation = async (targetIp?: string) => {
    setIsCheckingIp(true);
    setIpError(null);
    try {
      const data = await checkIpReputation(targetIp);
      setIpData(data);
      if (targetIp) {
        setIpInput(data.ip);
      }
    } catch (err: any) {
      setIpError("Não foi possível carregar a reputação do IP.");
    } finally {
      setIsCheckingIp(false);
    }
  };

  useEffect(() => {
    fetchIpReputation();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-3xl border border-blue-500/20 shadow-lg shadow-blue-500/10 mb-2">
          <Activity className="w-12 h-12" id="logo-icon" />
        </div>
        <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-slate-900 dark:text-white">
          IMVU <span className="text-blue-600 dark:text-blue-400">Doctor AI Pro</span>
          <span className="text-xs align-super ml-1 px-1.5 py-0.5 bg-blue-600 text-white rounded font-bold">v1.0</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Suíte de diagnóstico avançado para o IMVU. Analise latências, extraia erros de capturas de tela e receba soluções inteligentes baseadas em IA para problemas de rede e conexão.
        </p>
      </motion.div>

      {/* Main Feature Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Card 1: Iniciar Diagnóstico */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative overflow-hidden group bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
          onClick={onStartDiagnostics}
          id="card-start-diagnostics"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
          <div className="flex items-start space-x-5 relative z-10">
            <div className="p-3.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Activity className="w-7 h-7" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center">
                Iniciar Diagnóstico Completo
                <Sparkles className="w-4 h-4 ml-2 text-amber-500 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Executa uma varredura geral incluindo integridade local do navegador, testes rápidos de latência com a CDN do IMVU e questionário técnico detalhado.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Analisar Screenshot */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative overflow-hidden group bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
          onClick={onStartOcr}
          id="card-analyze-screenshot"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
          <div className="flex items-start space-x-5 relative z-10">
            <div className="p-3.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Image className="w-7 h-7" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Analisar Screenshot (OCR)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Faça o upload de uma captura de tela do seu erro de conexão no IMVU. Nossa IA extrairá mensagens de erro e sugerirá soluções imediatas.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Histórico de Diagnósticos */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative overflow-hidden group bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
          onClick={onOpenHistory}
          id="card-view-history"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
          <div className="flex items-start space-x-5 relative z-10">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl relative">
              <History className="w-7 h-7" />
              {savedReportsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {savedReportsCount}
                </span>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Histórico de Diagnósticos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Revise diagnósticos passados, analise mudanças no desempenho de sua rede ao longo do tempo e reexporte relatórios profissionais em PDF.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Modo Técnico */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative overflow-hidden group bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-amber-500/50 dark:hover:border-amber-500/30 transition-all duration-300 cursor-pointer"
          onClick={onOpenTechMode}
          id="card-tech-mode"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500" />
          <div className="flex items-start space-x-5 relative z-10">
            <div className="p-3.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Cpu className="w-7 h-7" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Modo Técnico Avançado
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Aba detalhada de engenharia de rede. Visualize User Agent, testes HTTPS puros, suporte de APIs web avançadas e estatísticas detalhadas de hardware.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* IP Reputation & Blacklist Checker Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5 relative overflow-hidden"
        id="ip-reputation-panel"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4 relative z-10">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-emerald-500" />
              Verificador de Reputação de IP e Blacklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitore se o IP atual (ou de um amigo) foi banido, está em blacklists ou é detectado como VPN/Proxy de risco.
            </p>
          </div>
          <button
            onClick={() => fetchIpReputation()}
            disabled={isCheckingIp}
            className="flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors duration-200 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingIp ? "animate-spin" : ""}`} />
            <span>Atualizar Meu IP</span>
          </button>
        </div>

        {/* Manual Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2 relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Digite um endereço de IP para escanear (ex: 186.205.125.10)..."
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 dark:text-slate-200"
            />
          </div>
          <button
            onClick={() => fetchIpReputation(ipInput.trim() || undefined)}
            disabled={isCheckingIp}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-1 cursor-pointer shadow-sm shadow-blue-500/10"
          >
            {isCheckingIp ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Escanear IP</span>
            )}
          </button>
        </div>

        {/* Content Area */}
        {ipError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl">
            {ipError}
          </div>
        )}

        {isCheckingIp && !ipData && (
          <div className="py-8 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Verificando bases de dados de reputação de IP...</p>
          </div>
        )}

        {!isCheckingIp && ipData && (
          <div className="space-y-4 relative z-10">
            {/* IP Info Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Box 1: IP & ISP */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Endereço Analisado</span>
                <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>{ipData.ip}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    ipData.countryCode === "BR" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                  }`}>
                    {ipData.countryCode}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                  <p className="truncate"><strong>ISP:</strong> {ipData.isp}</p>
                  <p className="truncate"><strong>Local:</strong> {ipData.city}, {ipData.country}</p>
                </div>
              </div>

              {/* Box 2: Risk Meter */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pontuação de Risco</span>
                <div className="flex items-baseline justify-between">
                  <span className={`text-xl font-extrabold ${
                    ipData.threatLevel === "critical" ? "text-red-500 animate-pulse" :
                    ipData.threatLevel === "high" ? "text-orange-500" :
                    ipData.threatLevel === "medium" ? "text-yellow-500" : "text-emerald-500"
                  }`}>
                    {ipData.riskScore}%
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    ipData.threatLevel === "critical" ? "bg-red-500/10 text-red-500" :
                    ipData.threatLevel === "high" ? "bg-orange-500/10 text-orange-500" :
                    ipData.threatLevel === "medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-emerald-500/10 text-emerald-500"
                  }`}>
                    {ipData.threatLevel === "critical" ? "Crítico" :
                     ipData.threatLevel === "high" ? "Alto" :
                     ipData.threatLevel === "medium" ? "Médio" : "Limpo / Baixo"}
                  </span>
                </div>
                {/* Risk Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ipData.threatLevel === "critical" ? "bg-red-500" :
                      ipData.threatLevel === "high" ? "bg-orange-500" :
                      ipData.threatLevel === "medium" ? "bg-yellow-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${ipData.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Box 3: Proxy & Blacklist Status */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status Geral</span>
                <div className="text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">VPN / Proxy:</span>
                    <span className={`font-semibold ${ipData.isProxy ? "text-amber-500" : "text-emerald-500"}`}>
                      {ipData.isProxy ? "Sim (Ativo)" : "Não Detectado"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Hospedagem/Hosting:</span>
                    <span className={`font-semibold ${ipData.isHosting ? "text-amber-500" : "text-emerald-500"}`}>
                      {ipData.isHosting ? "Sim (Data Center)" : "Não (Residencial)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Blacklists Ativas:</span>
                    <span className={`font-semibold ${ipData.dnsbl.listedCount > 0 ? "text-red-500" : "text-emerald-500"}`}>
                      {ipData.dnsbl.listedCount} listada(s)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blacklist List Details */}
            <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-800/50 rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Varredura de Blacklists de DNS Públicas (DNSBL)</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ipData.dnsbl.results.map((bl, idx) => (
                  <div key={idx} className="bg-white/40 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block">{bl.name}</span>
                      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">{bl.desc}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-slate-200/20 dark:border-slate-800/20 pt-1.5">
                      <span className="text-[9px] text-slate-400 font-mono">{bl.host}</span>
                      {bl.isListed ? (
                        <span className="text-[9px] font-bold text-red-500 uppercase px-1.5 py-0.5 bg-red-500/10 rounded">
                          Bloqueado
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-500 uppercase px-1.5 py-0.5 bg-emerald-500/10 rounded">
                          Limpo
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HIGH RISK WARNING BANNER */}
            {(ipData.threatLevel === "critical" || ipData.threatLevel === "high" || ipData.dnsbl.listedCount > 0 || ipData.isProxy) && (
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-red-500/10 dark:bg-red-500/15 border border-red-500/20 rounded-xl space-y-3"
              >
                <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5 animate-pulse shrink-0" />
                  <strong className="font-bold text-xs uppercase tracking-wider">⚠️ ALERTA: Alto Risco de Bloqueio ou IP Banido no IMVU</strong>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed space-y-2">
                  <p>
                    O IP analisado apresenta indícios de risco ou está listado em listas negras públicas de tráfego nocivo. Isso é extremamente comum no Brasil devido ao uso de IPs compartilhados (CGNAT) e modems que não foram reiniciados recentemente.
                  </p>
                  <p className="font-bold text-red-700 dark:text-red-400 uppercase tracking-wider text-[10px]">
                    O que isso causa no IMVU?
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
                    <li><strong>Erro de Login (Authenticating...):</strong> O sistema de proteção do IMVU (como Cloudflare) bloqueia a entrada de IPs que constam em blacklists de spam/DDoS para prevenir bots.</li>
                    <li><strong>Desconexões Constantes:</strong> Seus pacotes de dados de sala 3D são rejeitados ou passam por atraso excessivo porque o servidor está filtrando o tráfego do seu IP.</li>
                  </ul>
                  <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                    💡 Como seu amigo limpa esse IP e anula o bloqueio sem usar VPN?
                  </p>
                  <p className="pl-3 border-l-2 border-red-500 font-bold text-slate-800 dark:text-slate-200 bg-white/30 dark:bg-slate-900/40 p-2 rounded-lg text-xs leading-relaxed">
                    Desligue o modem/roteador de Wi-Fi da tomada por 15 minutos inteiros. Isso força o provedor de internet a liberar o IP atual e entregar um novo endereço limpo que não está marcado por nenhum hacker ou blacklist.
                  </p>
                </div>
              </motion.div>
            )}

            {/* LOW RISK CONGRATS BANNER */}
            {ipData.threatLevel === "low" && ipData.dnsbl.listedCount === 0 && !ipData.isProxy && (
              <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 rounded-xl flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs text-slate-600 dark:text-slate-350">
                  <p className="font-bold text-emerald-700 dark:text-emerald-400">Reputação Excelente de IP!</p>
                  <p className="text-[11px]">Nenhuma blacklist ativa ou uso de proxy suspeito foi detectado neste IP. Sua rota direta para o IMVU está limpa!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Specialty Section: Only connects with VPN / Route Block bypass */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-2xl p-6 shadow-sm space-y-4"
        id="vpn-routing-helper-card"
      >
        <div
          onClick={() => setIsVpnGuideOpen(!isVpnGuideOpen)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left space-y-1">
              <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 flex items-center">
                SOS Conexão: Só Conecta Usando VPN?
                <span className="ml-2 text-[10px] bg-indigo-500 text-white font-extrabold px-1.5 py-0.5 rounded uppercase">Alta Relevância</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Descubra por que a limpeza de cache não resolveu e como forçar o bypass do bloqueio de IP/Rotas do seu provedor.
              </p>
            </div>
          </div>
          <span className="text-slate-400 bg-slate-100 dark:bg-slate-850 p-1.5 rounded-lg">
            {isVpnGuideOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </span>
        </div>

        <AnimatePresence>
          {isVpnGuideOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-indigo-500/10 pt-4 space-y-4 text-xs md:text-sm text-slate-600 dark:text-slate-350 leading-relaxed"
            >
              <div className="p-4 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-xl border border-indigo-500/10 space-y-2">
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider text-[11px]">O Diagnóstico Técnico</span>
                <p className="text-xs">
                  Quando o IMVU funciona <strong>apenas com VPN</strong>, significa que a conexão física de internet está saudável, mas as rotas diretas do seu provedor de internet (Claro, Vivo, Fibra local, etc.) até os servidores da CDN do IMVU estão bloqueadas, banidas temporariamente ou sofrendo envenenamento de DNS.
                </p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  ⚠️ Por que limpar o cache não resolveu?
                </p>
                <p className="text-xs pl-2.5 border-l-2 border-amber-500">
                  O "cache" limpa apenas arquivos temporários locais do seu dispositivo. Ele não altera seu endereço IP público e não reconstrói as rotas de rede que estão sendo filtradas ou bloqueadas pelo seu provedor ou pelo firewall do IMVU (como bloqueios automáticos do Cloudflare/Akamai por reputação de IP).
                </p>
              </div>

              {/* Explaining the 'Why' behind WARP/VPN */}
              <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/20 space-y-3">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[11px] flex items-center">
                  💡 ENTENDA O MOTIVO: Por que funciona com o app WARP/VPN mas não sem ele?
                </span>
                <p className="text-xs text-slate-650 dark:text-slate-300">
                  A explicação é simples e envolve o <strong>caminho (rota)</strong> que os dados da sua internet percorrem até o jogo:
                </p>
                <div className="space-y-2 text-xs pl-2.5 border-l-2 border-indigo-500">
                  <p>
                    <strong>❌ Conexão DIRETA (Sem VPN/WARP):</strong> O sinal sai do celular do seu amigo, passa pelo provedor de internet dele (Claro, Vivo, Tim, ou fibra local) e tenta chegar direto aos servidores do IMVU. Se a rota do provedor estiver com problemas técnicos, congestionada, ou se o IMVU tiver bloqueado temporariamente o IP da internet dele (muito comum em redes compartilhadas - CGNAT), a conexão <strong>falha com erro de carregamento infinito ou erro de login</strong>.
                  </p>
                  <p>
                    <strong>✅ Conexão INDIRETA (Com WARP ou VPN):</strong> O aplicativo do WARP cria uma "ponte" ou "desvio seguro". O celular dele envia os dados primeiro para um servidor de alta velocidade da Cloudflare. Como esse servidor tem caminhos excelentes e IPs limpos de altíssima reputação, ele busca as informações no IMVU sem qualquer bloqueio e envia de volta ao celular dele. É igual pegar um desvio livre de trânsito quando a avenida principal está interditada!
                  </p>
                </div>
                
                <div className="pt-2 border-t border-amber-500/10 space-y-2">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    🛠️ Tem como atualizar ou arrumar para entrar SEM o aplicativo no futuro?
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sim! O seu amigo não conseguirá "atualizar o jogo" para arrumar isso porque o erro está na rede do provedor dele, mas ele pode forçar o provedor a limpar o sinal seguindo estas dicas:
                  </p>
                  <ul className="list-disc pl-5 text-xs text-slate-550 dark:text-slate-400 space-y-1">
                    <li>
                      <strong>Reiniciar o Roteador por 15 minutos:</strong> Desligar o modem/roteador de internet da tomada por 10 a 15 minutos de verdade. Isso obriga a central do provedor a desligar a sessão dele e entregar um <strong>IP público totalmente novo e limpo</strong> quando ligar de novo, o que costuma destravar o IMVU instantaneamente.
                    </li>
                    <li>
                      <strong>Pedir a saída do CGNAT:</strong> Se a internet dele for de fibra pequena de bairro, ele pode ligar para o suporte e pedir para "tirarem ele do CGNAT" (IPv4 compartilhado) ou ativarem "IPv6 nativo".
                    </li>
                  </ul>
                </div>
              </div>

              {/* Explaining 'Why only on this phone and not others?' */}
              <div className="p-4 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-xl border border-indigo-500/20 space-y-3">
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider text-[11px] flex items-center">
                  🤔 CASO INTRIGANTE: Por que no celular dele dá erro, mas em OUTROS celulares na mesma casa entra normal?
                </span>
                <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                  Isso é muito comum e faz parecer que o celular está "quebrado", mas na verdade existem <strong>motivos técnicos de rede e segurança</strong> bem claros para isso acontecer:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/40 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200/40 dark:border-slate-800/40 space-y-1">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">1. Bloqueio de Segurança Temporário (IP/ID)</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      O sistema de segurança do IMVU (gerido pelo Cloudflare) pode ter bloqueado temporariamente as credenciais, o ID do dispositivo ou a sessão específica do celular dele (por exemplo, após errar a senha algumas vezes, ou devido a cookies travados que fazem requisições em excesso). O WARP desvia essa reputação negativa trocando a identidade da conexão.
                    </p>
                  </div>

                  <div className="bg-white/40 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200/40 dark:border-slate-800/40 space-y-1">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">2. DNS Privado ou Filtro de Ads no Celular</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      Este telefone em específico pode ter alguma configuração de "DNS Privado" ativada nas configurações do Android (como <code>dns.adguard.com</code>) ou aplicativos bloqueadores de anúncios instalados. Isso faz com que os domínios de imagem e login do IMVU sejam rejeitados pelo próprio aparelho, enquanto outros aparelhos na casa não têm essa barreira.
                    </p>
                  </div>

                  <div className="bg-white/40 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200/40 dark:border-slate-800/40 space-y-1">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">3. Conflito de Endereço MAC ou Roteador</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      Alguns roteadores de internet possuem firewall inteligente ou sistemas de controle dos pais ativos que bloqueiam canais de jogos de forma silenciosa para aparelhos específicos com base em seus endereços físicos (MAC Address).
                    </p>
                  </div>

                  <div className="bg-white/40 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200/40 dark:border-slate-800/40 space-y-1">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">4. Falha no WebView do Sistema Android</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      O IMVU carrega telas e autenticação através do "Android System WebView" (navegador interno do celular). Se ele estiver desatualizado ou corrompido neste aparelho específico, o jogo não consegue carregar a tela de login. O WARP força novos túneis que podem driblar travamentos de certificados de SSL antigos dessa ferramenta.
                    </p>
                  </div>
                </div>

                {/* ADVANCED: Room Disconnection and App Conflict Scan Helper */}
                <div className="p-4 bg-red-500/5 dark:bg-red-500/10 rounded-xl border border-red-500/20 space-y-3">
                  <span className="font-extrabold text-red-650 dark:text-red-400 block uppercase tracking-wider text-[11px] flex items-center">
                    ⚠️ PROBLEMA COMPLEMENTAR: "Consigo Logar com VPN, mas dá Desconexão ao Entrar em Salas"
                  </span>
                  <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                    Se o seu amigo consegue entrar no jogo com a VPN ligada, mas <strong>cai da sala de chat (desconexão imediata)</strong>, isso ocorre porque o login usa protocolo web simples (HTTP/TCP), enquanto a sala 3D exige conexões de pacotes de dados contínuos de alta velocidade (soquetes TCP/UDP persistentes). Se a VPN estiver lenta ou bloqueando essas portas, o jogo desconecta.
                  </p>

                  <div className="space-y-3 pt-1">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center">
                      🟢 VPN Ativa & Confirmada:
                    </h5>
                    <div className="bg-indigo-500/5 dark:bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/25 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider text-[11px]">
                          🛡️ WINDSCRIBE VPN (O Único que Funcionou!)
                        </span>
                        <p className="text-xs text-slate-650 dark:text-slate-300 mt-1 leading-relaxed">
                          O seu amigo já está utilizando o aplicativo do <strong>Windscribe VPN</strong> e ele confirmou que conseguiu logar com sucesso! Ele é excelente e oferece até 10GB de tráfego grátis todo mês. Veja abaixo como configurá-lo para que ele também fique <strong>extremamente rápido</strong> e pare de travar ao carregar salas de chat 3D pesadas.
                        </p>
                      </div>
                      <div className="flex gap-3 pt-2 mt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                        <a
                          href="https://play.google.com/store/apps/details?id=com.windscribe.vpn"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-500 hover:underline"
                        >
                          <span>Android Play Store</span>
                          <Zap className="w-3 h-3 animate-pulse" />
                        </a>
                        <a
                          href="https://apps.apple.com/app/windscribe-vpn/id1129453758"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-bold text-blue-500 hover:underline"
                        >
                          <span>iOS App Store</span>
                          <Zap className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center">
                      🔍 Varredura Manual: Aplicativos que causam conflito no celular
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Não existem aplicativos automáticos confiáveis para escanear outros apps (muitos são vírus disfarçados). O seu amigo deve fazer uma <strong>varredura visual rápida</strong> na lista de aplicativos dele e verificar se possui algum dos seguintes instalados, pois eles bloqueiam as salas do IMVU:
                    </p>
                    <ul className="list-disc pl-5 text-[11px] text-slate-650 dark:text-slate-400 space-y-1">
                      <li><strong>Bloqueadores de Anúncios / DNS:</strong> Aplicativos como <code>AdGuard</code>, <code>Blokada</code> ou <code>DNS Changer</code> agem como mini-VPNs locais e bloqueiam portas de servidores de imagens e avatares do IMVU, causando quedas constantes. Desative-os antes de jogar.</li>
                      <li><strong>Antivírus e Segurança Ativa:</strong> Aplicativos como <code>Avast Mobile</code>, <code>Kaspersky Security</code> ou <code>McAfee</code> podem identificar falsos-positivos na conexão contínua da sala do IMVU e fechar a conexão abruptamente.</li>
                      <li><strong>Aceleradores de Jogos / Game Boosters:</strong> Alguns aparelhos possuem ferramentas integradas para "otimizar bateria" que limitam o uso de dados em segundo plano ou derrubam conexões UDP de jogos pesados quando o telefone esquenta. Desative o modo de economia de energia.</li>
                    </ul>
                  </div>
                </div>

                    {/* NEW: Speed & Latency optimization for heavy 3D rooms */}
                    <div className="mt-3 p-3.5 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 rounded-xl space-y-4">
                      <span className="font-extrabold text-amber-700 dark:text-amber-400 block uppercase tracking-wider text-xs flex items-center">
                        ⚡ OTIMIZAÇÃO: Por que fica lento nas salas e como deixar o Windscribe rápido?
                      </span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-amber-500/15 space-y-1.5">
                          <strong className="text-amber-700 dark:text-amber-400 block font-bold">🐌 Por que ficou tão lento na sala?</strong>
                          <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-[11px]">
                            O Windscribe mascara o IP do celular dele, desviando do bloqueio do IMVU. Mas, ao entrar em salas de chat com muitas pessoas, o IMVU precisa baixar <strong>centenas de megabytes (MB)</strong> de roupas, cabelos, animações e móveis 3D de cada avatar. Como a VPN gratuita limita a velocidade de download e o joga para um servidor distante, carregar a sala vira uma eternidade!
                          </p>
                        </div>

                        <div className="p-3 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-amber-500/15 space-y-1.5">
                          <strong className="text-indigo-600 dark:text-indigo-400 block font-bold">🚀 Configuração: Como acelerar o Windscribe 10x</strong>
                          <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-[11px]">
                            Faça estes ajustes no aplicativo do Windscribe dele para aumentar a velocidade de carregamento nas salas:
                          </p>
                          <ol className="list-decimal pl-4 space-y-1 text-slate-500 dark:text-slate-450 text-[10.5px]">
                            <li>Abra o app do Windscribe &gt; toque no menu de três linhas &gt; vá em <strong>"Connection"</strong> (Conexão).</li>
                            <li>Toque em <strong>"Connection Mode"</strong> (Modo de Conexão), mude de Automático para <strong>Manual</strong>.</li>
                            <li>Nas opções que aparecerem, selecione o protocolo <strong>"WireGuard"</strong>. Ele é o protocolo leve de alta performance mais rápido que existe para jogos.</li>
                          </ol>
                        </div>
                      </div>

                      <div className="p-3.5 bg-indigo-500/10 dark:bg-indigo-500/25 rounded-xl border border-indigo-500/20 space-y-3">
                        <span className="font-extrabold text-indigo-700 dark:text-indigo-400 block uppercase tracking-wider text-[11px]">
                          🚀 A SOLUÇÃO DEFINITIVA (VELOCIDADE MÁXIMA DE 100% - SEM PRECISAR DE NENHUMA VPN):
                        </span>
                        
                        <div className="space-y-3 text-xs text-slate-650 dark:text-slate-300">
                          <div className="pl-3 border-l-2 border-indigo-500 space-y-1">
                            <strong className="text-indigo-700 dark:text-indigo-400 block font-bold">Configurar o DNS Privado Nativo no Celular</strong>
                            <p className="text-[11px] leading-relaxed">
                              Esta é a melhor opção disparada! Ela elimina a necessidade de usar o Windscribe ou qualquer app de VPN. Ela muda apenas a forma como o celular dele busca os servidores do IMVU diretamente pelo Android, contornando o bloqueio e jogando com <strong>100% da velocidade da internet dele (Wi-Fi de fibra ou 4G/5G)</strong>, fazendo com que as salas e pessoas carreguem na hora:
                            </p>
                            <p className="text-[10.5px] font-mono bg-white/50 dark:bg-slate-950/50 p-2 rounded border border-indigo-500/10 mt-1">
                              No celular dele: Vá em Configurações &gt; Rede e Internet &gt; Avançado &gt; <strong>DNS Privado</strong> &gt; Selecione "Nome do host do provedor de DNS privado" e digite: <br />
                              <strong className="text-indigo-600 dark:text-indigo-400">1dot1dot1dot1.cloudflare-dns.com</strong> (ou <strong className="text-indigo-600 dark:text-indigo-400">dns.google</strong>) e salve.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* NEW: Hacker Defence & IP Protection Panel */}
                    <div className="mt-3 p-4 bg-red-500/10 dark:bg-red-500/15 border border-red-500/25 rounded-xl space-y-3">
                      <span className="font-extrabold text-red-700 dark:text-red-400 block uppercase tracking-wider text-xs flex items-center">
                        <ShieldAlert className="w-4 h-4 mr-1.5 text-red-500 animate-pulse" />
                        🛡️ DEFESA DE REDE: "O rapaz bloqueou ou derrubou o IP do meu amigo" - O que fazer?
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed">
                        Se alguém usou uma ferramenta de hacker para "bloquear" ou "derrubar" o sinal dele, trata-se de um <strong>Ataque DDoS / Flooding</strong> ou uma <strong>lista negra de IP</strong>. O atacante pegou o endereço de IP do Wi-Fi dele (geralmente enviando um link falso de imagem/vídeo para ele clicar, ou através de aplicativos falsificados de moedas) e começou a enviar uma enxurrada de lixo digital para sufocar o modem de internet dele. É por isso que sem a VPN a internet direta dele não consegue abrir o IMVU.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs pt-1">
                        <div className="p-3 bg-white/50 dark:bg-slate-900/60 rounded-xl border border-red-500/15 space-y-2">
                          <strong className="text-red-700 dark:text-red-400 block font-bold text-xs">🚀 1. Mudar o IP do Celular e Wi-Fi na Hora (Anular o Hacker):</strong>
                          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">
                            Quase todas as operadoras de internet do Brasil (Claro, Vivo, Oi ou provedores locais de fibra) usam <strong>IP Dinâmico</strong>. O hacker só consegue atacar o IP que ele tinha naquele momento. Para trocar de IP e sumir da mira dele:
                          </p>
                          <ol className="list-decimal pl-4 text-[10.5px] text-slate-500 dark:text-slate-400 space-y-1">
                            <li><strong>Desligue o Roteador de Wi-Fi da tomada</strong> por completos <strong>10 a 15 minutos</strong> (não basta apenas desligar e ligar rápido, precisa dar esse tempo para a operadora fechar a conexão dele).</li>
                            <li>Ao ligar novamente, a central de rede entregará um <strong>endereço IP público totalmente novo e limpo</strong>.</li>
                            <li><strong>Resultado:</strong> O hacker ficará tentando atacar o IP antigo que já não pertence mais ao seu amigo, e o Wi-Fi dele voltará a funcionar instantaneamente com velocidade máxima e segurança total!</li>
                          </ol>
                        </div>

                        <div className="p-3 bg-white/50 dark:bg-slate-900/60 rounded-xl border border-red-500/15 space-y-2">
                          <strong className="text-red-700 dark:text-red-400 block font-bold text-xs">🔍 2. Varredura Geral de Segurança no Celular:</strong>
                          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">
                            Se o seu amigo baixou algum aplicativo modificado para tentar ganhar créditos grátis ou trapaças no IMVU, esse aplicativo pode ser um <strong>Trojan (Cavalo de Troia)</strong> que continua enviando o IP dele ao hacker em segundo plano:
                          </p>
                          <ol className="list-decimal pl-4 text-[10.5px] text-slate-500 dark:text-slate-400 space-y-1">
                            <li><strong>Google Play Protect (Nativo e Grátis):</strong> No celular dele, abra a <code>Google Play Store</code> &gt; toque no ícone do perfil dele no topo &gt; selecione <strong>"Play Protect"</strong> &gt; toque em <strong>"Verificar"</strong>. Isso fará um escaneamento completo no celular buscando malware e ferramentas invasoras ocultas.</li>
                            <li><strong>Apague Apps Suspeitos:</strong> Exclua imediatamente qualquer app de "Créditos Grátis", "Mod Menu", "IMVU hack" ou VPNs duvidosas não confiáveis.</li>
                            <li><strong>Proteja as Mensagens:</strong> Diga para ele nunca clicar em links encurtados ou estranhos enviados no chat do IMVU ou Discord por pessoas desconhecidas. Eles usam "IP Loggers" que capturam o endereço do celular no clique.</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-xs">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">💡 O que ele pode fazer para tentar resolver de vez sem precisar de VPN?</p>
                  <ol className="list-decimal pl-4 mt-1.5 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                    <li><strong>Desativar DNS Privado:</strong> Vá em Ajustes do celular &gt; Rede e Internet &gt; DNS Privado &gt; Mude de automático/manual para <strong>Desativado</strong>.</li>
                    <li><strong>Atualizar o Android System WebView:</strong> Procure por "Android System WebView" na Google Play Store e clique em Atualizar se houver atualização disponível.</li>
                    <li><strong>Limpar totalmente os Dados do App:</strong> Não apenas o cache! Vá em Ajustes &gt; Aplicativos &gt; IMVU &gt; Armazenamento &gt; <strong>Limpar Dados (Limpar Armazenamento)</strong>. Isso desloga qualquer conta e apaga arquivos de reputação ruins que podem estar travando as requisições.</li>
                  </ol>
                </div>
              </div>

              {/* Actionable Manual Guide */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center text-xs uppercase tracking-wide">
                  <BookOpen className="w-4 h-4 mr-1.5 text-indigo-500" />
                  Soluções Eficazes para Celular (Android e iPhone)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Step 1 */}
                  <div className="bg-white/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 space-y-2">
                    <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold">PASSO 1</span>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Instalar e Configurar o Windscribe VPN</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      O <strong>Windscribe VPN</strong> foi o aplicativo confirmado que funcionou para o celular do seu amigo. Garanta que ele esteja ativo para conseguir logar no IMVU, e mude o protocolo nas configurações do aplicativo de Automático para Manual escolhendo <strong>WireGuard</strong> para máxima performance nas salas 3D.
                    </p>
                    <div className="flex gap-3 pt-1">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.windscribe.vpn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-500 hover:underline"
                      >
                        <span>Android Play Store</span>
                        <Zap className="w-3 h-3" />
                      </a>
                      <a
                        href="https://apps.apple.com/app/windscribe-vpn/id1129453758"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-500 hover:underline"
                      >
                        <span>iOS App Store</span>
                        <Zap className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 space-y-2">
                    <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold">PASSO 2</span>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Mudar DNS nas Configurações de Wi-Fi</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Muitos provedores de Wi-Fi locais entregam DNS ruins. Você pode mudar manualmente no celular:
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <p>• <strong>Android:</strong> Vá em Configurações &gt; Rede/Wi-Fi &gt; Pressione na sua rede Wi-Fi &gt; Editar Rede/Avançado &gt; Mude de DHCP para <strong>Estático</strong> &gt; Defina DNS 1 como <code>1.1.1.1</code> e DNS 2 como <code>8.8.8.8</code>.</p>
                      <p>• <strong>iPhone:</strong> Ajustes &gt; Wi-Fi &gt; Toque no "i" azul ao lado da rede &gt; Configurar DNS &gt; Escolha <strong>Manual</strong> &gt; Adicione os servidores <code>1.1.1.1</code> e <code>8.8.8.8</code>.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 space-y-2">
                    <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold">PASSO 3</span>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Alternar Wi-Fi vs. Dados Móveis (4G/5G)</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Desligue o Wi-Fi e tente entrar usando apenas seus dados móveis 3G/4G/5G (ou vice-versa). Se o IMVU abrir normalmente na rede celular móvel, o seu provedor de Wi-Fi residencial está de fato aplicando uma rota corrompida ou bloqueando o IMVU temporariamente.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 space-y-2">
                    <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold">PASSO 4</span>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Limpeza Correta de Cache no Celular</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      A limpeza de cache simples raramente funciona se as rotas estiverem ruins. Mas para garantir que arquivos residuais de falhas passadas não fiquem travados:
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <p>• <strong>Android:</strong> Vá em Ajustes &gt; Aplicativos &gt; IMVU &gt; Armazenamento &gt; Toque em <strong>Limpar Dados</strong> e depois <strong>Limpar Cache</strong>. Em seguida, reinicie o aparelho celular.</p>
                      <p>• <strong>iPhone (iOS):</strong> Vá em Ajustes &gt; Geral &gt; Armazenamento do iPhone &gt; IMVU &gt; Toque em <strong>Desinstalar App</strong> (mantém seus dados salvos) e instale-o novamente da App Store.</p>
                    </div>
                  </div>
                </div>

                <div className="text-center bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  💡 Recomendação de Ouro: No celular do seu amigo, usar o <strong>Windscribe VPN</strong> configurado com protocolo <strong>WireGuard</strong> ou ativar o <strong>DNS Privado Nativo</strong> resolvem de vez os erros de conexão e de lentidão no IMVU!
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Limitation Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 bg-slate-100 dark:bg-slate-800/40 rounded-xl flex items-start space-x-3 text-xs text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/40"
      >
        <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Aviso de Limitação Técnica</p>
          <p>
            Esta ferramenta atua estritamente em ambiente sandbox do navegador web. Ela executa testes de conexões HTTPS reais e OCR assistido por IA, mas não possui acesso para executar ping ICMP direto, comandos traceroute ou analisar portas UDP de baixa latência utilizadas pelo motor 3D do IMVU.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
