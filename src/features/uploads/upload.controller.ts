import { Elysia, t } from "elysia";

import { BulkDeleteResponseSchema } from "../../s3";
import { ErrorResponse } from "../../shared/models";
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

export const uploadController = new Elysia({ prefix: "/uploads" })
  // Generate presigned URL for upload
  .post(
    "/presign/upload",
    ({ body }) => UploadService.createPresignedUpload(body),
    {
      body: PresignUploadRequestSchema,
      detail: {
        description:
          "Generate a presigned URL for direct client-side upload to S3",
        summary: "Get presigned upload URL",
        tags: ["Uploads"],
      },
      response: {
        200: PresignUploadResponseSchema,
        400: ErrorResponse,
      },
    }
  )
  // Generate presigned URL for download
  .post(
    "/presign/download",
    ({ body }) => UploadService.createPresignedDownload(body),
    {
      body: PresignDownloadRequestSchema,
      detail: {
        description: "Generate a presigned URL for secure file download",
        summary: "Get presigned download URL",
        tags: ["Uploads"],
      },
      response: {
        200: PresignDownloadResponseSchema,
        400: ErrorResponse,
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
      detail: {
        description: "Get metadata about an uploaded file",
        summary: "Get file info",
        tags: ["Uploads"],
      },
      params: FileKeyParamSchema,
      response: {
        200: FileInfoResponseSchema,
        404: ErrorResponse,
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
      detail: {
        description: "Delete a file from S3",
        summary: "Delete file",
        tags: ["Uploads"],
      },
      params: FileKeyParamSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponse,
      },
    }
  )
  // Bulk delete files
  .post("/bulk-delete", ({ body }) => UploadService.deleteFiles(body.keys), {
    body: BulkDeleteRequestSchema,
    detail: {
      description: "Delete multiple files from S3",
      summary: "Bulk delete files",
      tags: ["Uploads"],
    },
    response: {
      200: BulkDeleteResponseSchema,
      400: ErrorResponse,
    },
  })
  // Direct upload via multipart form
  .post(
    "/direct",
    ({ body, query }) => {
      const { file } = body;
      return UploadService.uploadFile(file, query.prefix);
    },
    {
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
        400: ErrorResponse,
      },
    }
  );
