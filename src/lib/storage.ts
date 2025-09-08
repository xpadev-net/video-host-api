import { S3Client } from "@aws-sdk/client-s3";
import {
  MINIO_ACCESS_KEY,
  MINIO_ENDPOINT,
  MINIO_FORCE_PATH_STYLE,
  MINIO_REGION,
  MINIO_SECRET_KEY,
} from "@/env";

let s3Client: S3Client | undefined;

export const getS3Client = (): S3Client => {
  if (s3Client) return s3Client;

  // Ensure endpoint has no trailing slash for AWS SDK
  const endpoint = MINIO_ENDPOINT.replace(/\/$/, "");

  s3Client = new S3Client({
    region: MINIO_REGION,
    endpoint,
    forcePathStyle: MINIO_FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: MINIO_ACCESS_KEY,
      secretAccessKey: MINIO_SECRET_KEY,
    },
  });
  return s3Client;
};
