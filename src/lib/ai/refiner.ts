import { env } from "@/env";

export interface RefinePromptOptions {
  userInput: string;
  category: string;
  style: string;
  templates?: string[];
}

export interface RefinePromptResponse {
  refined: string;
  negative: string;
}

const SYSTEM_PROMPT = `Você é um especialista em fotografia gastronômica e de produtos para delivery no Brasil. 
Sua tarefa é transformar a descrição simples de um usuário em um prompt otimizado para geração de imagens I2I (Image-to-Image) profissional.

Regras de Ouro:
1. Gere um prompt positivo detalhado ('refined') e um prompt negativo ('negative').
2. O prompt 'refined' deve ser rico em detalhes visuais: iluminação (ex: dramática, natural, softbox), composição (ex: close-up, macro, 45 graus), texturas (ex: suculento, crocante, fresco) e estilo de fotografia comercial de alta qualidade (estilo iFood/Rappi).
3. O prompt 'refined' deve incluir elementos da categoria e estilo fornecidos.
4. O prompt deve ser em Inglês para melhor compatibilidade com motores de IA, mas pode manter nomes próprios em português se necessário.
5. A resposta DEVE ser estritamente um JSON válido no formato: { "refined": "...", "negative": "..." }.`;

export async function refinePrompt({
  userInput,
  category,
  style,
  templates = []
}: RefinePromptOptions): Promise<RefinePromptResponse> {
  const apiKey = env.OPENROUTER_API_KEY;
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const userPrompt = `Categoria: ${category}
Estilo: ${style}
Templates/Contexto: ${templates.join(', ')}

Expandir o seguinte input do usuário: "${userInput}"`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://estudio-ia-pro.vercel.app', // Site URL for OpenRouter ranking
        'X-Title': 'Estúdio IA Pro',
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", // DeepSeek V3/V3.2 on OpenRouter
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      throw new Error(`Failed to refine prompt: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;

    if (!resultText) {
      throw new Error('Invalid response from OpenRouter API');
    }

    try {
      const parsed = JSON.parse(resultText);
      return {
        refined: parsed.refined || '',
        negative: parsed.negative || ''
      };
    } catch (parseError) {
      console.error('Failed to parse OpenRouter response as JSON:', resultText);
      throw new Error('Failed to parse refined prompt');
    }
  } catch (error) {
    console.error('Error in refinePrompt:', error);
    throw error instanceof Error ? error : new Error('Failed to refine prompt');
  }
}
