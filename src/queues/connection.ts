import IORedis from "ioredis";

import { env } from "../config";

/**
 * Create a BullMQ-compatible Redis connection.
 * BullMQ requires maxRetriesPerRequest: null for blocking operations.
 */
export const createBullMQConnection = () => {
  const url =
    env.REDIS_URL ??
    (env.REDIS_PASSWORD
      ? `redis://:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`
      : `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`);

  return new IORedis(url, {
    enableReadyCheck: false,
    maxRetriesPerRequest: null, // Required for BullMQ
  });
};

// Shared connection instance for queues
export const bullMQConnection = createBullMQConnection();

// Close all BullMQ connections
export const closeBullMQConnection = async () => {
  await bullMQConnection.quit();
};
