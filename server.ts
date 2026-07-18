import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

const app = express();
const PORT = 3000;

// Helper to check standard IP DNS Blacklists (DNSBLs)
function checkDNSBL(ip: string, blacklist: string): Promise<boolean> {
  return new Promise((resolve) => {
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    if (!ipv4Regex.test(ip)) {
      return resolve(false);
    }
    const parts = ip.split(".");
    const reversedIp = `${parts[3]}.${parts[2]}.${parts[1]}.${parts[0]}`;
    const query = `${reversedIp}.${blacklist}`;
    
    dns.resolve4(query, (err, addresses) => {
      if (err) {
        resolve(false);
      } else {
        // Any 127.0.0.x return IP indicates presence on list
        resolve(addresses && addresses.length > 0);
      }
    });
  });
}

// Increase payload limits for screenshot uploads (base64 images)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("⚠️ GEMINI_API_KEY is not configured or has default placeholder value. AI features will run with fallback simulation.");
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!ai });
});

// 1B. API: IP Reputation and Blacklist Verification
app.post("/api/ip-reputation", async (req, res) => {
  try {
    let clientIp = req.body.ip || req.query.ip;
    
    if (!clientIp) {
      // Extract IP from headers
      const forwarded = req.headers["x-forwarded-for"];
      if (typeof forwarded === "string") {
        clientIp = forwarded.split(",")[0].trim();
      } else if (Array.isArray(forwarded)) {
        clientIp = forwarded[0].trim();
      } else {
        clientIp = req.socket.remoteAddress;
      }
    }
    
    // Normalize client IP (e.g. remove IPv6 prefix like ::ffff:)
    if (clientIp && clientIp.startsWith("::ffff:")) {
      clientIp = clientIp.replace("::ffff:", "");
    }
    
    // Helper to check if IP is in private address ranges (local networks)
    const isPrivateIp = (ip: string) => {
      if (!ip) return true;
      if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") return true;
      if (ip.startsWith("10.")) return true;
      if (ip.startsWith("192.168.")) return true;
      if (ip.startsWith("172.")) {
        const parts = ip.split(".");
        if (parts.length >= 2) {
          const second = parseInt(parts[1], 10);
          return !isNaN(second) && second >= 16 && second <= 31;
        }
      }
      return false;
    };
    
    // Fallback if IP is localhost or private range
    if (!clientIp || isPrivateIp(clientIp)) {
      clientIp = "186.205.125.10"; // Default sample Brazilian IP for demonstration
    }

    // Basic format validation
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/;
    
    if (clientIp !== "186.205.125.10" && !ipv4Regex.test(clientIp) && !ipv6Regex.test(clientIp)) {
      return res.status(400).json({ success: false, error: "Formato de IP inválido. Certifique-se de usar os pontos separadores (ex: 186.205.125.10)." });
    }

    // 1. Check with ip-api.com for VPN, proxy, hosting, ISP, country
    let ipData: any = {};
    try {
      const response = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query,proxy,hosting`);
      if (response.ok) {
        ipData = await response.json();
      }
    } catch (e) {
      console.error("Erro ao chamar ip-api.com:", e);
    }

    if (ipData && ipData.status === "fail") {
      return res.status(400).json({ success: false, error: `Erro na consulta de IP: ${ipData.message || "IP inválido ou restrito"}` });
    }

    // 2. Check DNSBLs (DNS Blacklists) if it's IPv4
    const blacklists = [
      { name: "Spamhaus (Zen)", host: "zen.spamhaus.org", desc: "Banco de dados global de reputação e bloqueio de conexões suspeitas." },
      { name: "SPFBL DNSBL", host: "dnsbl.spfbl.net", desc: "Lista altamente eficaz para identificar IPs comprometidos, modems invadidos ou ataques no Brasil." },
      { name: "Barracuda Central", host: "b.barracudacentral.org", desc: "Lista global de reputação de IPs que enviam tráfego nocivo ou tentativas de intrusão." }
    ];

    const dnsblResults = [];
    let blacklistedCount = 0;

    for (const bl of blacklists) {
      const isListed = await checkDNSBL(clientIp, bl.host);
      if (isListed) {
        blacklistedCount++;
      }
      dnsblResults.push({
        name: bl.name,
        host: bl.host,
        desc: bl.desc,
        isListed
      });
    }

    // 3. Optional AbuseIPDB API Check if API Key exists
    let abuseIpDbData: any = null;
    const abuseApiKey = process.env.ABUSEIPDB_API_KEY;
    if (abuseApiKey && abuseApiKey !== "MY_ABUSEIPDB_API_KEY") {
      try {
        const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${clientIp}&maxAgeInDays=90`, {
          headers: {
            "Key": abuseApiKey,
            "Accept": "application/json"
          }
        });
        if (response.ok) {
          const resJson: any = await response.json();
          abuseIpDbData = resJson.data;
        }
      } catch (e) {
        console.error("Erro ao consultar AbuseIPDB:", e);
      }
    }

    // Calculate risk score (0 to 100)
    let riskScore = 0;
    const flags: string[] = [];

    if (ipData.proxy) {
      riskScore += 45;
      flags.push("Conexão detectada como Proxy ou VPN.");
    }
    if (ipData.hosting) {
      riskScore += 30;
      flags.push("IP pertencente a um Data Center/Hospedagem.");
    }
    
    // Add 25 points per blacklist list
    riskScore += blacklistedCount * 30;
    if (blacklistedCount > 0) {
      flags.push(`IP listado em ${blacklistedCount} blacklist(s) pública(s) de DNS.`);
    }

    if (abuseIpDbData) {
      const score = abuseIpDbData.abuseConfidenceScore || 0;
      // Blend score
      riskScore = Math.round((riskScore + score) / 2);
      if (score > 10) {
        flags.push(`AbuseIPDB reporta nível de abuso de ${score}%.`);
      }
    }

    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);

    // Determine threat level
    let threatLevel: "low" | "medium" | "high" | "critical" = "low";
    if (riskScore >= 75) {
      threatLevel = "critical";
    } else if (riskScore >= 45) {
      threatLevel = "high";
    } else if (riskScore >= 20) {
      threatLevel = "medium";
    }

    res.json({
      success: true,
      ip: clientIp,
      isp: ipData.isp || "Desconhecido",
      country: ipData.country || "Desconhecido",
      countryCode: ipData.countryCode || "BR",
      city: ipData.city || "Desconhecido",
      isProxy: !!ipData.proxy,
      isHosting: !!ipData.hosting,
      dnsbl: {
        results: dnsblResults,
        listedCount: blacklistedCount
      },
      abuseReport: abuseIpDbData ? {
        abuseConfidenceScore: abuseIpDbData.abuseConfidenceScore,
        totalReports: abuseIpDbData.totalReports,
        lastReportedAt: abuseIpDbData.lastReportedAt
      } : null,
      riskScore,
      threatLevel,
      flags,
      checkedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Erro no IP reputation:", error);
    res.status(500).json({ error: error.message || "Erro interno ao processar IP Reputation." });
  }
});

