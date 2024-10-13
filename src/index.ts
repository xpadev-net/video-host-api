import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {registerRoute} from "./routes";
import {registerMiddleware} from "./middleware";
import {HonoApp} from "@/@types/hono";
import {PORT} from "@/env";

const app = new Hono() as HonoApp;

registerMiddleware(app);

registerRoute(app );

const port = PORT;
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
