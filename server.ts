import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

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