// 2. API: Extract OCR from Screenshot
app.post("/api/ocr", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "Parâmetros 'imageBase64' e 'mimeType' são obrigatórios." });
    }

    if (!ai) {
      // Fallback simulated OCR when AI is not ready
      return res.json({
        success: true,
        title: "Erro de Conexão IMVU",
        errorMessages: ["Falha ao conectar aos servidores do IMVU. Erro de tempo limite (TIMEOUT)."],
        buttons: ["Tentar Novamente", "Suporte", "Cancelar"],
        codes: ["ERR_CONNECTION_TIMED_OUT", "CODE_504"],
        rawText: "IMVU Desktop Client. Unable to connect to server. ERR_CONNECTION_TIMED_OUT. Please check your network cables or firewall settings and try again. [Tentar Novamente] [Suporte] [Cancelar]",
        isFallback: true
      });
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    };

    const promptText = `Analise a seguinte captura de tela do aplicativo IMVU ou do site do IMVU.
Você deve atuar como um extrator OCR profissional de alta precisão.
Sua tarefa é extrair e estruturar as seguintes informações exatamente como escritas em português, inglês ou espanhol na imagem:
1. Título do erro ou da janela (title)
2. Mensagens de erro explícitas (errorMessages)
3. Botões interativos presentes na tela (buttons)
4. Códigos de erro ou identificadores numéricos/texto (codes)
5. Todo o texto legível da imagem de forma sequencial (rawText)

Retorne o resultado estritamente no formato JSON abaixo:
{
  "title": "título encontrado ou vazio",
  "errorMessages": ["mensagem de erro 1", "mensagem de erro 2"],
  "buttons": ["botão 1", "botão 2"],
  "codes": ["código 1", "código 2"],
  "rawText": "todo o texto bruto sequencial encontrado na imagem"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: promptText }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título principal ou cabeçalho visível na imagem" },
            errorMessages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de mensagens de erro ou avisos presentes na imagem"
            },
            buttons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Texto contido nos botões presentes na tela"
            },
            codes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Códigos de erro, códigos numéricos ou hashes de erro identificados"
            },
            rawText: { type: Type.STRING, description: "Todo o texto bruto extraído da imagem de ponta a ponta" }
          },
          required: ["title", "errorMessages", "buttons", "codes", "rawText"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Resposta da IA vazia durante o OCR.");
    }

    const parsed = JSON.parse(resultText);
    res.json({ ...parsed, success: true });
  } catch (error: any) {
    console.error("Erro no OCR:", error);
    res.status(500).json({ error: error.message || "Erro interno ao processar OCR do screenshot." });
  }
});

// 3. API: Generate Smart Diagnostic Analysis with Gemini AI
app.post("/api/diagnose", async (req, res) => {
  try {
    const { deviceInfo, testResults, ocrResult, userAnswers } = req.body;

    if (!ai) {
      // Return simulated smart diagnosis if API key isn't setup
      return res.json({
        success: true,
        summary: "Análise preliminar local (Sem conexão com a IA em nuvem)",
        hypotheses: [
          {
            title: "Instabilidade Temporária Local",
            confidence: "Média",
            reason: "Os testes locais indicaram latência, mas o site público do IMVU respondeu corretamente. Pode haver um congestionamento de rotas com seu provedor de internet local ou o app do IMVU está bloqueado no firewall.",
            recommendations: [
              "Verifique se o aplicativo do IMVU possui permissão nas regras do Firewall do Windows/macOS.",
              "Reinicie seu modem de internet e roteador para limpar tabelas ARP locais.",
              "Experimente mudar o servidor DNS de sua máquina para o Cloudflare (1.1.1.1)."
            ]
          }
        ],
        limitations: [
          "O navegador opera em um sandbox seguro e não consegue realizar testes de ping ICMP puros ou varredura de portas UDP e portas específicas do IMVU (como porta 7000-8000), simulando apenas via HTTPS/Fetch."
        ],
        isFallback: true
      });
    }

    const promptText = `Você é um Engenheiro de Suporte Técnico Avançado do IMVU e Especialista em Redes e Infraestrutura de TI.
