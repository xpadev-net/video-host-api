import {handleCors} from "./cors";
import {handleAuth} from "./auth";
import {HonoApp} from "@/@types/hono";

export const registerMiddleware = (app: HonoApp) => {
  handleCors(app);
  handleAuth(app);
}
