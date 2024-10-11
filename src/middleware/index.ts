import {handleCors} from "./cors";
import {Hono} from "hono";
import {handleAuth} from "./auth";

export const registerMiddleware = (app: Hono) => {
  handleCors(app);
  handleAuth(app);
}
