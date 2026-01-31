import { Elysia, t } from "elysia";

import { BulkDeleteResponseSchema } from "../../s3";
import { AppError } from "../../shared/errors";
import { ErrorResponseSchema } from "../../shared/models";
import { authPlugin } from "../../shared/plugins/auth.plugin";
import {
  BulkDeleteRequestSchema,
  DeleteResponseSchema,
  DirectUploadQuerySchema,
  FileInfoResponseSchema,
  FileKeyParamSchema,
  PresignDownloadRequestSchema,
  PresignDownloadResponseSchema,
  PresignUploadRequestSchema,
  PresignUploadResponseSchema,
} from "./upload.model";
import { UploadService } from "./upload.service";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/json",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const uploadController = new Elysia({ prefix: "/uploads" })
  .use(authPlugin)
  // Generate presigned URL for upload
  .post(
    "/presign/upload",
    ({ body }) => UploadService.createPresignedUpload(body),
    {
      auth: true,
      body: PresignUploadRequestSchema,
      detail: {
        description:
          "Generate a presigned URL for direct client-side upload to S3",
        summary: "Get presigned upload URL",
        tags: ["Uploads"],
      },
      response: {
        200: PresignUploadResponseSchema,
        400: ErrorResponseSchema,
      },
    }
  )
  // Generate presigned URL for download
  .post(
    "/presign/download",
    ({ body }) => UploadService.createPresignedDownload(body),
    {
      auth: true,
      body: PresignDownloadRequestSchema,
      detail: {
        description: "Generate a presigned URL for secure file download",
        summary: "Get presigned download URL",
        tags: ["Uploads"],
      },
      response: {
        200: PresignDownloadResponseSchema,
        400: ErrorResponseSchema,
      },
    }
  )
  // Get file info
  .get(
    "/info/:key",
    async ({ params, status }) => {
      const info = await UploadService.getFileInfo(params.key);
      return info ?? status(404, { message: "File not found" });
    },
    {
      auth: true,
      detail: {
        description: "Get metadata about an uploaded file",
        summary: "Get file info",
        tags: ["Uploads"],
      },
      params: FileKeyParamSchema,
      response: {
        200: FileInfoResponseSchema,
        404: ErrorResponseSchema,
      },
    }
  )
  // Delete single file
  .delete(
    "/:key",
    async ({ params, status }) => {
      const result = await UploadService.deleteFile(params.key);
      if (!result.deleted) {
        return status(404, { message: "File not found" });
      }
      return result;
    },
    {
      auth: true,
      detail: {
        description: "Delete a file from S3",
        summary: "Delete file",
        tags: ["Uploads"],
      },
      params: FileKeyParamSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema,
      },
    }
  )
  // Bulk delete files
  .post("/bulk-delete", ({ body }) => UploadService.deleteFiles(body.keys), {
    auth: true,
    body: BulkDeleteRequestSchema,
    detail: {
      description: "Delete multiple files from S3",
      summary: "Bulk delete files",
      tags: ["Uploads"],
    },
    response: {
      200: BulkDeleteResponseSchema,
      400: ErrorResponseSchema,
    },
  })
  // Direct upload via multipart form
  .post(
    "/direct",
    async ({ body, query, status }) => {
      const { file } = body;
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return status(400, {
          message: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
        });
      }
      try {
        return await UploadService.uploadFile(file, query.prefix);
      } catch (error) {
        if (error instanceof AppError) {
          return status(400, { message: error.message });
        }
        throw error;
      }
    },
    {
      auth: true,
      body: t.Object({
        file: t.File({
          maxSize: "100m", // 100MB max
        }),
      }),
      detail: {
        description: "Upload a file directly through the server",
        summary: "Direct upload",
        tags: ["Uploads"],
      },
      query: DirectUploadQuerySchema,
      response: {
        200: FileInfoResponseSchema,
        400: ErrorResponseSchema,
      },
    }
  );
