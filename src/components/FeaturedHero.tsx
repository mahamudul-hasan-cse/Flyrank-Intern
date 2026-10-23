import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";

import { FEATURED_MOVIES } from "../models/featured.ts";
import { useFeaturedMovie } from "../viewmodels/useFeaturedMovie.ts";
import { FavoriteButton } from "./FavoriteButton.tsx";
import { RatingBadge } from "./RatingBadge.tsx";

type FeaturedHeroProps = {
  /** Shrinks the hero once search results are on screen. */
  compact: boolean;
};

export function FeaturedHero({ compact }: FeaturedHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const featured = FEATURED_MOVIES[activeIndex] ?? FEATURED_MOVIES[0];
  const details = useFeaturedMovie(featured.id);
  const [failedPoster, setFailedPoster] = useState<string | null>(null);
  const posterUrl = details?.posterUrl && details.posterUrl !== failedPoster ? details.posterUrl : null;
  const rating = details?.imdbRating ?? featured.rating;
  const meta = [featured.year, details?.runtime, details?.genre].filter(Boolean).join(" · ");
  const palette = { "--hero-from": featured.palette[0], "--hero-to": featured.palette[1] } as CSSProperties;

  return (
    <section className={compact ? "hero hero-compact" : "hero"} style={palette} aria-labelledby="hero-title">
      {posterUrl ? (
        <img
          key={posterUrl}
          className="hero-backdrop"
          src={posterUrl}
          alt=""
          aria-hidden="true"
          onError={() => setFailedPoster(posterUrl)}
        />
      ) : null}
      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-intro">
          <h1>Movie Explorer AI</h1>
          <p>Search for movies, series, and episodes by title.</p>
        </div>

        <div className="hero-feature" key={featured.id}>
          <div className="hero-copy">
            <p className="hero-eyebrow">Featured</p>
            <h2 id="hero-title">{featured.title}</h2>
            <div className="hero-meta">
              <RatingBadge rating={rating} size="large" />
              {meta ? <span>{meta}</span> : null}
            </div>
            {compact ? null : <p className="hero-tagline">{details?.plot ?? featured.tagline}</p>}
            <div className="hero-actions">
              <Link className="primary-link" to={`/movie/${featured.id}`}>
                View details
              </Link>
              <FavoriteButton
                movie={{ id: featured.id, title: featured.title, year: featured.year, posterUrl }}
              />
            </div>
          </div>
          {posterUrl ? (
            <img
              className="hero-poster"
              src={posterUrl}
              alt={`${featured.title} poster`}
              onError={() => setFailedPoster(posterUrl)}
            />
          ) : null}
        </div>

        <div className="hero-picks" role="group" aria-label="Featured titles">
          {FEATURED_MOVIES.map((movie, index) => (
            <button
              key={movie.id}
              type="button"
              className="hero-pick"
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              {movie.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
