export type Movie = {
  id: string;
  title: string;
  year: string;
  posterUrl: string | null;
};

export const MOVIE_TYPES = ["movie", "series", "episode"] as const;

export type MovieType = (typeof MOVIE_TYPES)[number];

export type MovieSearchFilters = {
  query: string;
  year: string;
  type: MovieType | "";
};

export type MovieSearchPage = {
  movies: Movie[];
  totalResults: number;
};

export type MovieDetails = {
  id: string;
  title: string;
  year: string | null;
  rated: string | null;
  runtime: string | null;
  genre: string | null;
  director: string | null;
  actors: string | null;
  plot: string | null;
  imdbRating: string | null;
  posterUrl: string | null;
};
