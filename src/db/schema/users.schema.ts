import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamp } from "../utils";

export const users = pgTable("users", {
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  email: text("email").notNull().unique(),
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const UserInsert = createInsertSchema(users);
export const UserSelect = createSelectSchema(users);

export type UserInsertType = typeof users.$inferInsert;
export type UserSelectType = typeof users.$inferSelect;
