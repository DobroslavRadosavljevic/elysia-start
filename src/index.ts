import { app } from "./app";
import { env } from "./config";
import { closeDb } from "./db";
import { closeAllWorkers, closeBullMQConnection } from "./queues";
import { closeRedis } from "./redis";

try {
  app.listen(env.PORT);

  console.log(
    `Server running at http://${app.server?.hostname}:${app.server?.port}`
  );
  console.log(
    `OpenAPI docs available at http://${app.server?.hostname}:${app.server?.port}/openapi`
  );
  console.log(
    `Bull Board UI available at http://${app.server?.hostname}:${app.server?.port}/admin/queues`
  );
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}

const shutdown = async () => {
  console.log("Shutting down gracefully...");

  const results = await Promise.allSettled([
    closeAllWorkers(),
    closeBullMQConnection(),
    closeDb(),
    closeRedis(),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Cleanup error:", result.reason);
    }
  }

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
