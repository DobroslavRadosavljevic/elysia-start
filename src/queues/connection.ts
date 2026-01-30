import IORedis from "ioredis";

import { env } from "../config";

/**
 * Create a BullMQ-compatible Redis connection.
 * BullMQ requires maxRetriesPerRequest: null for blocking operations.
 */
export const createBullMQConnection = () =>
  new IORedis(env.REDIS_URL, {
    enableReadyCheck: false,
    maxRetriesPerRequest: null, // Required for BullMQ
  });

// Shared connection instance for queues
export const bullMQConnection = createBullMQConnection();

// Close all BullMQ connections
export const closeBullMQConnection = async () => {
  await bullMQConnection.quit();
};
