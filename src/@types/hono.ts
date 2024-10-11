import {Hono} from "hono";

export type HonoApp = Hono<{
  Variables: {
    user?: {
      id: string;
      username: string;
      name: string;
    }
  }
}>;