import {HonoApp} from "@/@types/hono";
import {prisma} from "@/lib/prisma";
import {filterMovie} from "@/lib/filter";
import {z} from "zod";
import {zValidator} from "@hono/zod-validator";
import {ZVisibility} from "@/@types/models";

export const registerMovieRoute = (app: HonoApp) => {
  handleGet(app);
  handlePatch(app);
}

const handleGet = (app: HonoApp) => {
  app.get("/:movie", async(c) => {
    const param = c.req.param("movie");
    if (!param) {
      return c.json({
        status: "error",
        message: "No movie provided"
      }, 400);
    }
    const movie = await prisma.movie.findUnique({
      where: {
        id: param,
      },
      include: {
        author: true,
        series: {
          include: {
            author: true,
          }
        }
      }
    });
    if (!movie) {
      return c.json({
        status: "error",
        message: "Movie not found"
      }, 404);
    }

    if(movie.visibility === "PRIVATE") {
      const user = c.get("user");
      if (!user || (user.id !== movie.authorId && user.role !== "ADMIN")) {
        return c.json({
          status: "error",
          message: "Movie not found"
        }, 404);
      }
    }

    return c.json({
      status: "success",
      data: {
        ...filterMovie(movie),
        isOwner: c.get("user")?.id === movie.authorId
      }
    });
  });
}

const MoviePatchSchema = z.object({
  title: z.string(),
  description: z.string(),
  seriesId: z.string().optional(),
  visibility: ZVisibility.optional(),
});

const handlePatch = (app: HonoApp) => {
  app.patch("/:movie", zValidator("json",MoviePatchSchema), async(c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({
        status: "error",
        message: "Unauthorized"
      }, 401);
    }
    const param = c.req.param("movie");
    if (!param) {
      return c.json({
        status: "error",
        message: "No movie provided"
      }, 400);
    }
    {
      const movie = await prisma.movie.findUnique({
        where: {
          id: param,
          authorId: user.id
        }
      });
      if (!movie) {
        return c.json({
          status: "error",
          message: "Movie not found"
        }, 404);
      }
    }
    const {title, description, seriesId,visibility} = c.req.valid("json");
    const movie = await prisma.movie.update({
      where: {
        id: param
      },
      data: {
        title,
        description,
        seriesId,
        visibility
      },
      include:{
        author: true,
        series: {
          include: {
            author: true
          }
        }
      }
    });
    return c.json({
      status: "success",
      message: "Movie updated",
      data: filterMovie(movie)
    });
  })
}
