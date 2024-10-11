import {Hono} from "hono";
import {registerV4Route} from "./v4";
import {HonoApp} from "@/@types/hono";

export const registerApiRoute = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  registerV4Route(api);
  app.route("/api", api);
}