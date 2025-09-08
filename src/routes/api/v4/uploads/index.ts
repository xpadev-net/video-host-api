import {
  PutObjectCommand,
  type PutObjectCommandInput,
  type S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { HonoApp } from "@/@types/hono";
import {
  MINIO_TMP_BUCKET,
  PRESIGN_EXPIRE_SECONDS,
  UPLOAD_MAX_SIZE_MB,
} from "@/env";
import { getS3Client } from "@/lib/storage";
import { badRequest } from "@/utils/response/badRequest";
import { ok } from "@/utils/response/ok";

const ContentTypeWhitelist = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
  "application/octet-stream",
] as const;

const PresignBodySchema = z.object({
  filename: z.string().min(1),
  contentType: z.enum(ContentTypeWhitelist as unknown as [string, ...string[]]),
  contentLength: z.number().int().positive(),
});

export const registerUploadsRoute = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  registerPresignRoute(api);
  app.route("/uploads", api);
};

const registerPresignRoute = (app: HonoApp) => {
  app.post("/presign", zValidator("json", PresignBodySchema), async (c) => {
    const { filename, contentType, contentLength } = c.req.valid("json");

    const maxBytes = UPLOAD_MAX_SIZE_MB * 1024 * 1024;
    if (contentLength > maxBytes) {
      return badRequest(
        c,
        `File too large. Max ${UPLOAD_MAX_SIZE_MB} MB allowed`,
      );
    }

    const objectKey = buildTmpObjectKey(filename);

    const s3: S3Client = getS3Client();

    const putParams: PutObjectCommandInput = {
      Bucket: MINIO_TMP_BUCKET,
      Key: objectKey,
      ContentType: contentType,
      ContentLength: contentLength,
    };
    const command = new PutObjectCommand(putParams);
    const url = await getSignedUrl(s3, command, {
      expiresIn: PRESIGN_EXPIRE_SECONDS,
    });

    return ok(c, {
      url,
      bucket: MINIO_TMP_BUCKET,
      key: objectKey,
      expiresIn: PRESIGN_EXPIRE_SECONDS,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(contentLength),
      },
    });
  });
};

const buildTmpObjectKey = (filename: string): string => {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  return `videos/tmp/${timestamp}-${safeName}`;
};
