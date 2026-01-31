import { type Job, Worker } from "bullmq";

import { createBullMQConnection } from "../connection";
import {
  ExampleJobDataSchema,
  type ExampleJobDataType,
} from "../queues/example.queue";

const processExampleJob = async (job: Job<ExampleJobDataType>) => {
  // Validate job data at runtime
  const data = ExampleJobDataSchema.parse(job.data);

  await job.updateProgress(10);

  // Process the job (replace with actual logic)
  // Access validated data: data.message
  await job.updateProgress(100);

  return { message: data.message, processed: true, timestamp: Date.now() };
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

// Event handlers intentionally removed to avoid console.log in production
// If logging is needed, use a proper logging library and inject it here
