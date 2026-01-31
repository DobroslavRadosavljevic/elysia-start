import Redis from "ioredis";

import { env } from "../config";

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

// Event handlers intentionally removed to avoid console.log in production
// If logging is needed, use a proper logging library and inject it here

export const closeRedis = async () => {
  await redis.quit();
};
