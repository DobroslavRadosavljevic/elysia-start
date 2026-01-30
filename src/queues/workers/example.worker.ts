import { type Job, Worker } from "bullmq";

import type { ExampleJobDataType } from "../queues/example.queue";

import { createBullMQConnection } from "../connection";

const processExampleJob = async (job: Job<ExampleJobDataType>) => {
  const { message } = job.data;

  await job.updateProgress(10);

  // Process the job (replace with actual logic)
  console.log(`Processing job ${job.id}: ${message}`);

  await job.updateProgress(100);

  return { processed: true, timestamp: Date.now() };
};

// Create worker with its own connection (required by BullMQ)
export const exampleWorker = new Worker<ExampleJobDataType>(
  "example",
  processExampleJob,
  {
    concurrency: 5,
    connection: createBullMQConnection(), // Workers need their own connection
  }
);

// Event handlers
exampleWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

exampleWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});

exampleWorker.on("error", (error) => {
  console.error("Example worker error:", error);
});
