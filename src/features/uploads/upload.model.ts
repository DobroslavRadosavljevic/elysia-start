import { z } from "zod";

// Request to get a presigned upload URL
export const PresignUploadRequestSchema = z.object({
  acl: z.enum(["private", "public-read"]).optional().default("private"),
  contentType: z.string().optional(),
  expiresIn: z.number().min(60).max(3600).optional().default(3600),
  filename: z.string().min(1).max(255),
  prefix: z.string().max(100).optional(), // e.g., "avatars", "documents"
});

// Request to get a presigned download URL
export const PresignDownloadRequestSchema = z.object({
  contentDisposition: z.string().optional(),
  expiresIn: z.number().min(60).max(86_400).optional().default(3600),
  key: z.string().min(1),
});

// File key parameter
export const FileKeyParamSchema = z.object({
  key: z.string().min(1),
});

// Response for presigned upload URL
export const PresignUploadResponseSchema = z.object({
  expiresIn: z.number(),
  key: z.string(),
  publicUrl: z.url().nullable(),
  uploadUrl: z.url(),
});

// Response for presigned download URL
export const PresignDownloadResponseSchema = z.object({
  downloadUrl: z.url(),
  expiresIn: z.number(),
  key: z.string(),
});

// Response for file info
export const FileInfoResponseSchema = z.object({
  key: z.string(),
  publicUrl: z.url().nullable(),
  size: z.number(),
  type: z.string(),
});

// Response for delete operation
export const DeleteResponseSchema = z.object({
  deleted: z.boolean(),
  key: z.string(),
});

// Bulk delete request
export const BulkDeleteRequestSchema = z.object({
  keys: z.array(z.string().min(1)).min(1).max(100),
});

// Direct upload via multipart form
export const DirectUploadQuerySchema = z.object({
  prefix: z.string().max(100).optional(),
});

// Type exports
export type BulkDeleteRequestType = z.infer<typeof BulkDeleteRequestSchema>;
export type DeleteResponseType = z.infer<typeof DeleteResponseSchema>;
export type FileInfoResponseType = z.infer<typeof FileInfoResponseSchema>;
export type FileKeyParamType = z.infer<typeof FileKeyParamSchema>;
export type PresignDownloadRequestType = z.infer<
  typeof PresignDownloadRequestSchema
>;
export type PresignDownloadResponseType = z.infer<
  typeof PresignDownloadResponseSchema
>;
export type PresignUploadRequestType = z.infer<
  typeof PresignUploadRequestSchema
>;
export type PresignUploadResponseType = z.infer<
  typeof PresignUploadResponseSchema
>;
