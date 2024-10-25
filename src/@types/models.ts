import {z} from "zod";

export type FilteredUser = {
  name: string,
  username: string,
}

export type FilteredSeries = {
  id: string,
  title: string,
  description?: string | null,
  author: FilteredUser,
  movies: FilteredMovie[],
}

export type FilteredMovie = {
  id: string,
  title: string,
  description?: string | null,
  duration: number,
  contentUrl: string,
  thumbnailUrl?: string | null,
  author: FilteredUser,
  series?: FilteredSeries | null,
  createdAt: Date,
}

export const ZVisibility = z.union([
  z.literal("PUBLIC"),
  z.literal("UNLISTED"),
  z.literal("PRIVATE"),
])
