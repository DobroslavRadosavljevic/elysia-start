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
  runtimeEnv: process.env,

  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    BULL_BOARD_PASSWORD: z.string().min(8),
    BULL_BOARD_USERNAME: z.string().min(1),
    CORS_ORIGINS: z.string().optional(),
    DATABASE_URL: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number(),
    REDIS_URL: z.url(),
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z.email(),
    // S3 Storage
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_BUCKET: z.string(),
    S3_ENDPOINT: z.url(),
    S3_PUBLIC_URL: z.url(),
    S3_REGION: z.string(),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
  },
});
