import { useState } from "react";
import { Link } from "react-router-dom";

import type { Movie } from "../models/movie.ts";
import { FavoriteButton } from "./FavoriteButton.tsx";
import { RatingBadge } from "./RatingBadge.tsx";

type MovieCardProps = {
  movie: Movie;
  /** IMDb rating, shown as a badge when known. */
  rating?: string | null;
};

export function MovieCard({ movie, rating = null }: MovieCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPoster = movie.posterUrl !== null && !imageFailed;

  return (
    <article className="movie-card">
      <Link className="movie-card-link" to={`/movie/${movie.id}`}>
        <div className="movie-card-media">
          {showPoster ? (
            <img
              className="movie-poster"
              src={movie.posterUrl ?? undefined}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="movie-poster movie-poster-fallback" aria-hidden="true">
              <span>{movie.title}</span>
            </div>
          )}
          {rating ? <RatingBadge rating={rating} /> : null}
        </div>
        <div className="movie-card-body">
          <h2>{movie.title}</h2>
          <p>{movie.year}</p>
        </div>
      </Link>
      <FavoriteButton movie={movie} variant="overlay" />
    </article>
  );
}
