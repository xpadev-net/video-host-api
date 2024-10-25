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
}

export type FilteredMovie = {
  id: string,
  title: string,
  description?: string | null,
  contentUrl: string,
  thumbnailUrl?: string | null,
  author: FilteredUser,
  series?: FilteredSeries | null,
}

export const ZVisibility = z.union([
  z.literal("PUBLIC"),
  z.literal("UNLISTED"),
  z.literal("PRIVATE"),
])
