import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/env', () => ({
  env: {
    OPENROUTER_API_KEY: 'test-api-key',
  },
}));

import { refinePrompt } from './refiner';

global.fetch = vi.fn();

describe('refinePrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should refine a simple prompt into an optimized I2I prompt via OpenRouter', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              refined: "Professional photography of a rustic hamburger on a wooden plate, dramatic lighting, blurred restaurant background, high resolution.",
              negative: "blurry, low quality, noisy"
            })
          }
        }
      ]
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await refinePrompt({
      userInput: 'hambúrguer rústico',
      category: 'Alimentos',
      style: 'Fotografia de Produto',
      templates: ['delivery']
    });

    expect(result).toEqual({
      aiMessage: "Processando sua foto com inteligência...",
      refined: "Professional photography of a rustic hamburger on a wooden plate, dramatic lighting, blurred restaurant background, high resolution.",
      negative: "blurry, low quality, noisy"
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('openrouter.ai'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key'
        })
      })
    );
  });

  it('should handle OpenRouter API errors gracefully', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Internal Server Error' }),
    } as Response);

    await expect(refinePrompt({
      userInput: 'hambúrguer rústico',
      category: 'Alimentos',
      style: 'Fotografia de Produto',
      templates: ['delivery']
    })).rejects.toThrow('Failed to refine prompt');
  });

  it('should handle invalid JSON responses from OpenRouter', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: "Not a JSON string"
          }
        }
      ]
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    await expect(refinePrompt({
      userInput: 'hambúrguer rústico',
      category: 'Alimentos',
      style: 'Fotografia de Produto',
      templates: ['delivery']
    }) as any).rejects.toThrow('Failed to parse refined prompt');
  });

  it('should handle network or general fetch errors', async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network failure'));

    await expect(refinePrompt({
      userInput: 'hambúrguer rústico',
    } as any)).rejects.toThrow('Network failure');
  });
});
