import { zValidator } from '@hono/zod-validator'
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {HonoApp} from "@/@types/hono";
import {hashPassword, isPasswordValid} from "@/lib/password";
import {createSession} from "@/lib/session";

const passwordAuthSchema = z.object({
  username: z.string(),
  password: z.string(),
  type: z.literal("password").optional().default("password"),
});

const tokenAuthSchema = z.object({
  token: z.string(),
  type: z.literal("token").optional().default("token"),
});

const authSchema = z.union([
  passwordAuthSchema,
  tokenAuthSchema,
])

export const registerAuthRoute = (app: HonoApp) => {
  app.post("/auth", zValidator('json',authSchema), async(c) => {
    const data = c.req.valid("json");
    if (data.type === "token") {
      const {token} = data;
      const session = await prisma.session.findFirst({
        where: {
          token,
          expiredAt: {
            gte: new Date(),
          }
        }
      });
      if(!session) {
        return c.json({
          status: "error",
          message: "Invalid token",
        }, 401);
      }
      const newToken = await createSession(session.userId);
      return c.json({
        status: "ok",
        token: newToken,
      });
    }
    const {username, password} = data;
    const user = await prisma.user.findFirst({
      where: {
        username,
        password: {
          not: null,
        }
      }
    });
    if(!user || !user.password) {
      return c.json({
        status: "error",
        message: "Invalid username or password",
      }, 401);
    }
    if(!await isPasswordValid(password, user.password)) {
      return c.json({
        status: "error",
        message: "Invalid username or password",
      }, 401);
    }
    const token = await createSession(user.id);
    return c.json({
      status: "ok",
      token
    });
  });
}
