export type Movie = {
  id: string;
  title: string;
  year: string;
  posterUrl: string | null;
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