Sua missão é realizar um diagnóstico inteligente com base nas seguintes informações reais coletadas do dispositivo do usuário, testes de rede locais, textos extraídos da screenshot e respostas das perguntas de suporte do usuário.

Informações técnicas do dispositivo:
${JSON.stringify(deviceInfo, null, 2)}

Resultados reais de testes de rede HTTPS:
${JSON.stringify(testResults, null, 2)}

Texto extraído do screenshot de erro (se disponível):
${JSON.stringify(ocrResult, null, 2)}

Respostas do usuário ao questionário (se disponível):
${JSON.stringify(userAnswers, null, 2)}

Suas diretrizes fundamentais:
- Nunca invente diagnósticos. Use estritamente as evidências fornecidas.
- Se os testes estiverem normais e o screenshot não apontar erro claro, seja transparente e diga que os parâmetros locais parecem saudáveis e que o problema pode ser temporário na infraestrutura do IMVU ou uma lentidão externa.
- **Caso Especial**: Se o usuário relatar que o IMVU funciona APENAS com VPN/WARP neste celular, mas em outros celulares da mesma casa/Wi-Fi funciona NORMALMENTE sem VPN, explique isso de forma dedicada em uma das hipóteses. Explique os motivos técnicos:
  1. **Bloqueio de IP por Reputação do Dispositivo / Firewall do IMVU (Cloudflare/Akamai)**: O IP público da rede pode ser dinâmico ou compartilhado (CGNAT), mas este dispositivo específico foi marcado/bloqueado temporariamente no firewall do IMVU (por excesso de tentativas de login falhas, cookies salvos corrompidos, ou assinaturas de conexão). O WARP altera o IP e desvia desse bloqueio local de reputação.
  2. **Cache de DNS Local ou "DNS Privado" Ativo**: Este celular específico pode ter um DNS configurado incorretamente nas propriedades de rede ou um "DNS Privado" ativo (como AdGuard ou filtros de bloqueio) que impede a conexão ao domínio do IMVU. O WARP resolve isso ao injetar seu próprio DNS criptografado limpo.
  3. **Problemas com o Android System WebView ou Certificados SSL/TLS**: Algumas versões de celular possuem certificados de segurança expirados ou WebView corrompido, e o túnel VPN ajuda a empacotar os dados burlando falhas locais de handshakes.
  4. **Bloqueio de MAC no Roteador**: O roteador Wi-Fi pode ter regras de controle parental ou firewall de segurança bloqueando especificamente o endereço físico (MAC) deste aparelho.
