import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,

  isServer: true,
  onValidationError: (issues) => {
    console.error("❌ Invalid environment variables:");
    for (const issue of issues) {
      const path = issue.path?.join(".") ?? "unknown";
      console.error(`  - ${path}: ${issue.message}`);
    }
    process.exit(1);
  },
  runtimeEnv: Bun.env,

  server: {
    DATABASE_URL: z.string().url().optional(),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().default(3000),
    POSTGRES_DB: z.string().default("elysia_dev"),
    POSTGRES_HOST: z.string().default("localhost"),
    POSTGRES_PASSWORD: z.string().default("elysia_local_pass"),
    POSTGRES_PORT: z.coerce.number().default(5432),
    POSTGRES_USER: z.string().default("elysia"),
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_URL: z.string().url().optional(),
  },
});
