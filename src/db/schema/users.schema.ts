import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: text("email").notNull().unique(),
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const UserInsert = createInsertSchema(users);
export const UserSelect = createSelectSchema(users);

export type UserInsertType = typeof users.$inferInsert;
export type UserSelectType = typeof users.$inferSelect;