- Mostre o nível de confiança (Alta, Média, Baixa) para cada hipótese de problema levantado.
- Explique de forma clara e profissional as limitações técnicas deste diagnóstico (por exemplo, limitações do sandbox do navegador em testar portas UDP de jogos ou traçar rotas traceroute completas).
- Use linguagem acessível mas com terminologia técnica precisa, fornecendo recomendações realistas de resolução para cada hipótese.

Retorne sua análise estritamente no formato JSON abaixo:
{
  "summary": "Resumo geral amigável e profissional do estado do sistema do usuário e do possível problema (máximo 4 linhas).",
  "hypotheses": [
    {
      "title": "Nome da hipótese (ex: Problema de Resolução DNS, Bloqueio de Firewall Local, etc.)",
      "confidence": "Alta | Média | Baixa",
      "reason": "Explicação lógica e baseada em evidências de por que esta hipótese foi levantada.",
      "recommendations": [
        "Recomendação prática 1 (ex: Mudar DNS para Cloudflare 1.1.1.1 ou Google 8.8.8.8)",
        "Recomendação prática 2"
      ]
    }
  ],
  "limitations": [
    "Limitação técnica 1 (ex: O navegador não consegue testar conexões UDP 3d do IMVU, apenas requisições HTTPS normais)",
    "Limitação técnica 2"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Resumo geral da situação de diagnóstico" },
            hypotheses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  confidence: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  recommendations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["title", "confidence", "reason", "recommendations"]
              },
              description: "Hipóteses plausíveis levantadas a partir das evidências reais"
            },
            limitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Limitações técnicas do diagnóstico no sandbox do navegador"
            }
          },
          required: ["summary", "hypotheses", "limitations"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Resposta da IA vazia durante o diagnóstico.");
    }

    const parsed = JSON.parse(resultText);
    res.json({ ...parsed, success: true });
  } catch (error: any) {
    console.error("Erro no diagnóstico:", error);
    res.status(500).json({ error: error.message || "Erro interno ao processar o diagnóstico com IA." });
  }
});

// Vite / static file serving logic
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 IMVU Doctor AI Pro rodando na porta ${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Falha ao inicializar o servidor:", err);
});
