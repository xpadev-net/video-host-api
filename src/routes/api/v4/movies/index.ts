import { HonoApp } from "@/@types/hono";
import { Hono } from "hono";
import { registerMovieRoute } from "@/routes/api/v4/movies/[movie]";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "@/lib/prisma";
import { filterMovie } from "@/lib/filter";
import { ZVisibility } from "@/@types/models";
import { badRequest, unauthorized } from "@/utils/response";
import { ok } from "@/utils/response/ok";
import { buildVisibilityFilter } from "@/utils/buildVisibilityFilter";

export const registerMoviesRoutes = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  registerMovieRoute(api);
  registerGetIndexRoute(api);
  registerPostIndexRoute(api);
  app.route("/movies", api);
};

const PAGE_SIZE = 100;

const registerGetIndexRoute = (app: HonoApp) => {
  app.get("/", async (c) => {
    const page = c.req.queries("page");
    const query = c.req.queries("query")?.[0];
    const author = c.req.queries("author")?.[0];

    const where = buildVisibilityFilter(c.get("user"), query, author);

    const movies = await prisma.movie.findMany({
      where,
      include: {
        author: true,
        series: {
          include: {
            author: true,
          },
        },
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: PAGE_SIZE,
      skip: page ? (parseInt(page[0]) - 1) * PAGE_SIZE : 0,
    });
    return ok(c, movies.map(filterMovie));
  });
};

const MovieBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  seriesId: z.string().optional(),
  contentUrl: z.string(),
  visibility: ZVisibility.optional().default("PUBLIC"),
});

const registerPostIndexRoute = (app: HonoApp) => {
  app.post("/", zValidator("json", MovieBodySchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return unauthorized(c, "Unauthorized");
    }
    const data = c.req.valid("json");
    if (!data) {
      return badRequest(c, "Invalid data");
    }
    const movie = await prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: user.id,
        seriesId: data.seriesId,
        visibility: data.visibility,
      },
      include: {
        series: {
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
        },
        author: true,
        variants: true,
      },
    });
    if (data.seriesId) {
      await prisma.series.update({
        where: {
          id: data.seriesId,
        },
        data: {
          updatedAt: new Date(),
        },
      });
    }
    return ok(c, filterMovie(movie));
  });
};
