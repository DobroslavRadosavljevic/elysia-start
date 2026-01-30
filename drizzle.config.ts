import type { Config } from "drizzle-kit";

import { env } from "./src/config";

export default {
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./src/db/migrations",
  schema: "./src/db/schema/*.schema.ts",
  strict: true,
  verbose: true,
} satisfies Config;
