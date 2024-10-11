import "dotenv/config";
import * as process from "process";

export const PUBLIC_ENDPOINTS = process.env.PUBLIC_ENDPOINTS?.split(",") ?? [];
export const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(",") ?? [];
