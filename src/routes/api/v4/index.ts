import {Hono} from "hono";
import {registerAuthRoute} from "./auth";
import {registerUsersRoute} from "@/routes/api/v4/users";
import {HonoApp} from "@/@types/hono";

export const registerV4Route = (app: HonoApp) => {
  const v4 = new Hono() as HonoApp;
  registerAuthRoute(v4);
  registerUsersRoute(v4);
  app.route("/v4", v4);
}