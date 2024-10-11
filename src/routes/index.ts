import {Hono} from "hono";
import {registerHealthzRoute} from "./healthz";

export const registerRoute = (app: Hono) => {
  registerHealthzRoute(app);
}