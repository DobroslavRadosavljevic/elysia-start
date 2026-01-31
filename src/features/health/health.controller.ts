import { Elysia } from "elysia";

import { HealthResponseSchema } from "./health.model";
import { HealthService } from "./health.service";

export const healthController = new Elysia({ prefix: "/health" }).get(
  "/",
  () => HealthService.check(),
  {
    detail: {
      description: "Returns the health status of the API",
      summary: "Health check",
      tags: ["Health"],
    },
    response: HealthResponseSchema,
  }
);
