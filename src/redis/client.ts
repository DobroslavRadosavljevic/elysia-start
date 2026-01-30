import Redis from "ioredis";

import { env } from "../config";

const redisUrl =
  env.REDIS_URL ??
  (env.REDIS_PASSWORD
    ? `redis://:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`
    : `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`);

export const redis = new Redis(redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

export const closeRedis = async () => {
  await redis.quit();
};
