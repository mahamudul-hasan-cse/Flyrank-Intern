import { useState } from "react";

import type { Movie } from "../models/movie.ts";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPoster = movie.posterUrl !== null && !imageFailed;

  return (
    <article className="movie-card">
      {showPoster ? (
        <img
          className="movie-poster"
          src={movie.posterUrl ?? undefined}
          alt={`${movie.title} poster`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="movie-poster movie-poster-fallback" role="img" aria-label={`No poster for ${movie.title}`}>
          No poster
        </div>
      )}
      <h2>{movie.title}</h2>
      <p>{movie.year}</p>
    </article>
  );
}
