import {HonoApp} from "@/@types/hono";
import {Hono} from "hono";

export const registerSeriesRoutes = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  app.route("/series", api);
}