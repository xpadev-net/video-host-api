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
  author: FilteredUser,
  series?: FilteredSeries | null,
}
