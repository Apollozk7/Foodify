import { Redis } from "@upstash/redis";
import { env } from "@/env";

/**
 * Upstash Redis client for credit management and state caching.
 */
export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL || "https://placeholder.upstash.io",
  token: env.UPSTASH_REDIS_REST_TOKEN || "placeholder",
});

/**
 * Helper to get a user's current credits.
 * If not in Redis, we might need to sync from Supabase.
 */
export async function getUserCredits(userId: string): Promise<number> {
  const credits = await redis.get<number>(`user:${userId}:credits`);
  return credits ?? 0;
}

/**
 * Atomicly decrement user credits.
 * Returns the new credit count if successful, or null if insufficient credits.
 */
export async function consumeCredit(userId: string): Promise<number | null> {
  const key = `user:${userId}:credits`;
  
  // LUA script to check and decrement atomically
  // Returns -1 if insufficient credits
  // Returns -2 if key does not exist (so we can sync from DB)
  const script = `
    local exists = redis.call('exists', KEYS[1])
    if exists == 0 then
      return -2
    end
    local credits = tonumber(redis.call('get', KEYS[1]) or '0')
    if credits > 0 then
      return redis.call('decr', KEYS[1])
    else
      return -1
    end
  `;
  
  const result = await redis.eval(script, [key], []) as number;
  
  if (result === -1) {
    return null; // Insufficient
  }
  
  if (result === -2) {
    return -2; // Needs sync
  }
  
  return result;
}

/**
 * Sets the credit count in Redis.
 */
export async function setCredits(userId: string, credits: number): Promise<void> {
  const key = `user:${userId}:credits`;
  await redis.set(key, credits);
}

/**
 * Refund a credit to the user.
 */
export async function refundCredit(userId: string): Promise<number> {
  const key = `user:${userId}:credits`;
  return await redis.incr(key);
}
