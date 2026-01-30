import { z } from "zod";

// File info returned from S3
export const S3FileInfoSchema = z.object({
  key: z.string(),
  size: z.number(),
  type: z.string(),
});

// Options for upload operations
export const UploadOptionsSchema = z.object({
  contentType: z.string().optional(),
});

// Options for presigned URL generation
export const PresignOptionsSchema = z.object({
  contentDisposition: z.string().optional(),
  expiresIn: z.number().min(1).max(604_800).optional(), // Max 7 days in seconds
});

// Presigned upload options (includes ACL)
export const PresignUploadOptionsSchema = PresignOptionsSchema.extend({
  acl: z
    .enum(["private", "public-read", "public-read-write", "authenticated-read"])
    .optional(),
});

// Multipart upload options
export const MultipartOptionsSchema = z.object({
  contentType: z.string().optional(),
  partSize: z
    .number()
    .min(5 * 1024 * 1024)
    .optional(), // Min 5MB
  queueSize: z.number().min(1).max(10).optional(),
  retry: z.number().min(0).max(5).optional(),
});

// Response for upload operations
export const UploadResponseSchema = z.object({
  key: z.string(),
  size: z.number(),
  url: z.string().optional(),
});

// Response for presigned URL
export const PresignedUrlResponseSchema = z.object({
  expiresIn: z.number(),
  key: z.string(),
  method: z.enum(["GET", "PUT"]),
  url: z.string(),
});

// Bulk delete response
export const BulkDeleteResponseSchema = z.object({
  deleted: z.array(z.string()),
  failed: z.array(z.string()),
});

// Type exports
export type BulkDeleteResponseType = z.infer<typeof BulkDeleteResponseSchema>;
export type MultipartOptionsType = z.infer<typeof MultipartOptionsSchema>;
export type PresignedUrlResponseType = z.infer<
  typeof PresignedUrlResponseSchema
>;
export type PresignOptionsType = z.infer<typeof PresignOptionsSchema>;
export type PresignUploadOptionsType = z.infer<
  typeof PresignUploadOptionsSchema
>;
export type S3FileInfoType = z.infer<typeof S3FileInfoSchema>;
export type UploadOptionsType = z.infer<typeof UploadOptionsSchema>;
export type UploadResponseType = z.infer<typeof UploadResponseSchema>;
