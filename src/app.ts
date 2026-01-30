import { cors } from "@elysiajs/cors";
import { cron } from "@elysiajs/cron";
import { openapi } from "@elysiajs/openapi";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";
import { Elysia } from "elysia";
import { z } from "zod";

import { authOpenAPI } from "./auth";
import { healthController } from "./features/health/health.controller";
import { todoController } from "./features/todos/todo.controller";
import { uploadController } from "./features/uploads/upload.controller";
import { exampleQueue } from "./queues";
import {
  authPlugin,
  bullBoardPlugin,
  dbPlugin,
  redisPlugin,
  s3Plugin,
} from "./shared/plugins";

export const app = new Elysia({
  serve: {
    idleTimeout: 30,
    maxRequestBodySize: 1024 * 1024 * 128,
  },
})
  .use(cors())
  .use(dbPlugin)
  .use(redisPlugin)
  .use(s3Plugin)
  .use(authPlugin)
  .use(bullBoardPlugin)
  .use(
    cron({
      name: "heartbeat",
      pattern: "*/30 * * * * *",
      run() {
        console.log("Heartbeat");
      },
    })
  )
  .use(
    openapi({
      documentation: {
        components: (await authOpenAPI.getComponents()) as never,
        info: {
          title: "Elysia API",
          version: "1.0.0",
        },
        paths: (await authOpenAPI.getPaths()) as never,
      },
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
    })
  )
  .use(opentelemetry())
  .use(serverTiming())
  .get("/", () => "Hello Elysia")
  // Test endpoint to add a job to the example queue
  .get("/add-job", async ({ query }) => {
    const job = await exampleQueue.add("process", {
      message: query.message ?? "Hello from queue!",
    });
    return { jobId: job.id, status: "queued" };
  })
  .use(healthController)
  .use(todoController)
  .use(uploadController);
