import {Hono} from "hono";
import {registerHealthzRoute} from "./healthz";
import {registerApiRoute} from "./api";

export const registerRoute = (app: Hono) => {
  registerHealthzRoute(app);
  registerApiRoute(app);
}