import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { MovieDetails } from "../models/movie.ts";
import { useMovieDetails } from "../viewmodels/useMovieDetails.ts";

type DetailRow = {
  label: string;
  value: string | null;
};

function detailRows(movie: MovieDetails): DetailRow[] {
  return [
    { label: "Year", value: movie.year },
    { label: "Rated", value: movie.rated },
    { label: "Runtime", value: movie.runtime },
    { label: "Genre", value: movie.genre },
    { label: "Director", value: movie.director },
    { label: "Actors", value: movie.actors },
    { label: "IMDb rating", value: movie.imdbRating },
  ];
}

function MoviePoster({ movie }: { movie: MovieDetails }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPoster = movie.posterUrl !== null && !imageFailed;

  if (!showPoster) {
    return (
      <div className="details-poster details-poster-fallback" role="img" aria-label={`No poster for ${movie.title}`}>
        No poster
      </div>
    );
  }

  return (
    <img
      className="details-poster"
      src={movie.posterUrl ?? undefined}
      alt={`${movie.title} poster`}
      onError={() => setImageFailed(true)}
    />
  );
}

export function MovieDetailsPage() {
  const { id } = useParams();
  const { movie, status, errorMessage } = useMovieDetails(id);

  return (
    <section className="page">
      <p>
        <Link className="back-link" to="/">
          Back to search
        </Link>
      </p>

      {status === "loading" ? (
        <div className="status-panel" aria-live="polite" aria-busy="true">
          <h1>Movie details</h1>
          <p>Loading movie details…</p>
        </div>
      ) : null}

      {status === "invalid" ? (
        <div className="status-panel status-panel-error" role="alert">
          <h1>Movie not available</h1>
          <p>This movie link is not valid.</p>
        </div>
      ) : null}

      {status === "not-found" ? (
        <div className="status-panel status-panel-error" role="alert">
          <h1>Movie not found</h1>
          <p>No movie matches this ID.</p>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="status-panel status-panel-error" role="alert">
          <h1>Movie details unavailable</h1>
          <p>{errorMessage}</p>
        </div>
      ) : null}

      {status === "ready" && movie ? (
        <article className="movie-details">
          <MoviePoster movie={movie} />
          <div>
            <h1>{movie.title}</h1>
            <dl>
              {detailRows(movie).map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value ?? "Not available"}</dd>
                </div>
              ))}
            </dl>
            <h2>Plot</h2>
            <p>{movie.plot ?? "Not available"}</p>
          </div>
        </article>
      ) : null}
    </section>
  );
}
