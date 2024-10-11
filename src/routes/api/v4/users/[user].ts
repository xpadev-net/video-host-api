import {HonoApp} from "@/@types/hono";
import {prisma} from "@/lib/prisma";

export const registerUsersDetailsRoute = (app: HonoApp) => {
  app.get("/:user", async (c) => {
    const userId = c.req.param("user");
    if (!userId){
      return c.json({
        status: "error",
        message: "No user specified"
      }, 400);
    }
    const user = prisma.user.findFirst({
      where: {
        id: userId
      }
    });
    if (!user){
      return c.json({
        status: "error",
        message: "User not found"
      }, 404);
    }
    return c.json({
      status: "ok",
      user
    });
  });
}