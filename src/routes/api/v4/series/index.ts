import {HonoApp} from "@/@types/hono";
import {Hono} from "hono";
import {registerSeriesRoute} from "@/routes/api/v4/series/[series]";
import {z} from "zod";
import {zValidator} from "@hono/zod-validator";
import {prisma} from "@/lib/prisma";
import {filterSeries} from "@/lib/filter";
import {ZVisibility} from "@/@types/models";

export const registerSeriesRoutes = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  registerSeriesRoute(api);
  registerGetIndexRoute(api);
  registerPostIndexRoute(api);
  app.route("/series", api);
}

const registerGetIndexRoute = (app: HonoApp) => {
  app.get("/", async(c) => {
    const series = await prisma.series.findMany({
      include: {
        movies: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
          include:{
            author: true,
          }
        },
        author: true,
      },
      where:{
        visibility: "PUBLIC",
      },
      orderBy:{
        updatedAt: "desc",
      }
    });
    return c.json({
      status: "ok",
      series: series.map(filterSeries),
    })
  });
}

const PostSeriesSchema = z.object({
  title: z.string(),
  description: z.string(),
  visibility: ZVisibility.optional().default("PUBLIC"),
});

const registerPostIndexRoute = (app: HonoApp) => {
  app.post("/", zValidator("json", PostSeriesSchema), async(c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({
        status: "error",
        message: "Unauthorized",
      }, 401);
    }
    const {title,description,visibility} = c.req.valid("json");
    const series = await prisma.series.create({
      data: {
        title: title,
        description: description,
        authorId: user.id,
        visibility: visibility,
      },
      include: {
        author: true,
      }
    });
    return c.json({
      status: "ok",
      series: filterSeries(series),
    });
  });
}
