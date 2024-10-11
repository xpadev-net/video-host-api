import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {registerRoute} from "./routes";

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

registerRoute(app);

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
