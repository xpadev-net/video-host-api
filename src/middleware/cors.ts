import {Hono} from "hono";
import {cors} from "hono/cors";
import {CORS_ORIGIN} from "../env";

export const handleCors = (app: Hono) => {
  app.use("/*", cors({
    origin: CORS_ORIGIN,
    credentials: true,
    allowMethods: ["GET","POST","OPTIONS"],
    allowHeaders: ["Authorization"],
  }))
}
