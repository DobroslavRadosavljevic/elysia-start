import { z } from "zod";

export const EmailRecipientSchema = z.union([
  z.email(),
  z.array(z.email()).min(1),
]);

export const EmailAttachmentSchema = z.object({
  content: z.instanceof(Buffer).optional(),
  contentType: z.string().optional(),
  filename: z.string(),
  path: z.string().optional(),
});

export const EmailTagSchema = z.object({
  name: z.string().max(256),
  value: z.string().max(256),
});

export const SendEmailOptionsSchema = z.object({
  attachments: z.array(EmailAttachmentSchema).optional(),
  bcc: EmailRecipientSchema.optional(),
  cc: EmailRecipientSchema.optional(),
  from: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional(),
  html: z.string().optional(),
  replyTo: z.email().optional(),
  subject: z.string().min(1).max(998),
  tags: z.array(EmailTagSchema).optional(),
  text: z.string().optional(),
  to: EmailRecipientSchema,
});

export const EmailResponseSchema = z.object({
  id: z.string(),
});

export const BatchEmailOptionsSchema = z
  .array(SendEmailOptionsSchema)
  .min(1)
  .max(100);

export const BatchEmailResponseSchema = z.object({
  data: z.array(EmailResponseSchema),
});

export type EmailRecipientType = z.infer<typeof EmailRecipientSchema>;
export type EmailAttachmentType = z.infer<typeof EmailAttachmentSchema>;
export type EmailTagType = z.infer<typeof EmailTagSchema>;
export type SendEmailOptionsType = z.infer<typeof SendEmailOptionsSchema>;
export type EmailResponseType = z.infer<typeof EmailResponseSchema>;
export type BatchEmailOptionsType = z.infer<typeof BatchEmailOptionsSchema>;
export type BatchEmailResponseType = z.infer<typeof BatchEmailResponseSchema>;
