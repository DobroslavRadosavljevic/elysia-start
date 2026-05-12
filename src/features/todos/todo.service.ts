import { and, count, eq } from "drizzle-orm";

import type { PaginationType } from "../../shared/models";
import type { TodoCreateType, TodoUpdateType } from "./todo.model";

import { db, todos } from "../../db";

export const TodoService = {
  async create(data: TodoCreateType, userId: string) {
    const [todo] = await db
      .insert(todos)
      .values({ ...data, userId })
      .returning();
    return todo;
  },

  async delete(id: string, userId: string) {
    const [todo] = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();
    return todo ?? null;
  },

  async getAll(userId: string, pagination: PaginationType) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [data, [{ total }]] = await Promise.all([
      db
        .select()
        .from(todos)
        .where(eq(todos.userId, userId))
        .orderBy(todos.createdAt)
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(todos).where(eq(todos.userId, userId)),
    ]);

    return {
      data,
      meta: {
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string, userId: string) {
    const [todo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));
    return todo ?? null;
  },

  async update(id: string, data: TodoUpdateType, userId: string) {
    const [todo] = await db
      .update(todos)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();
    return todo ?? null;
  },
};
