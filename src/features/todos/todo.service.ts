import { eq } from "drizzle-orm";

import type { TodoCreateType, TodoUpdateType } from "./todo.model";

import { db, todos } from "../../db";

export const TodoService = {
  async create(data: TodoCreateType) {
    const [todo] = await db.insert(todos).values(data).returning();
    return todo;
  },

  async delete(id: string) {
    const [todo] = await db.delete(todos).where(eq(todos.id, id)).returning();
    return todo ?? null;
  },

  getAll() {
    return db.select().from(todos).orderBy(todos.createdAt);
  },

  async getById(id: string) {
    const [todo] = await db.select().from(todos).where(eq(todos.id, id));
    return todo ?? null;
  },

  async update(id: string, data: TodoUpdateType) {
    const [todo] = await db
      .update(todos)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(todos.id, id))
      .returning();
    return todo ?? null;
  },
};
