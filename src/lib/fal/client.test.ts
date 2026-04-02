import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitGeneration } from './client';
import { fal } from '@fal-ai/client';

// Mock the dependencies
vi.mock('@fal-ai/client', () => ({
  fal: {
    config: vi.fn(),
    queue: {
      submit: vi.fn(),
    },
  },
}));

vi.mock('@/env', () => ({
  env: {
    FAL_KEY: 'test-api-key',
  },
}));

describe('fal/client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitGeneration', () => {
    it('should submit successfully and return the request_id', async () => {
      // Mock successful response
      vi.mocked(fal.queue.submit).mockResolvedValueOnce({
        request_id: 'test-req-123',
      } as unknown);

      const params = {
        imageUrl: 'https://example.com/image.jpg',
        prompt: 'A test prompt',
        negativePrompt: 'A negative prompt',
      };

      const result = await submitGeneration(params);

      // Verify the call
      expect(fal.queue.submit).toHaveBeenCalledWith('fal-ai/nano-banana', {
        input: {
          image_url: params.imageUrl,
          prompt: params.prompt,
          negative_prompt: params.negativePrompt,
        },
      });

      // Verify the result
      expect(result).toBe('test-req-123');
    });

    it('should throw an error if no request_id is returned', async () => {
      // Mock response without request_id
      vi.mocked(fal.queue.submit).mockResolvedValueOnce({
        other_data: 'something',
      } as unknown);

      const params = {
        imageUrl: 'https://example.com/image.jpg',
        prompt: 'A test prompt',
      };

      await expect(submitGeneration(params)).rejects.toThrow(
        'Fal.ai submission failed: no request_id returned.'
      );
    });

    it('should rethrow standard Errors', async () => {
      const standardError = new Error('Network error');
      vi.mocked(fal.queue.submit).mockRejectedValueOnce(standardError);

      const params = {
        imageUrl: 'https://example.com/image.jpg',
        prompt: 'A test prompt',
      };

      await expect(submitGeneration(params)).rejects.toThrow('Network error');
    });

    it('should wrap non-Error exceptions in a standard Error', async () => {
      vi.mocked(fal.queue.submit).mockRejectedValueOnce('Some string error');

      const params = {
        imageUrl: 'https://example.com/image.jpg',
        prompt: 'A test prompt',
      };

      await expect(submitGeneration(params)).rejects.toThrow('Fal.ai submission failed');
    });
  });
});
