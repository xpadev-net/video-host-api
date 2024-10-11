import {Hono} from "hono";

export const registerHealthzRoute = (app: Hono) => {
  app.get("/healthz", async (c) => {
    return c.json({
      status: "ok"
    });
  });
}