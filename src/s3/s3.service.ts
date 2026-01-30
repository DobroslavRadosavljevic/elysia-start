import type {
  PresignOptionsType,
  PresignUploadOptionsType,
  UploadOptionsType,
} from "./s3.model";

import { s3, s3Config } from "./client";

export class S3Service {
  /**
   * Get a lazy reference to an S3 file (doesn't fetch until accessed)
   */
  file(key: string) {
    return s3.file(key);
  }

  /**
   * Check if a file exists in the bucket
   */
  exists(key: string) {
    const file = s3.file(key);
    return file.exists();
  }

  /**
   * Get file size in bytes (returns undefined if file doesn't exist)
   */
  async size(key: string) {
    const file = s3.file(key);
    if (!(await file.exists())) {
      return;
    }
    return file.size;
  }

  /**
   * Get file metadata
   */
  async getInfo(key: string) {
    const file = s3.file(key);
    if (!(await file.exists())) {
      return null;
    }
    return {
      key,
      size: file.size,
      type: file.type,
    };
  }

  /**
   * Read file as text
   */
  async getText(key: string) {
    const file = s3.file(key);
    if (!(await file.exists())) {
      return null;
    }
    return file.text();
  }

  /**
   * Read file as JSON
   */
  async getJson<T>(key: string) {
    const file = s3.file(key);
    if (!(await file.exists())) {
      return null;
    }
    return file.json() as Promise<T>;
  }

  /**
   * Read file as ArrayBuffer
   */
  async getArrayBuffer(key: string) {
    const file = s3.file(key);
    if (!(await file.exists())) {
      return null;
    }
    return file.arrayBuffer();
  }

  /**
   * Read file as ReadableStream
   */
  async getStream(key: string) {
    const file = s3.file(key);
    if (!(await file.exists())) {
      return null;
    }
    return file.stream();
  }

  /**
   * Read file as Blob
   */
  async getBlob(key: string) {
    const file = s3.file(key);
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
    const file = s3.file(key);
    const written = await file.write(data, {
      type: options?.contentType,
    });
    return { key, size: written };
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
    const file = s3.file(key);
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
    const file = s3.file(key);
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
    const file = s3.file(key);
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
    const file = s3.file(key);
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
    const sourceFile = s3.file(sourceKey);
    if (!(await sourceFile.exists())) {
      return false;
    }
    const data = await sourceFile.arrayBuffer();
    await this.upload(destinationKey, data);
    return true;
  }

  /**
   * Move file within the bucket (copy + delete)
   */
  async move(sourceKey: string, destinationKey: string) {
    const copied = await this.copy(sourceKey, destinationKey);
    if (!copied) {
      return false;
    }
    await this.delete(sourceKey);
    return true;
  }

  /**
   * Get public URL for a file (if bucket is public or CDN configured)
   */
  getPublicUrl(key: string) {
    if (!s3Config.publicUrl) {
      return null;
    }
    return `${s3Config.publicUrl}/${key}`;
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
    const ext = options?.extension ? `.${options.extension}` : "";
    const prefix = options?.prefix ? `${options.prefix}/` : "";
    return `${prefix}${name}${ext}`;
  }
}

export const s3Service = new S3Service();
