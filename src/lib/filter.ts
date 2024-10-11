import {FilteredMovie, FilteredSeries, FilteredUser} from "@/@types/models";

export const filterUser = (user: FilteredUser): FilteredUser => {
  return {
    name: user.name,
    username: user.username,
  }
}

export const filterSeries = (series: FilteredSeries): FilteredSeries => {
  return {
    id: series.id,
    title: series.title,
    description: series.description,
    author: filterUser(series.author),
  }
}

export const filterMovie = (episode: FilteredMovie): FilteredMovie => {
  return {
    id: episode.id,
    title: episode.title,
    description: episode.description,
    author: filterUser(episode.author),
    series: episode.series ? filterSeries(episode.series) : undefined,
  }
}
