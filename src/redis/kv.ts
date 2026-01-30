import { redis } from "./client";

export const kv = {
  decr(key: string): Promise<number> {
    return redis.decr(key);
  },

  async del(key: string): Promise<boolean> {
    const result = await redis.del(key);
    return result > 0;
  },

  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result > 0;
  },

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await redis.expire(key, ttlSeconds);
    return result === 1;
  },

  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value) as T;
  },

  incr(key: string): Promise<number> {
    return redis.incr(key);
  },

  keys(pattern: string): Promise<string[]> {
    return redis.keys(pattern);
  },

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.set(key, serialized, "EX", ttlSeconds);
    } else {
      await redis.set(key, serialized);
    }
  },

  ttl(key: string): Promise<number> {
    return redis.ttl(key);
  },
};
