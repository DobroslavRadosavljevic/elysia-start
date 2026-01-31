import type {
  PresignDownloadRequestType,
  PresignUploadRequestType,
} from "./upload.model";

import { s3Service } from "../../s3";

export const UploadService = {
  /**
   * Generate presigned URL for client-side download
   */
  createPresignedDownload(data: PresignDownloadRequestType) {
    const downloadUrl = s3Service.presignDownload(data.key, {
      contentDisposition: data.contentDisposition,
      expiresIn: data.expiresIn,
    });

    return {
      downloadUrl,
      expiresIn: data.expiresIn ?? 3600,
      key: data.key,
    };
  },

  /**
   * Generate presigned URL for client-side upload
   */
  createPresignedUpload(data: PresignUploadRequestType) {
    const key = s3Service.generateKey({
      filename: data.filename,
      prefix: data.prefix,
    });

    const uploadUrl = s3Service.presignUpload(key, {
      acl: data.acl,
      expiresIn: data.expiresIn,
    });

    const publicUrl = s3Service.getPublicUrl(key);

    return {
      expiresIn: data.expiresIn ?? 3600,
      key,
      publicUrl,
      uploadUrl,
    };
  },

  /**
   * Delete file
   */
  async deleteFile(key: string) {
    const deleted = await s3Service.delete(key);
    return { deleted, key };
  },

  /**
   * Delete multiple files
   */
  deleteFiles(keys: string[]) {
    return s3Service.deleteMany(keys);
  },

  /**
   * Get file info
   */
  async getFileInfo(key: string) {
    const info = await s3Service.getInfo(key);
    if (!info) {
      return null;
    }

    return {
      ...info,
      publicUrl: s3Service.getPublicUrl(key),
    };
  },

  /**
   * Direct upload from multipart form data
   */
  async uploadFile(file: File, prefix?: string) {
    // Validate file type before uploading
    s3Service.validateContentType(file.type);

    const key = s3Service.generateKey({
      extension: file.name.split(".").pop(),
      filename: file.name,
      prefix,
    });

    const result = await s3Service.upload(key, file, {
      contentType: file.type,
    });

    return {
      key: result.key,
      publicUrl: s3Service.getPublicUrl(key),
      size: result.size,
      type: file.type,
    };
  },
};
