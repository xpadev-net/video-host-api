import {Hono} from "hono";

export const registerV4Route = (app: Hono) => {
  const v4 = new Hono();
  app.route("/v4", v4);
}