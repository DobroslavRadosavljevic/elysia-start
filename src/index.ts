import { cors } from "@elysiajs/cors";
import { cron } from "@elysiajs/cron";
import { openapi } from "@elysiajs/openapi";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(cors())
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
    })
  )
  .use(opentelemetry())
  .use(serverTiming())
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📚 OpenAPI docs available at http://${app.server?.hostname}:${app.server?.port}/openapi`
);
