import {HonoApp} from "@/@types/hono";
import {prisma} from "@/lib/prisma";
import {filterSeries} from "@/lib/filter";
import {z} from "zod";
import {zValidator} from "@hono/zod-validator";
import {ZVisibility} from "@/@types/models";

export const registerSeriesRoute = (app: HonoApp) => {
  handleGet(app);
  handlePatch(app);
}

const handleGet = (app: HonoApp) => {
  app.get("/:series", async(c) => {
    const seriesId = c.req.param("series");
    if (!seriesId) {
      return c.json({
        status: "error",
        message: "Series not found",
      }, 404);
    }
    const series = await prisma.series.findFirst({
      where: {
        id: seriesId,
      },
      include: {
        author: true,
      }
    });
    if (!series) {
      return c.json({
        status: "error",
        message: "Series not found",
      }, 404);
    }

    if(series.visibility === "PRIVATE") {
      const user = c.get("user");
      if (!user || user.id !== series.authorId) {
        return c.json({
          status: "error",
          message: "Series not found",
        }, 404);
      }
    }

    return c.json({
      status: "ok",
      series: filterSeries(series),
    });
  });
}

const PatchSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  visibility: ZVisibility.optional(),
});

const handlePatch = (app: HonoApp) => {
  app.patch("/:series", zValidator("json", PatchSchema), async(c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({
        status: "error",
        message: "Unauthorized",
      }, 401);
    }
    const param = c.req.param("series");
    if (!param) {
      return c.json({
        status: "error",
        message: "Series not found",
      }, 404);
    }
    {
      const series = await prisma.series.findUnique({
        where: {
          id: param,
          authorId: user.id,
        },
      });
      if (!series) {
        return c.json({
          status: "error",
          message: "Series not found",
        }, 404);
      }
    }
    const {title, description,visibility} = c.req.valid("json");
    const series = await prisma.series.update({
      where: {
        id: param,
        authorId: user.id,
      },
      data: {
        title,
        description,
        visibility,
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
