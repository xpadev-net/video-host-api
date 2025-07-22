import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { HonoApp } from "@/@types/hono";
import { ZVisibility } from "@/@types/models";
import { filterSeries } from "@/lib/filter";
import { prisma } from "@/lib/prisma";
import { notFound, unauthorized } from "@/utils/response";
import { ok } from "@/utils/response/ok";

export const registerSeriesRoute = (app: HonoApp) => {
  handleGet(app);
  handlePatch(app);
};

const handleGet = (app: HonoApp) => {
  app.get("/:series", async (c) => {
    const seriesId = c.req.param("series");
    if (!seriesId) {
      return notFound(c, "Series not found");
    }
    const series = await prisma.series.findFirst({
      where: {
        id: seriesId,
      },
      include: {
        author: true,
        movies: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            author: true,
            variants: true,
          },
        },
      },
    });
    if (!series) {
      return notFound(c, "Series not found");
    }

    if (series.visibility === "PRIVATE") {
      const user = c.get("user");
      if (!user || (user.id !== series.authorId && user.role !== "ADMIN")) {
        return notFound(c, "Series not found");
      }
    }

    return ok(c, filterSeries(series));
  });
};

const PatchSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  visibility: ZVisibility.optional(),
});

const handlePatch = (app: HonoApp) => {
  app.patch("/:series", zValidator("json", PatchSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return unauthorized(c, "Unauthorized");
    }
    const param = c.req.param("series");
    if (!param) {
      return notFound(c, "Series not found");
    }
    {
      const series = await prisma.series.findUnique({
        where: {
          id: param,
          authorId: user.id,
        },
      });
      if (!series) {
        return notFound(c, "Series not found");
      }
    }
    const { title, description, visibility } = c.req.valid("json");
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
        movies: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            author: true,
            variants: true,
          },
        },
      },
    });
    return ok(c, filterSeries(series));
  });
};
