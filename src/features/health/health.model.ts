import { z } from "zod";

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string(),
});

export type HealthResponseType = z.infer<typeof HealthResponseSchema>;
