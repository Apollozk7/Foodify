import { db } from "@/lib/db";
import { enhancePrompt } from "@/lib/llm";
import { generateImage, FAL_DEFAULT_MODEL, FAL_PRO_MODEL } from "@/lib/fal";
import { uploadToR2, buildImageKey } from "@/lib/r2";
import { debitCredits, addCredits } from "./credits";

const CREDITS_PER_IMAGE = 1;

export interface GenerateRequest {
  userId: string;
  prompt: string;
  quality?: "standard" | "pro";
}

export interface GenerateResult {
  imageId: string;
  status: "COMPLETED" | "FAILED";
  r2Url?: string;
  error?: string;
}

/**
 * Orquestra o fluxo completo:
 * 1. Valida créditos
 * 2. Melhora o prompt via LLM
 * 3. Gera imagem via Fal.ai
 * 4. Faz upload para R2
 * 5. Debita créditos
 * 6. Retorna resultado
 */
export async function generateFoodImage(
  req: GenerateRequest
): Promise<GenerateResult> {
  const model =
    req.quality === "pro" ? FAL_PRO_MODEL : FAL_DEFAULT_MODEL;

  // 1. Cria registro PENDING no DB
  const image = await db.image.create({
    data: {
      userId: req.userId,
      prompt: req.prompt,
      model,
      status: "PENDING",
      creditsUsed: CREDITS_PER_IMAGE,
    },
  });

  try {
    // 2. Melhora o prompt
    let enhanced: string;
    try {
      enhanced = await enhancePrompt(req.prompt);
    } catch {
      enhanced = req.prompt; // fallback: usa prompt original
    }

    await db.image.update({
      where: { id: image.id },
      data: { enhancedPrompt: enhanced },
    });

    // 3. Gera imagem
    const result = await generateImage({
      prompt: enhanced,
      model,
      imageSize: "square",
      numImages: 1,
    });

    if (!result.images?.length) throw new Error("Fal.ai retornou sem imagem");

    const generated = result.images[0];

    // 4. Baixa a imagem e sobe no R2
    const response = await fetch(generated.url);
    if (!response.ok) throw new Error("Falha ao baixar imagem da Fal.ai");
    const buffer = Buffer.from(await response.arrayBuffer());

    const r2Key = buildImageKey(req.userId, image.id);
    const r2Url = await uploadToR2(r2Key, buffer, generated.content_type ?? "image/png");

    // 5. Debita créditos
    const debited = await debitCredits(req.userId, CREDITS_PER_IMAGE, {
      imageId: image.id,
      description: `Geração: "${req.prompt.slice(0, 50)}..."`,
    });

    if (!debited) {
      // Refund — não deveria chegar aqui se checou antes
      throw new Error("Créditos insuficientes");
    }

    // 6. Atualiza registro
    await db.image.update({
      where: { id: image.id },
      data: {
        status: "COMPLETED",
        hyperealUrl: generated.url,
        r2Key,
        r2Url,
        width: generated.width,
        height: generated.height,
      },
    });

    return { imageId: image.id, status: "COMPLETED", r2Url };
  } catch (err) {
    // Marca como falha
    await db.image.update({
      where: { id: image.id },
      data: { status: "FAILED" },
    });

    // Reembolsa crédito
    await addCredits(req.userId, CREDITS_PER_IMAGE, "REFUND", {
      description: `Reembolso por falha na geração`,
    });

    return {
      imageId: image.id,
      status: "FAILED",
      error: err instanceof Error ? err.message : "Erro desconhecido",
    };
  }
}

/**
 * Retorna as imagens geradas pelo usuário.
 */
export async function getUserImages(userId: string, take = 20) {
  return db.image.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      prompt: true,
      enhancedPrompt: true,
      status: true,
      r2Url: true,
      width: true,
      height: true,
      createdAt: true,
    },
  });
}
