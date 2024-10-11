import {HonoApp} from "@/@types/hono";

export const registerUsersMeRoute = (app: HonoApp) => {
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