import { z } from "zod";

export const Pagination = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});

export const PaginatedResponse = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: z.object({
      limit: z.number(),
      page: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });

export const ErrorResponse = z.object({
  code: z.string().optional(),
  message: z.string(),
});

export const IdParam = z.object({
  id: z.string(),
});

export type PaginationType = z.infer<typeof Pagination>;
export type ErrorResponseType = z.infer<typeof ErrorResponse>;
export type IdParamType = z.infer<typeof IdParam>;
