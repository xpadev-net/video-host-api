import {Hono} from "hono";
import {bearerAuth} from "hono/bearer-auth";
import {prisma} from "../lib/prisma";
import {PUBLIC_ENDPOINTS} from "../env";

export const handleAuth = (app: Hono) => {
  app.use("/*", async(c, next) => {
    const url = new URL(c.req.url);
    for (const publicPath of PUBLIC_ENDPOINTS){
      if (url.pathname.startsWith(publicPath)){
        await next();
        return;
      }
    }
    const token = c.req.header().authorization?.replace("Bearer ", "");
    if (!token){
      return c.json({error: "Unauthorized"}, 401);
    }
    const session = await prisma.session.findFirst({
      where: {
        token
      }
    })
    if (!session){
      return c.json({error: "Unauthorized"}, 401);
    }
    await next();
  })
}