import { app } from "./app";
import { env } from "./config";
import { closeDb } from "./db";
import { closeAllWorkers } from "./queues";
import { closeRedis } from "./redis";

app.listen(env.PORT);

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `OpenAPI docs available at http://${app.server?.hostname}:${app.server?.port}/openapi`
);

const shutdown = async () => {
  console.log("Shutting down gracefully...");
  await closeAllWorkers();
  await closeDb();
  await closeRedis();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
