import {cors} from "hono/cors";
import {CORS_ORIGIN} from "@/env";
import {HonoApp} from "@/@types/hono";

export const handleCors = (app: HonoApp) => {
  app.use("/*", cors({
    origin: CORS_ORIGIN,
    credentials: true,
    allowMethods: ["GET","POST","OPTIONS","DELETE","PUT"],
    allowHeaders: ["Authorization","Content-Type"],
  }))
}
