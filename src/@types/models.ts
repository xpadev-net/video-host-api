import {z} from "zod";

export type FilteredUser = {
  id: string,
  name: string,
  avatarUrl?: string | null,
}

export type FilteredSeries = {
  id: string,
  title: string,
  description?: string | null,
  visibility: Visibility,
  author: FilteredUser,
  movies?: FilteredMovie[],
}

export type FilteredMovie = {
  id: string,
  title: string,
  description?: string | null,
  duration: number,
  variants: FilteredMovieVariant[],
  thumbnailUrl?: string | null,
  visibility: Visibility,
  author: FilteredUser,
  series?: FilteredSeries | null,
  createdAt: Date,
}

export type FilteredMovieVariant = {
  variantId: string,
  contentUrl: string,
}

export const ZVisibility = z.union([
  z.literal("PUBLIC"),
  z.literal("UNLISTED"),
  z.literal("PRIVATE"),
])

export type Visibility = z.infer<typeof ZVisibility>;
