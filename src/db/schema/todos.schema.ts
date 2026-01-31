import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamp } from "../utils";
import { users } from "./auth.schema";

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
    .$defaultFn(() => new Date().toISOString())
    .$onUpdate(() => new Date().toISOString()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const TodoInsertSchema = createInsertSchema(todos);
export const TodoSelectSchema = createSelectSchema(todos);

export type TodoInsertType = typeof todos.$inferInsert;
export type TodoSelectType = typeof todos.$inferSelect;
