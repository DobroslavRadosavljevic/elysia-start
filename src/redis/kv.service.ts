import { redis } from "./client";

export class KvService {
  decr(key: string) {
    return redis.decr(key);
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

  async get<T>(key: string) {
    const value = await redis.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value) as T;
  }

  incr(key: string) {
    return redis.incr(key);
  }

  keys(pattern: string) {
    return redis.keys(pattern);
  }

  async set<T>(key: string, value: T, ttlSeconds?: number) {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.set(key, serialized, "EX", ttlSeconds);
    } else {
      await redis.set(key, serialized);
    }
  }

  ttl(key: string) {
    return redis.ttl(key);
  }
}

export const kvService = new KvService();
