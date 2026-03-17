import { fal } from "@fal-ai/client";

let _configured = false;
function ensureFalConfig() {
  if (!_configured) {
    fal.config({ credentials: process.env.FAL_KEY });
    _configured = true;
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FalGenerateParams {
  prompt: string;
  /** Fal.ai model endpoint, e.g. "fal-ai/flux/schnell" */
  model?: string;
  imageSize?: "square" | "landscape_4_3" | "landscape_16_9" | "portrait_4_3" | "portrait_16_9";
  numImages?: number;
  /** Source image URL for image-to-image */
  imageUrl?: string;
}

export interface FalGenerateResult {
  images: Array<{ url: string; width: number; height: number; content_type: string }>;
  timings?: Record<string, number>;
  seed?: number;
}

export class FalError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "FalError";
  }
}

// ─── Models ──────────────────────────────────────────────────────────────────

/** Default model for food photography — fast + high quality */
export const FAL_DEFAULT_MODEL = "fal-ai/flux/schnell";

/** Higher quality, slower */
export const FAL_PRO_MODEL = "fal-ai/flux/dev";

// ─── Client ──────────────────────────────────────────────────────────────────

/**
 * Gera uma imagem via Fal.ai usando `fal.subscribe` (polling gerenciado pelo SDK).
 * Retorna quando a imagem estiver pronta.
 */
export async function generateImage(
  params: FalGenerateParams
): Promise<FalGenerateResult> {
  const model = params.model ?? FAL_DEFAULT_MODEL;

  ensureFalConfig();

  try {
    const input: Record<string, unknown> = {
      prompt: params.prompt,
      image_size: params.imageSize ?? "square",
      num_images: params.numImages ?? 1,
      enable_safety_checker: false,
    };

    if (params.imageUrl) {
      input.image_url = params.imageUrl;
    }

    const result = await fal.subscribe(model, {
      input,
      pollInterval: 2000, // poll a cada 2s
      logs: process.env.NODE_ENV === "development",
    });

    return result.data as FalGenerateResult;
  } catch (err) {
    throw new FalError(`Fal.ai generation failed for model ${model}`, err);
  }
}

/**
 * Submete geração à fila e retorna o requestId para polling manual (opcional).
 * Útil para implementar status endpoints próprios.
 */
export async function submitImageJob(
  params: FalGenerateParams
): Promise<{ requestId: string }> {
  const model = params.model ?? FAL_DEFAULT_MODEL;

  ensureFalConfig();

  const input: Record<string, unknown> = {
    prompt: params.prompt,
    image_size: params.imageSize ?? "square",
    num_images: 1,
  };

  if (params.imageUrl) input.image_url = params.imageUrl;

  const { request_id } = await fal.queue.submit(model, { input });
  return { requestId: request_id };
}

/**
 * Verifica o status de um job na fila.
 */
export async function getJobStatus(model: string, requestId: string) {
  ensureFalConfig();
  return fal.queue.status(model, { requestId, logs: false });
}

/**
 * Busca o resultado de um job concluído.
 */
export async function getJobResult(
  model: string,
  requestId: string
): Promise<FalGenerateResult> {
  ensureFalConfig();
  const result = await fal.queue.result(model, { requestId });
  return result.data as FalGenerateResult;
}
