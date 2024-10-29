import {HonoApp} from "@/@types/hono";
import {Hono} from "hono";
import {registerSeriesRoute} from "@/routes/api/v4/series/[series]";
import {z} from "zod";
import {zValidator} from "@hono/zod-validator";
import {prisma} from "@/lib/prisma";
import {filterSeries} from "@/lib/filter";
import {ZVisibility} from "@/@types/models";
import {badRequest, unauthorized} from "@/utils/response";
import {ok} from "@/utils/response/ok";
import {Prisma} from "@prisma/client";

export const registerSeriesRoutes = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  registerSeriesRoute(api);
  registerGetIndexRoute(api);
  registerPostIndexRoute(api);
  app.route("/series", api);
}

const PAGE_SIZE = 100;

const registerGetIndexRoute = (app: HonoApp) => {
  app.get("/", async(c) => {
    const page = c.req.queries("page");
    const query = c.req.queries("query");
    const suggest = (c.req.queries("suggest")?.length??0) > 0;
    const author = c.req.queries("author");
    if ((page && page.length > 1 )|| (query && query.length > 1) || (author && author.length > 1)) {
      return badRequest(c, "Invalid page");
    }

    const where: Prisma.SeriesWhereInput = {
      visibility: "PUBLIC",
    }

    if (query?.[0]) {
      where.OR = [
        {
          title: {
            contains: query[0],
          }
        },
        {
          description: {
            contains: query[0],
          }
        }
      ]
    }

    if (author?.[0]) {
      where.authorId = author[0];
    }

    const series = await prisma.series.findMany({
      include: suggest ? {
        author: true,
      } : {
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
      where,
      orderBy:{
        updatedAt: "desc",
      },
      take: PAGE_SIZE,
      skip: page ? (parseInt(page[0]) - 1) * PAGE_SIZE : 0,
    });
    return ok(c, series.map(filterSeries));
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
      return unauthorized(c, "Unauthorized");
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
        movies:{
          include:{
            author: true,
          }
        }
      }
    });
    return ok(c, filterSeries(series));
  });
}
