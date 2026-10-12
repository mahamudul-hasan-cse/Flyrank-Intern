import { useState } from "react";
import { Link } from "react-router-dom";

import type { Movie } from "../models/movie.ts";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPoster = movie.posterUrl !== null && !imageFailed;

  return (
    <article className="movie-card">
      <Link className="movie-card-link" to={`/movie/${movie.id}`}>
        {showPoster ? (
          <img
            className="movie-poster"
            src={movie.posterUrl ?? undefined}
            alt=""
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="movie-poster movie-poster-fallback" aria-hidden="true">
            No poster
          </div>
        )}
        <h2>{movie.title}</h2>
        <p>{movie.year}</p>
      </Link>
    </article>
  );
}
