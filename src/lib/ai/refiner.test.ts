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

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await refinePrompt({
      userInput: 'hambúrguer rústico',
      category: 'Alimentos',
      style: 'Fotografia de Produto',
      templates: ['delivery']
    });

    expect(result).toEqual({
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
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Internal Server Error' }),
    });

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

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(refinePrompt({
      userInput: 'hambúrguer rústico',
      category: 'Alimentos',
      style: 'Fotografia de Produto',
      templates: ['delivery']
    })).rejects.toThrow('Failed to parse refined prompt');
  });
});
