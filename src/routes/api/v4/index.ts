import {Hono} from "hono";
import {registerAuthRoute} from "./auth";

export const registerV4Route = (app: Hono) => {
  const v4 = new Hono();
  registerAuthRoute(v4);
  app.route("/v4", v4);
}