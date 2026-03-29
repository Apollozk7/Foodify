import { fal } from '@fal-ai/client';
import { env } from '@/env';

/**
 * Configure the Fal.ai client with the API key from environment variables.
 */
fal.config({
  credentials: env.FAL_KEY || 'placeholder',
});

export interface SubmitGenerationParams {
  imageUrl: string;
  prompt: string;
  negativePrompt?: string;
}

/**
 * Submits a generation task to the Fal.ai queue using the 'fal-ai/nano-banana' model.
 *
 * @param params - The input image URL and refined prompts.
 * @returns The request_id of the queued generation task.
 */
export async function submitGeneration({
  imageUrl,
  prompt,
  negativePrompt,
}: SubmitGenerationParams): Promise<string> {
  try {
    const result = await fal.queue.submit('fal-ai/nano-banana', {
      input: {
        image_url: imageUrl,
        prompt,
        negative_prompt: negativePrompt,
      } as any,
    });

    if (!result.request_id) {
      throw new Error('Fal.ai submission failed: no request_id returned.');
    }

    return result.request_id;
  } catch (error) {
    console.error('Error submitting generation to Fal.ai:', error);
    throw error instanceof Error ? error : new Error('Fal.ai submission failed');
  }
}

/**
 * Retrieves the status of a generation task from the Fal.ai queue.
 *
 * @param requestId - The request ID of the generation task.
 * @returns The status of the generation task.
 */
export async function getGenerationStatus(requestId: string) {
  try {
    const status = await fal.queue.status('fal-ai/nano-banana', {
      requestId,
    });

    return status;
  } catch (error) {
    console.error(`Error checking Fal.ai generation status for request ${requestId}:`, error);
    throw error instanceof Error ? error : new Error('Fal.ai status check failed');
  }
}
