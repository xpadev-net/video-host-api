import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {registerRoute} from "./routes";
import {registerMiddleware} from "./middleware";

const app = new Hono()

registerMiddleware(app);

registerRoute(app);

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
