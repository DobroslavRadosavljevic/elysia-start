import { cors } from "@elysiajs/cors";
import { cron } from "@elysiajs/cron";
import { openapi } from "@elysiajs/openapi";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";
import { Elysia } from "elysia";
import { z } from "zod";

import { authOpenAPI } from "./auth";
import { env } from "./config";
import { healthController } from "./features/health/health.controller";
import { todoController } from "./features/todos/todo.controller";
import { uploadController } from "./features/uploads/upload.controller";
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
  .use(cors({ origin: env.CORS_ORIGINS?.split(",") ?? true }))
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
        // No-op heartbeat for keep-alive
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
  .use(healthController)
  .use(todoController)
  .use(uploadController);
