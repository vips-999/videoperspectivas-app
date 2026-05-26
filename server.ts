import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Set up bodies
app.use(express.json({ limit: '50mb' }));

// Lazy init of Google Gemini SDK
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY' && key.trim() !== '') {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiInstance;
}

// API Routes FIRST
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', keyConfigured: !!getGeminiClient() });
});

// Analyze screenshot with Gemini to recommend personalized copy, colors, and movement!
app.post('/api/analyze-screenshot', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Isolate base64 image data (remove prefixes if present)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const cleanMimeType = mimeType || 'image/png';

    const ai = getGeminiClient();

    if (!ai) {
      console.warn('GEMINI_API_KEY not configured or empty. Using offline mock analysis.');
      // Return beautiful natural-fitting suggestions for mock experience
      return res.json({
        tagline: "Sua Plataforma do Futuro",
        subtitle: "Lançamento Exclusivo e Design Premium",
        bgStart: "#090d16",
        bgEnd: "#1a103c",
        glow: "#8b5cf6",
        recommendedPreset: "wobble",
        critique: "Análise inteligente indisponível (chave de API não configurada). Mas geramos esses presets fantásticos de tom roxo neon com orbitais flutuantes para você experimentar!",
        brandColors: ["#8b5cf6", "#3b82f6", "#06b6d4"]
      });
    }

    const systemPrompt = `Você é um diretor de arte criativo e especialista em marketing de SaaS. 
Analise a captura de tela do site fornecido e gere recomendações estéticas e textos persuasivos em português para criar um vídeo promocional de 3D de alta qualidade do site. 
Retorne rigorosamente um objeto JSON contendo títulos estéticos e paleta de cor sugerida em formato hexadecimal.`;

    const userPrompt = `Analise este screenshot de landing page e projete as configurações estéticas ideais do video promocional 3D. 
Crie uma chamada (tagline) épica de até 30 caracteres e um subtítulo sofisticado de até 50 caracteres para colocar na animação.
Retorne um JSON válido contendo tagline, subtitle, bgStart, bgEnd, glow, recommendedPreset e critique.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        { text: `${systemPrompt}\n\n${userPrompt}` },
        {
          inlineData: {
            data: base64Data,
            mimeType: cleanMimeType,
          },
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tagline: {
              type: Type.STRING,
              description: 'Frase de efeito curta para o topo do vídeo promocional. Máximo 30 caracteres.',
            },
            subtitle: {
              type: Type.STRING,
              description: 'Subtítulo persuasivo que descreve o diferencial do produto. Máximo 50 caracteres.',
            },
            bgStart: {
              type: Type.STRING,
              description: 'Cor hexadecimal escura sugerida para o início do gradiente de fundo do vídeo (ex: #0c0f1d).',
            },
            bgEnd: {
              type: Type.STRING,
              description: 'Cor hexadecimal escura sugerida para o fim do gradiente de fundo do vídeo (ex: #1a0b36).',
            },
            glow: {
              type: Type.STRING,
              description: 'Cor hexagonal vibrante de neon para o brilho do fundo que contrasta com o design (ex: #ec4899 ou #6366f1).',
            },
            recommendedPreset: {
              type: Type.STRING,
              description: 'Tipo de preset recomendado. Escolha rigidamente um destes: scroll, orbit, zoom, wobble, reveal.',
            },
            critique: {
              type: Type.STRING,
              description: 'Crítica profissional de design do site com 1 ou 2 frases elogiosas e construtivas em português.',
            },
          },
          required: ['tagline', 'subtitle', 'bgStart', 'bgEnd', 'glow', 'recommendedPreset', 'critique'],
        },
      },
    });

    const bodyText = response.text || '';
    const parsedData = JSON.parse(bodyText);

    res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing screenshot with Gemini:', error);
    res.status(500).json({ 
      error: 'Error analyzing image', 
      details: error.message,
      // Default fallback values so the client NEVER crashes
      fallback: {
        tagline: "Experimente a Inovação",
        subtitle: "Seu website renderizado em nova perspectiva 3D",
        bgStart: "#030712",
        bgEnd: "#111827",
        glow: "#3b82f6",
        recommendedPreset: "orbit",
        critique: "Ocorreu um erro ao processar o modelo Gemini, mas você pode usar o modo interativo e criar seu vídeo 3D!"
      }
    });
  }
});

// Configure static file serving based on running environment
async function initServer() {
  const staticPath = process.env.NODE_ENV === 'production'
    ? path.join(process.cwd(), 'dist')
    : process.cwd();

  // Serve static files (HTML, CSS, JS, Images, canvas)
  app.use(express.static(staticPath));

  // Serve the SPA main index.html file for any route that is not API
  app.get('*', (req, res, next) => {
    // Avoid capturing api routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web site 3D Animator server running on http://localhost:${PORT}`);
  });
}

initServer();
