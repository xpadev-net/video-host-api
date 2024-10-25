import {HonoApp} from "@/@types/hono";
import {Hono} from "hono";
import {registerMovieRoute} from "@/routes/api/v4/movies/[movie]";
import {z} from "zod";
import {zValidator} from "@hono/zod-validator";
import {prisma} from "@/lib/prisma";
import {filterMovie} from "@/lib/filter";
import {ZVisibility} from "@/@types/models";
import {badRequest, unauthorized} from "@/utils/response";
import {ok} from "@/utils/response/ok";

export const registerMoviesRoutes = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  registerMovieRoute(api);
  registerPostIndexRoute(api);
  app.route("/movies", api);
}

const MovieBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  seriesId: z.string().optional(),
  contentUrl: z.string(),
  visibility: ZVisibility.optional().default("PUBLIC"),
});

const registerPostIndexRoute = (app: HonoApp) => {
  app.post("/",zValidator("json", MovieBodySchema), async(c) => {
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
        contentUrl: data.contentUrl,
        authorId: user.id,
        seriesId: data.seriesId,
        visibility: data.visibility,
      },
      include: {
        series: {
          include: {
            author: true,
            movies: {
              include: {
                author: true,
              }
            }
          }
        },
        author: true,
      }
    });
    if (data.seriesId){
      await prisma.series.update({
        where: {
          id: data.seriesId,
        },
        data: {
          updatedAt: new Date(),
        }
      })
    }
    return ok(c, filterMovie(movie));
  });
}
