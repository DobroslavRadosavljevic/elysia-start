import type { ZodSchema } from "zod";

import { redis } from "./client";

export class KvService {
  async decr(key: string) {
    return await redis.decr(key);
  }

  async del(key: string) {
    const result = await redis.del(key);
    return result > 0;
  }

  async exists(key: string) {
    const result = await redis.exists(key);
    return result > 0;
  }

  async expire(key: string, ttlSeconds: number) {
    const result = await redis.expire(key, ttlSeconds);
    return result === 1;
  }

  async get<T>(key: string, schema?: ZodSchema<T>) {
    const value = await redis.get(key);
    if (!value) {
      return null;
    }
    const parsed = JSON.parse(value) as T;
    if (schema) {
      return schema.parse(parsed);
    }
    return parsed;
  }

  async incr(key: string) {
    return await redis.incr(key);
  }

  /**
   * @deprecated Use scan() instead. keys() uses Redis KEYS command which blocks
   * the server and is dangerous in production with large datasets.
   */
  async keys(pattern: string) {
    return await redis.keys(pattern);
  }

  /**
   * Cursor-based key scanning using Redis SCAN command.
   * Safe for production use as it doesn't block the server.
   * @param pattern - The pattern to match keys against (e.g., "user:*")
   * @param count - Hint for how many keys to return per iteration (default: 100)
   */
  async scan(pattern: string, count = 100) {
    const keys: string[] = [];
    let cursor = "0";

    do {
      const [nextCursor, batch] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        count
      );
      cursor = nextCursor;
      keys.push(...batch);
    } while (cursor !== "0");

    return keys;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number) {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.set(key, serialized, "EX", ttlSeconds);
    } else {
      await redis.set(key, serialized);
    }
  }

  async ttl(key: string) {
    return await redis.ttl(key);
  }
}

export const kvService = new KvService();
