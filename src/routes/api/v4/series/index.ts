import {HonoApp} from "@/@types/hono";
import {Hono} from "hono";
import {registerSeriesRoute} from "@/routes/api/v4/series/[series]";

export const registerSeriesRoutes = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  registerSeriesRoute(api);
  app.route("/series", api);
}