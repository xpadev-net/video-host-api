import {HonoApp} from "@/@types/hono";
import {Hono} from "hono";
import {registerMovieRoute} from "@/routes/api/v4/movies/[movie]";
import {z} from "zod";

export const registerMoviesRoutes = (app: HonoApp) => {
  const api = new Hono() as HonoApp;
  registerMovieRoute(api);
  app.route("/movies", api);
}

const MovieBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  seriesId: z.string().optional(),
});

const registerPostIndexRoute = (app: HonoApp) => {
  app.post("/", async(c) => {});
}
