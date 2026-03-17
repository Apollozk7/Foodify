/**
 * Cliente LLM para o Prompt Enhancer.
 * Usa OpenAI por padrão. Anthropic e Google podem ser adicionados
 * instalando suas respectivas SDKs.
 */

import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a professional food photography prompt engineer.
Your job is to enhance user prompts for AI image generation.
Take the user's simple food description and expand it into a rich, detailed prompt
that focuses on: lighting, composition, texture, colors, plating style, background,
and photography technique.
Keep the output concise (max 200 chars), in English, and ready to send to an image model.
Return ONLY the enhanced prompt text, nothing else.`;

/**
 * Melhora um prompt simples em um prompt profissional de food photography.
 */
export async function enhancePrompt(userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  // Se não tem API key, retorna o prompt limpo (modo demo)
  if (!apiKey) {
    return `Professional food photography of ${userPrompt}, soft natural lighting, shallow depth of field, rustic background, 45 degree angle, high resolution`;
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    return response.choices[0]?.message?.content?.trim() ?? userPrompt;
  } catch {
    // Fallback se a API falhar
    return `Professional food photography of ${userPrompt}, soft natural lighting, shallow depth of field, rustic background, 45 degree angle, high resolution`;
  }
}
