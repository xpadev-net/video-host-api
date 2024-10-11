import {registerHealthzRoute} from "./healthz";
import {registerApiRoute} from "./api";
import {HonoApp} from "@/@types/hono";

export const registerRoute = (app: HonoApp) => {
  registerHealthzRoute(app);
  registerApiRoute(app);
}