import {handleCors} from "./cors";
import {handleAuth} from "./auth";
import {HonoApp} from "@/@types/hono";
import {trimTrailingSlash} from "hono/trailing-slash";

export const registerMiddleware = (app: HonoApp) => {
  handleCors(app);
  handleAuth(app);
  app.use(trimTrailingSlash());
}
