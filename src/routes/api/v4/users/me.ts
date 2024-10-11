import {HonoApp} from "@/@types/hono";
import {z} from "zod";
import {zValidator} from "@hono/zod-validator";
import {prisma} from "@/lib/prisma";

export const registerUsersMeRoute = (app: HonoApp) => {
  registerGet(app);
  registerPatch(app);
}

const registerGet = (app: HonoApp) => {
  app.get("/me", async(c) => {
    const user = c.get("user");
    if (!user){
      return c.json({
        status: "ok",
        user: null
      });
    }
    return c.json({
      status: "ok",
      user
    });
  });
}

const PatchSchema = z.object({
  name: z.string()
})

const registerPatch = (app: HonoApp) => {
  app.patch("/me",zValidator("json",PatchSchema), async(c) => {
    const user = c.get("user");
    if (!user){
      return c.json({
        status: "error",
        message: "Not logged in"
      }, 401);
    }
    const {name} = c.req.valid("json");
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        name
      }
    });
    return c.json({
      status: "ok",
      message: "Name updated"
    });
  });
}
