import { Queue } from "bullmq";
import { z } from "zod";

import { bullMQConnection } from "../connection";

// Zod schema for job data (following project patterns)
export const ExampleJobDataSchema = z.object({
  message: z.string(),
});

export type ExampleJobDataType = z.infer<typeof ExampleJobDataSchema>;

export const exampleQueue = new Queue<ExampleJobDataType>("example", {
  connection: bullMQConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      delay: 1000,
      type: "exponential",
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 500, // Keep last 500 failed jobs
  },
});
