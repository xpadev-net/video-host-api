import {prisma} from "@/lib/prisma";
import {PUBLIC_ENDPOINTS} from "@/env";
import {createMiddleware} from "hono/factory";
import {HonoApp} from "@/@types/hono";
import {unauthorized} from "@/utils/response";

export const handleAuth = (app: HonoApp) => {
  app.use("/*", authMiddleware);
}

const authMiddleware = createMiddleware<{
  Variables: {
    user: {
      id: string;
      username: string;
      name: string;
    }
  }
}>(async(c, next) => {
  const url = (new URL(c.req.url)).pathname;
  const token = c.req.header().authorization?.replace("Bearer ", "");
  if (!token){
    if (isPublicEndpoint(url)){
      await next();
      return;
    }
    return unauthorized(c, "Unauthorized");
  }
  const session = await prisma.session.findFirst({
    where: {
      token
    },
    include: {
      user: true
    }
  })
  if (!session){
    return unauthorized(c, "Unauthorized");
  }
  c.set("user", session.user);
  await next();
});

const isPublicEndpoint = (url: string) => {
  for (const publicPath of PUBLIC_ENDPOINTS){
    if (url.startsWith(publicPath)){
      return true;
    }
  }
  return false;
}
