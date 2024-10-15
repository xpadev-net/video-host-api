import {HonoApp} from "@/@types/hono";
import {Hono} from "hono";
import {registerMovieRoute} from "@/routes/api/v4/movies/[movie]";
import {z} from "zod";
import {zValidator} from "@hono/zod-validator";
import {prisma} from "@/lib/prisma";
import {filterMovie} from "@/lib/filter";

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
});

const registerPostIndexRoute = (app: HonoApp) => {
  app.post("/",zValidator("json", MovieBodySchema), async(c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({
        status: "error",
        message: "Unauthorized",
      }, 401);
    }
    const data = c.req.valid("json");
    if (!data) {
      return c.json({
        status: "error",
        message: "Invalid data",
      }, 400);
    }
    const movie = await prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        contentUrl: data.contentUrl,
        authorId: user.id,
        seriesId: data.seriesId,
      },
      include: {
        series: {
          include: {
            author: true,
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
    return c.json({
      status: "ok",
      movie: filterMovie(movie),
    });
  });
}
