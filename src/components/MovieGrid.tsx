import type { CSSProperties } from "react";

import type { Movie } from "../models/movie.ts";
import { MovieCard } from "./MovieCard.tsx";

type MovieGridProps = {
  movies: Movie[];
  /** Optional IMDb ratings keyed by movie id. */
  ratings?: Readonly<Record<string, string | null>>;
};

// Stagger restarts every batch so cards appended by "Load more" animate in without a long delay.
const STAGGER_BATCH = 10;

export function MovieGrid({ movies, ratings }: MovieGridProps) {
  return (
    <ul className="movie-grid">
      {movies.map((movie, index) => (
        <li key={movie.id} className="movie-grid-item" style={{ "--stagger": index % STAGGER_BATCH } as CSSProperties}>
          <MovieCard movie={movie} rating={ratings?.[movie.id] ?? null} />
        </li>
      ))}
    </ul>
  );
}
