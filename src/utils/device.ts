/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeviceInfo } from "../types";

/**
 * Detecta de forma real e detalhada as informações do sistema e do hardware do usuário.
 */
export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  
  // 1. Detectar Sistema Operacional
  let os = "Desconhecido";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS (iPhone/iPad)";
  else if (/linux/i.test(ua)) os = "Linux";

  // 2. Detectar Navegador
  let browser = "Desconhecido";
  if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua) && !/opr|opera/i.test(ua)) {
    browser = "Google Chrome";
  } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    browser = "Apple Safari";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Mozilla Firefox";
  } else if (/edge|edg/i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/opr|opera/i.test(ua)) {
    browser = "Opera";
  }

  // 3. Detectar Idioma
  const language = navigator.language || "pt-BR";

  // 4. Timezone
  let timezone = "Desconhecido";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    console.error("Erro ao obter timezone:", e);
  }

  // 5. Resolução e Orientação
  const width = window.screen.width;
  const height = window.screen.height;
  const resolution = `${width}x${height}`;
  
  let orientation = "Desconhecida";
  if (window.screen.orientation && window.screen.orientation.type) {
    orientation = window.screen.orientation.type;
  } else {
    orientation = window.innerHeight > window.innerWidth ? "portrait-primary" : "landscape-primary";
  }

  // 6. Memória do Dispositivo (quando suportado pelo navegador)
  let deviceMemory = "Não suportado pelo navegador";
  if ("deviceMemory" in navigator) {
    deviceMemory = `${(navigator as any).deviceMemory} GB`;
  }

  // 7. Número de Núcleos (CPU)
  const hardwareConcurrency = navigator.hardwareConcurrency || 1;

  // 8. Tipo de Dispositivo
  let deviceType = "Desktop";
  if (/mobi|android|iphone|ipad|ipod/i.test(ua)) {
    deviceType = /ipad|tablet/i.test(ua) ? "Tablet" : "Celular";
  }

  // 9. Tipo de Conexão (quando disponível)
  let connectionType = "Não disponível";
  const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (conn) {
    connectionType = conn.effectiveType || conn.type || "Ativo";
  }

  // 10. Data e Hora Atuais
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  return {
    os,
    browser,
    language,
    timezone,
    resolution,
    orientation,
    deviceMemory,
    hardwareConcurrency,
    userAgent: ua,
    deviceType,
    connectionType,
    date,
    time,
  };
}
