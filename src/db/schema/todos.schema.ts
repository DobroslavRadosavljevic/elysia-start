import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamp } from "../utils";

export const todos = pgTable("todos", {
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  description: text("description"),
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const TodoInsert = createInsertSchema(todos);
export const TodoSelect = createSelectSchema(todos);

export type TodoInsertType = typeof todos.$inferInsert;
export type TodoSelectType = typeof todos.$inferSelect;
