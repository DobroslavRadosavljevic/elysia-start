import { cors } from "@elysiajs/cors";
import { cron } from "@elysiajs/cron";
import { openapi } from "@elysiajs/openapi";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";
import { Elysia } from "elysia";
import { z } from "zod";

import { healthController } from "./features/health/health.controller";
import { dbPlugin, redisPlugin } from "./shared/plugins";

export const app = new Elysia({
  serve: {
    idleTimeout: 30,
    maxRequestBodySize: 1024 * 1024 * 128,
  },
})
  .use(cors())
  .use(dbPlugin)
  .use(redisPlugin)
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
        info: {
          title: "Elysia API",
          version: "1.0.0",
        },
      },
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
    })
  )
  .use(opentelemetry())
  .use(serverTiming())
  .get("/", () => "Hello Elysia")
  .use(healthController);
