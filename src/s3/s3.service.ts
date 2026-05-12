import type {
  PresignOptionsType,
  PresignUploadOptionsType,
  UploadOptionsType,
} from "./s3.model";

import { AppError } from "../shared/errors";
import { s3, s3Config } from "./client";

// Allowed MIME types for file uploads
const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // Text
  "text/plain",
  "text/csv",
  // Archives
  "application/zip",
  "application/gzip",
  // JSON
  "application/json",
]);

export class S3Service {
  /**
   * Sanitize S3 key to prevent path traversal attacks
   */
  private sanitizeKey(key: string) {
    // Reject path traversal patterns
    if (key.includes("..") || key.startsWith("/") || key.includes("//")) {
      throw new AppError("Invalid file key", 400, "INVALID_FILE_KEY");
    }
    // Remove any null bytes
    return key.replaceAll("\0", "");
  }

  /**
   * Validate content type against allowlist
   */
  validateContentType(contentType: string) {
    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      throw new AppError(
        `File type '${contentType}' is not allowed`,
        400,
        "INVALID_FILE_TYPE"
      );
    }
    return true;
  }
  /**
   * Get a lazy reference to an S3 file (doesn't fetch until accessed)
   */
  file(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    return s3.file(sanitizedKey);
  }

  /**
   * Check if a file exists in the bucket
   */
  exists(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    return file.exists();
  }

  /**
   * Get file size in bytes (returns undefined if file doesn't exist)
   */
  async size(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    if (!(await file.exists())) {
      return;
    }
    return file.size;
  }

  /**
   * Get file metadata
   */
  async getInfo(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    if (!(await file.exists())) {
      return null;
    }
    return {
      key: sanitizedKey,
      size: file.size,
      type: file.type,
    };
  }

  /**
   * Read file as text
   */
  async getText(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    if (!(await file.exists())) {
      return null;
    }
    return file.text();
  }

  /**
   * Read file as JSON
   */
  async getJson<T>(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    if (!(await file.exists())) {
      return null;
    }
    return file.json() as Promise<T>;
  }

  /**
   * Read file as ArrayBuffer
   */
  async getArrayBuffer(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    if (!(await file.exists())) {
      return null;
    }
    return file.arrayBuffer();
  }

  /**
   * Read file as ReadableStream
   */
  async getStream(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    if (!(await file.exists())) {
      return null;
    }
    return file.stream();
  }

  /**
   * Read file as Blob
   */
  async getBlob(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    if (!(await file.exists())) {
      return null;
    }
    return file.slice();
  }

  /**
   * Upload data to S3 (small files)
   * Supports: string, ArrayBuffer, Blob, File
   * For streaming uploads, use createMultipartUpload()
   */
  async upload(
    key: string,
    data: string | ArrayBuffer | Blob | File,
    options?: UploadOptionsType
  ) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    const written = await file.write(data, {
      type: options?.contentType,
    });
    return { key: sanitizedKey, size: written };
  }

  /**
   * Upload large file using multipart streaming
   * Returns a FileSink writer for chunked uploads
   */
  createMultipartUpload(
    key: string,
    options?: {
      contentType?: string;
      partSize?: number; // Size of each part (min 5MB for S3)
      queueSize?: number; // Number of concurrent uploads
      retry?: number; // Retry count on failure
    }
  ) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    return file.writer({
      partSize: options?.partSize,
      queueSize: options?.queueSize,
      retry: options?.retry,
      type: options?.contentType,
    });
  }

  /**
   * Delete a file from S3
   */
  async delete(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    if (!(await file.exists())) {
      return false;
    }
    await file.delete();
    return true;
  }

  /**
   * Delete multiple files from S3
   */
  async deleteMany(keys: string[]) {
    const results = await Promise.allSettled(
      keys.map(async (key) => {
        await this.delete(key);
        return key;
      })
    );

    const deleted: string[] = [];
    const failed: string[] = [];

    for (const [index, result] of results.entries()) {
      if (result.status === "fulfilled") {
        deleted.push(result.value);
      } else {
        failed.push(keys[index]);
      }
    }

    return { deleted, failed };
  }

  /**
   * Generate a presigned URL for download
   */
  presignDownload(key: string, options?: PresignOptionsType) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    return file.presign({
      contentDisposition: options?.contentDisposition,
      expiresIn: options?.expiresIn ?? 3600, // Default 1 hour
      method: "GET",
    });
  }

  /**
   * Generate a presigned URL for upload (PUT)
   */
  presignUpload(key: string, options?: PresignUploadOptionsType) {
    const sanitizedKey = this.sanitizeKey(key);
    const file = s3.file(sanitizedKey);
    return file.presign({
      acl: options?.acl,
      expiresIn: options?.expiresIn ?? 3600, // Default 1 hour
      method: "PUT",
    });
  }

  /**
   * Copy file within the bucket
   */
  async copy(sourceKey: string, destinationKey: string) {
    const sanitizedSourceKey = this.sanitizeKey(sourceKey);
    const sanitizedDestKey = this.sanitizeKey(destinationKey);
    const sourceFile = s3.file(sanitizedSourceKey);
    if (!(await sourceFile.exists())) {
      return false;
    }
    const data = await sourceFile.arrayBuffer();
    await this.upload(sanitizedDestKey, data);
    return true;
  }

  /**
   * Move file within the bucket (copy + delete)
   */
  async move(sourceKey: string, destinationKey: string) {
    const sanitizedSourceKey = this.sanitizeKey(sourceKey);
    const sanitizedDestKey = this.sanitizeKey(destinationKey);
    const copied = await this.copy(sanitizedSourceKey, sanitizedDestKey);
    if (!copied) {
      return false;
    }
    await this.delete(sanitizedSourceKey);
    return true;
  }

  /**
   * Get public URL for a file (if bucket is public or CDN configured)
   */
  getPublicUrl(key: string) {
    const sanitizedKey = this.sanitizeKey(key);
    if (!s3Config.publicUrl) {
      return null;
    }
    return `${s3Config.publicUrl}/${sanitizedKey}`;
  }

  /**
   * Sanitize a path segment (prefix or extension) to prevent path traversal
   */
  private sanitizeSegment(segment: string) {
    // Remove path traversal patterns and dangerous characters
    // First remove null bytes, then remove other dangerous patterns
    const withoutNulls = segment.replaceAll("\0", "");
    return withoutNulls.replaceAll(/\.{2,}|[/\\:]/g, "");
  }

  /**
   * Generate a unique key with optional prefix and extension
   */
  generateKey(options?: {
    extension?: string;
    filename?: string;
    prefix?: string;
  }) {
    const timestamp = Date.now();
    const random = crypto.randomUUID().slice(0, 8);
    const name = options?.filename
      ? options.filename.replaceAll(/[^a-zA-Z0-9.-]/g, "_")
      : `${timestamp}-${random}`;
    const sanitizedExt = options?.extension
      ? this.sanitizeSegment(options.extension)
      : "";
    const sanitizedPrefix = options?.prefix
      ? this.sanitizeSegment(options.prefix)
      : "";
    const ext = sanitizedExt ? `.${sanitizedExt}` : "";
    const prefix = sanitizedPrefix ? `${sanitizedPrefix}/` : "";
    const generatedKey = `${prefix}${name}${ext}`;
    // Final validation of the complete key
    return this.sanitizeKey(generatedKey);
  }
}

export const s3Service = new S3Service();
