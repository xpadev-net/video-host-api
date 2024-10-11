import {Hono} from "hono";
import {registerV4Route} from "./v4";

export const registerApiRoute = (app: Hono) => {
  const api = new Hono();
  registerV4Route(api);
  app.route("/api", api);
}