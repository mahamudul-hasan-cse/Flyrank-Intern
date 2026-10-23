import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { FavoriteButton } from "../components/FavoriteButton.tsx";
import { RatingBadge } from "../components/RatingBadge.tsx";
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

function BackLink() {
  return (
    <Link className="back-link" to="/">
      <span aria-hidden="true">←</span> Back to search
    </Link>
  );
}

function MovieDetailsView({ movie }: { movie: MovieDetails }) {
  const [imageFailed, setImageFailed] = useState(false);
  const posterUrl = movie.posterUrl !== null && !imageFailed ? movie.posterUrl : null;
  const meta = [movie.year, movie.rated, movie.runtime].filter(Boolean);
  const genres = movie.genre?.split(",").map((genre) => genre.trim()) ?? [];

  return (
    <article className="movie-details">
      <div className="details-hero full-bleed">
        {posterUrl ? <img className="details-backdrop" src={posterUrl} alt="" aria-hidden="true" /> : null}
        <div className="details-scrim" aria-hidden="true" />
        <div className="details-hero-inner">
          <BackLink />
          <div className="details-headline">
            {posterUrl ? (
              <img
                className="details-poster"
                src={posterUrl}
                alt={`${movie.title} poster`}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="details-poster details-poster-fallback" role="img" aria-label={`No poster for ${movie.title}`}>
                <span aria-hidden="true">{movie.title}</span>
              </div>
            )}
            <div className="details-title">
              {genres.length > 0 ? (
                <ul className="genre-list" aria-label="Genres">
                  {genres.map((genre) => (
                    <li key={genre}>{genre}</li>
                  ))}
                </ul>
              ) : null}
              <h1>{movie.title}</h1>
              <div className="details-meta">
                {movie.imdbRating ? <RatingBadge rating={movie.imdbRating} size="large" /> : null}
                {meta.length > 0 ? <span>{meta.join(" · ")}</span> : null}
              </div>
              {movie.director ? (
                <p className="details-credit">
                  Directed by <strong>{movie.director}</strong>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="details-actions">
        <p className="details-actions-title" aria-hidden="true">
          {movie.title}
        </p>
        <FavoriteButton
          movie={{
            id: movie.id,
            title: movie.title,
            year: movie.year ?? "",
            posterUrl: movie.posterUrl,
          }}
        />
      </div>

      <div className="details-body">
        <section className="details-section" aria-labelledby="details-plot">
          <h2 id="details-plot">Plot</h2>
          <p>{movie.plot ?? "Not available"}</p>
        </section>
        <section className="details-section" aria-labelledby="details-facts">
          <h2 id="details-facts">Details</h2>
          <dl>
            {detailRows(movie).map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value ?? "Not available"}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}

function StatusPanel({ title, message }: { title: string; message: string }) {
  return (
    <>
      <BackLink />
      <div className="status-panel status-panel-error" role="alert">
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </>
  );
}

export function MovieDetailsPage() {
  const { id } = useParams();
  const { movie, status, errorMessage } = useMovieDetails(id);

  return (
    <section className="page details-page">
      {status === "loading" ? (
        <div className="details-hero full-bleed details-loading" aria-live="polite" aria-busy="true">
          <div className="details-hero-inner">
            <BackLink />
            <div className="details-headline">
              <div className="details-poster skeleton" aria-hidden="true" />
              <div className="details-title">
                <h1 className="sr-only">Movie details</h1>
                <p className="sr-only">Loading movie details…</p>
                <div className="skeleton skeleton-title" aria-hidden="true" />
                <div className="skeleton skeleton-line" aria-hidden="true" />
                <div className="skeleton skeleton-line skeleton-line-short" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {status === "invalid" ? <StatusPanel title="Movie not available" message="This movie link is not valid." /> : null}
      {status === "not-found" ? <StatusPanel title="Movie not found" message="No movie matches this ID." /> : null}
      {status === "error" ? <StatusPanel title="Movie details unavailable" message={errorMessage} /> : null}

      {status === "ready" && movie ? <MovieDetailsView key={movie.id} movie={movie} /> : null}
    </section>
  );
}
