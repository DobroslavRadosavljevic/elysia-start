import { exampleQueue } from "./example.queue";

export {
  exampleQueue,
  ExampleJobDataSchema,
  type ExampleJobDataType,
} from "./example.queue";

// All queues array for Bull Board registration
export const allQueues = [exampleQueue];
