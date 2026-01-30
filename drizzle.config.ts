import type { Config } from "drizzle-kit";

import { env } from "./src/config";

const connectionString =
  env.DATABASE_URL ??
  `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;

export default {
  dbCredentials: {
    url: connectionString,
  },
  dialect: "postgresql",
  out: "./src/db/migrations",
  schema: "./src/db/schema/*.schema.ts",
  strict: true,
  verbose: true,
} satisfies Config;
