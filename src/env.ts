import "dotenv/config";
import * as process from "node:process";

export const PUBLIC_ENDPOINTS = process.env.PUBLIC_ENDPOINTS?.split(",") ?? [];
export const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(",") ?? [];
export const PASSWORD_SALT = process.env.PASSWORD_SALT || "passwordsalt";
export const PASSWORD_HASH_ROUNDS = parseInt(
  process.env.PASSWORD_HASH_ROUNDS || "10",
  10,
);
export const TOKEN_EXPIRY =
  parseInt(process.env.TOKEN_EXPIRY || "604800", 10) * 1000; //convert seconds to milliseconds
export const SIGNUP_ENABLED = process.env.SIGNUP_ENABLED === "true";
export const SIGNUP_CODE = process.env.SIGNUP_CODE;
export const PORT = parseInt(process.env.PORT || "3000", 10);
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const MINIO_ENDPOINT =
  process.env.MINIO_ENDPOINT || "http://localhost:9000";
export const MINIO_REGION = process.env.MINIO_REGION || "us-east-1";
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "";
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "";
export const MINIO_FORCE_PATH_STYLE =
  process.env.MINIO_FORCE_PATH_STYLE !== "false";
export const MINIO_TMP_BUCKET = process.env.MINIO_TMP_BUCKET || "tmp";
export const UPLOAD_MAX_SIZE_MB = parseInt(
  process.env.UPLOAD_MAX_SIZE_MB || "1024",
  10,
);
export const PRESIGN_EXPIRE_SECONDS = parseInt(
  process.env.PRESIGN_EXPIRE_SECONDS || "900",
  10,
);
