/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
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
  ShieldCheck
} from "lucide-react";

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
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">1. Como configurar o WARP corretamente:</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-2 border-l border-indigo-500">
                      No aplicativo do <strong>WARP (1.1.1.1)</strong>, clique no menu de três linhas no canto superior e garanta que a opção selecionada seja <strong>"1.1.1.1 com WARP"</strong> e NÃO "Apenas 1.1.1.1". A opção "Apenas 1.1.1.1" muda apenas o DNS (o que ajuda no login), mas não cria o túnel seguro completo necessário para manter a conexão ativa nas salas 3D.
                    </p>

                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">2. Outras VPNs Gratuitas mais robustas para Jogos (Sockets/UDP):</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-indigo-500 block">ProtonVPN (Grátis & Sem Limite)</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            A melhor alternativa gratuita para jogos. Ela cria um túnel criptografado completo que lida muito melhor com conexões persistentes de portas de chat do IMVU e não possui limite de dados mensal.
                          </p>
                        </div>
                        <div className="flex gap-3 pt-2 mt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                          <a
                            href="https://play.google.com/store/apps/details?id=ch.protonvpn.android"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[10px] font-bold text-indigo-500 hover:underline"
                          >
                            <span>Android Play Store</span>
                            <Zap className="w-2.5 h-2.5" />
                          </a>
                          <a
                            href="https://apps.apple.com/app/proton-vpn-fast-secure/id1437005085"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[10px] font-bold text-blue-500 hover:underline"
                          >
                            <span>iOS App Store</span>
                            <Zap className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-blue-500 block">Windscribe VPN (Grátis 10GB/mês)</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            Possui o protocolo <strong>"Stealth" (Furtivo)</strong> em suas configurações. Esse modo mascara a VPN como tráfego comum, impedindo que o firewall do IMVU derrube a conexão nas salas.
                          </p>
                        </div>
                        <div className="flex gap-3 pt-2 mt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                          <a
                            href="https://play.google.com/store/apps/details?id=com.windscribe.vpn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[10px] font-bold text-indigo-500 hover:underline"
                          >
                            <span>Android Play Store</span>
                            <Zap className="w-2.5 h-2.5" />
                          </a>
                          <a
                            href="https://apps.apple.com/app/windscribe-vpn/id1129453758"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[10px] font-bold text-blue-500 hover:underline"
                          >
                            <span>iOS App Store</span>
                            <Zap className="w-2.5 h-2.5" />
                          </a>
                        </div>
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

                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-xs">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">💡 O que ele pode fazer para tentar resolver de vez sem precisar do WARP?</p>
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
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Instalar o app Cloudflare 1.1.1.1 (WARP)</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      O <strong>1.1.1.1 com WARP</strong> é um aplicativo oficial e gratuito na Google Play Store (Android) e App Store (iOS). Ele reconstrói a rota de rede inteira do seu celular por túneis seguros da Cloudflare, desviando de bloqueios do provedor em um único clique sem deixar a internet lenta.
                    </p>
                    <div className="flex gap-3 pt-1">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.cloudflare.onedotonedotonedotone"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-500 hover:underline"
                      >
                        <span>Android Play Store</span>
                        <Zap className="w-3 h-3" />
                      </a>
                      <a
                        href="https://apps.apple.com/app/1-1-1-1-faster-internet/id1423538605"
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
                  💡 Recomendação de Ouro: No celular, instalar o aplicativo <strong>WARP (1.1.1.1)</strong> da Cloudflare resolve instantaneamente 99% desses erros do IMVU sem precisar configurar nada manualmente.
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
