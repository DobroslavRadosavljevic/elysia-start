import { exampleWorker } from "./example.worker";

// All workers array
export const allWorkers = [exampleWorker];

// Graceful shutdown for all workers
export const closeAllWorkers = async () => {
  console.log("Closing queue workers...");
  await Promise.all(allWorkers.map((worker) => worker.close()));
  console.log("Queue workers closed");
};

// Export individual workers
export { exampleWorker };
