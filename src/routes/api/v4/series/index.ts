import { HonoApp } from "@/@types/hono";
import { Hono } from "hono";
import { registerSeriesRoute } from "@/routes/api/v4/series/[series]";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "@/lib/prisma";
import { filterSeries } from "@/lib/filter";
import { ZVisibility } from "@/@types/models";
import { badRequest, unauthorized } from "@/utils/response";
import { ok } from "@/utils/response/ok";
import { Prisma } from "@prisma/client";
import { buildVisibilityFilter } from "@/utils/buildVisibilityFilter";

export const registerSeriesRoutes = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  registerSeriesRoute(api);
  registerGetIndexRoute(api);
  registerPostIndexRoute(api);
  app.route("/series", api);
};

const PAGE_SIZE = 100;

const registerGetIndexRoute = (app: HonoApp) => {
  app.get("/", async (c) => {
    const page = parseInt(c.req.queries("page")?.[0] ?? "1") - 1;
    const query = c.req.queries("query")?.[0];
    const suggest = (c.req.queries("suggest")?.length ?? 0) > 0;
    const author = c.req.queries("author")?.[0];

    const where: Prisma.SeriesWhereInput = buildVisibilityFilter(
      c.get("user"),
      query,
      author
    );

    const series = await prisma.series.findMany({
      include: suggest
        ? {
            author: true,
          }
        : {
            movies: {
              orderBy: {
                createdAt: "desc",
              },
              take: 10,
              include: {
                author: true,
              },
            },
            author: true,
          },
      distinct: suggest ? ["title"] : undefined,
      where,
      orderBy: {
        updatedAt: "desc",
      },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    });
    return ok(c, series.map(filterSeries));
  });
};

const PostSeriesSchema = z.object({
  title: z.string(),
  description: z.string(),
  visibility: ZVisibility.optional().default("PUBLIC"),
});

const registerPostIndexRoute = (app: HonoApp) => {
  app.post("/", zValidator("json", PostSeriesSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return unauthorized(c, "Unauthorized");
    }
    const { title, description, visibility } = c.req.valid("json");
    const series = await prisma.series.create({
      data: {
        title: title,
        description: description,
        authorId: user.id,
        visibility: visibility,
      },
      include: {
        author: true,
        movies: {
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
