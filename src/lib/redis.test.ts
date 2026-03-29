import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redis, getUserCredits, consumeCredit, setCredits, refundCredit } from './redis';

vi.mock('@/env', () => ({
  env: {
    UPSTASH_REDIS_REST_URL: 'https://test.upstash.io',
    UPSTASH_REDIS_REST_TOKEN: 'test-token',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test',
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: 'key',
  },
}));

vi.mock('@upstash/redis', () => {
  const MockRedis = class {
    get = vi.fn();
    eval = vi.fn();
    set = vi.fn();
    incr = vi.fn();
  };
  return {
    Redis: MockRedis,
  };
});

describe('redis credit management', () => {
  const mockUserId = 'user_123';
  const mockKey = `user:${mockUserId}:credits`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserCredits', () => {
    it('should return the user credits if it exists in redis', async () => {
      vi.mocked(redis.get).mockResolvedValueOnce(10);

      const credits = await getUserCredits(mockUserId);

      expect(redis.get).toHaveBeenCalledWith(mockKey);
      expect(credits).toBe(10);
    });

    it('should return 0 if the user credits do not exist in redis', async () => {
      vi.mocked(redis.get).mockResolvedValueOnce(null);

      const credits = await getUserCredits(mockUserId);

      expect(redis.get).toHaveBeenCalledWith(mockKey);
      expect(credits).toBe(0);
    });
  });

  describe('consumeCredit', () => {
    it('should return new credit count if decrement is successful', async () => {
      vi.mocked(redis.eval).mockResolvedValueOnce(9); // Decremented from 10 to 9

      const result = await consumeCredit(mockUserId);

      expect(redis.eval).toHaveBeenCalledWith(
        expect.any(String),
        [mockKey],
        []
      );
      expect(result).toBe(9);
    });

    it('should return null if insufficient credits', async () => {
      vi.mocked(redis.eval).mockResolvedValueOnce(-1); // Insufficient credits

      const result = await consumeCredit(mockUserId);

      expect(redis.eval).toHaveBeenCalledWith(
        expect.any(String),
        [mockKey],
        []
      );
      expect(result).toBeNull();
    });

    it('should return -2 if key does not exist', async () => {
      vi.mocked(redis.eval).mockResolvedValueOnce(-2); // Needs sync

      const result = await consumeCredit(mockUserId);

      expect(redis.eval).toHaveBeenCalledWith(
        expect.any(String),
        [mockKey],
        []
      );
      expect(result).toBe(-2);
    });
  });

  describe('setCredits', () => {
    it('should set the credit count in Redis', async () => {
      await setCredits(mockUserId, 50);

      expect(redis.set).toHaveBeenCalledWith(mockKey, 50);
    });
  });

  describe('refundCredit', () => {
    it('should increment the credit count in Redis', async () => {
      vi.mocked(redis.incr).mockResolvedValueOnce(11);

      const result = await refundCredit(mockUserId);

      expect(redis.incr).toHaveBeenCalledWith(mockKey);
      expect(result).toBe(11);
    });
  });
});
