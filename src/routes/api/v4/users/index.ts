import {HonoApp} from "@/@types/hono";
import {registerUsersMeRoute} from "@/routes/api/v4/users/me";
import {Hono} from "hono";
import {registerUsersDetailsRoute} from "@/routes/api/v4/users/[user]";
import {z} from "zod";
import {zValidator} from "@hono/zod-validator";
import {SIGNUP_CODE, SIGNUP_ENABLED} from "@/env";
import {prisma} from "@/lib/prisma";
import {hashPassword} from "@/lib/password";
import {createSession} from "@/lib/session";
import {filterUser} from "@/lib/filter";
import {forbidden} from "@/utils/response/forbidden";
import {badRequest} from "@/utils/response";
import {ok} from "@/utils/response/ok";

export const registerUsersRoute = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  registerUsersMeRoute(api);
  registerUsersDetailsRoute(api);
  registerPostIndexRoute(api);
  app.route("/users", api);
}

const SignupBodySchema = z.object({
  username: z.string(),
  name: z.string(),
  password: z.string(),
  signupCode: z.optional(z.string()),
})

const registerPostIndexRoute = (app: HonoApp) => {
  app.post("/", zValidator("json",SignupBodySchema),async(c) => {
    if (!SIGNUP_ENABLED) {
      return forbidden(c, "Signup is disabled");
    }
    const {username, name, password, signupCode} = c.req.valid("json");
    if (SIGNUP_CODE != undefined && SIGNUP_CODE != signupCode){
      return forbidden(c, "Invalid signup code");
    }
    try{
      const user = await prisma.user.create({
        data: {
          username,
          name,
          password: await hashPassword(password),
        }
      });
      const token = await createSession(user.id);
      return ok(c, {
        user: filterUser(user),
        token,
      })
    }catch(e){
      return badRequest(c, "Username already exists");
    }
  });
}
