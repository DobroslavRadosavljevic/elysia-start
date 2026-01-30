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
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().default(3000),

    // Example patterns for common use cases:
    // DATABASE_URL: z.string().url(),
    // API_KEY: z.string().min(1),
    // DEBUG: z.string().transform((s) => s === "true").default("false"),
    // ALLOWED_ORIGINS: z.string().transform((s) => s.split(",")).default(""),
  },
});
