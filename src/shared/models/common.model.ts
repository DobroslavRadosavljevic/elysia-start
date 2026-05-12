import { z } from "zod";

export const PaginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});

export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: z.object({
      limit: z.number(),
      page: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });

export const ErrorResponseSchema = z.object({
  code: z.string().optional(),
  message: z.string(),
});

export const IdParamSchema = z.object({
  id: z.uuid(),
});

export type PaginationType = z.infer<typeof PaginationSchema>;
export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>;
export type IdParamType = z.infer<typeof IdParamSchema>;
