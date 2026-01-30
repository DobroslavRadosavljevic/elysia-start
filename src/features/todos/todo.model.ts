import { z } from "zod";

export const TodoCreateSchema = z.object({
  completed: z.boolean().optional().default(false),
  description: z.string().max(1000).optional(),
  title: z.string().min(1).max(255),
});

export const TodoUpdateSchema = z.object({
  completed: z.boolean().optional(),
  description: z.string().max(1000).nullable().optional(),
  title: z.string().min(1).max(255).optional(),
});

export const TodoResponseSchema = z.object({
  completed: z.boolean(),
  createdAt: z.iso.datetime(),
  description: z.string().nullable(),
  id: z.uuid(),
  title: z.string(),
  updatedAt: z.iso.datetime(),
});

export const TodoListResponseSchema = z.array(TodoResponseSchema);

export type TodoCreateType = z.infer<typeof TodoCreateSchema>;
export type TodoUpdateType = z.infer<typeof TodoUpdateSchema>;
export type TodoResponseType = z.infer<typeof TodoResponseSchema>;
