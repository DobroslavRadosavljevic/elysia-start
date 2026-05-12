import { S3Client } from "bun";

import { env } from "../config";

// S3 configuration - supports AWS S3 and S3-compatible services (Cloudflare R2, MinIO, etc.)
export const s3Config = {
  bucket: env.S3_BUCKET,
  endpoint: env.S3_ENDPOINT,
  publicUrl: env.S3_PUBLIC_URL,
  region: env.S3_REGION,
};

// Create S3 client instance
// Bun's S3Client also auto-reads env vars if not explicitly provided:
// S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET, S3_ENDPOINT, S3_REGION
export const s3 = new S3Client({
  accessKeyId: env.S3_ACCESS_KEY_ID,
  bucket: env.S3_BUCKET,
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
});

// Verify connection by checking if bucket is accessible
export const verifyS3Connection = async () => {
  try {
    const testFile = s3.file(".s3-connection-test");
    await testFile.exists();
    return true;
  } catch {
    return false;
  }
};
