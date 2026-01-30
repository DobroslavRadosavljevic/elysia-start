import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "../config";
import * as schema from "./schema";

const connectionString =
  env.DATABASE_URL ??
  `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;

export const db = drizzle({
  connection: {
    url: connectionString,
  },
  schema,
});

export const closeDb = async () => {
  await db.$client.end();
};
