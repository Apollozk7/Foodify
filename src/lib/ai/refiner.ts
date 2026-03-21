import { env } from "@/env";

export interface RefinePromptOptions {
  userInput: string;
}

export interface RefinePromptResponse {
  refined: string;
  negative: string;
  aiMessage: string;
}

const SYSTEM_PROMPT = `Você é o 'Aprimoramento de Imagens', um especialista em fotografia gastronômica e de produtos para delivery. 
Sua tarefa é interagir com o usuário e transformar a descrição dele em um prompt profissional para geração de imagens I2I (Image-to-Image).

Regras:
1. Gere um prompt positivo detalhado ('refined') e um prompt negativo ('negative').
2. O prompt 'refined' deve ser em INGLÊS, rico em detalhes visuais: iluminação dramática, texturas suculentas, estilo comercial iFood/Rappi.
3. Além dos prompts técnicos, gere uma pequena mensagem amigável em PORTUGUÊS ('aiMessage') para o usuário, confirmando o que você entendeu e o que vai gerar (ex: "Entendido! Vou transformar esse hambúrguer em uma obra de arte com iluminação quente e fundo de madeira rústica...").
4. A resposta DEVE ser um JSON válido: { "refined": "...", "negative": "...", "aiMessage": "..." }.`;

export async function refinePrompt({
  userInput
}: RefinePromptOptions): Promise<RefinePromptResponse> {
  const apiKey = env.OPENROUTER_API_KEY;
  const url = "https://openrouter.ai/api/v1/chat/completions";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://estudio-ia-pro.vercel.app',
        'X-Title': 'Estúdio IA Pro',
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: userInput
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
        negative: parsed.negative || '',
        aiMessage: parsed.aiMessage || 'Processando sua foto com inteligência...'
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
