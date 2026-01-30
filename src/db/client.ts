import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "../config";
import * as schema from "./schema";

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
  schema,
});

export const closeDb = async () => {
  await db.$client.end();
};
