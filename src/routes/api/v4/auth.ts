import { zValidator } from '@hono/zod-validator'
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {TOKEN_EXPIRY} from "@/env";
import {HonoApp} from "@/@types/hono";
import {hashPassword} from "@/lib/password";

const authSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export const registerAuthRoute = (app: HonoApp) => {
  app.post("/auth", zValidator('json',authSchema), async(c) => {
    const {username,password} = c.req.valid("json");
    const user = await prisma.user.findFirst({
      where: {
        username,
        password: {
          not: null,
        }
      }
    });
    if(!user) {
      return c.json({
        status: "error",
        message: "Invalid username or password",
      }, 401);
    }
    const passwordHash = await hashPassword(password);
    if(passwordHash !== user.password) {
      return c.json({
        status: "error",
        message: "Invalid username or password",
      }, 401);
    }
    const token = Math.random().toString(36).substring(7);
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiredAt: new Date(Date.now() + TOKEN_EXPIRY)
      }
    });
    return c.json({
      status: "ok",
      token
    });
  });
}