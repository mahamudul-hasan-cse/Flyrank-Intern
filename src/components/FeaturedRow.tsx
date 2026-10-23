import type { CSSProperties } from "react";

import { FEATURED_MOVIES, type FeaturedMovie } from "../models/featured.ts";
import { useFeaturedMovie } from "../viewmodels/useFeaturedMovie.ts";
import { MovieCard } from "./MovieCard.tsx";

function FeaturedCard({ featured }: { featured: FeaturedMovie }) {
  const details = useFeaturedMovie(featured.id);
  return (
    <MovieCard
      movie={{ id: featured.id, title: featured.title, year: featured.year, posterUrl: details?.posterUrl ?? null }}
      rating={details?.imdbRating ?? featured.rating}
    />
  );
}

export function FeaturedRow() {
  return (
    <section className="featured-row" aria-labelledby="featured-row-title">
      <h2 id="featured-row-title" className="section-title">
        Featured picks
      </h2>
      <ul className="movie-grid">
        {FEATURED_MOVIES.map((featured, index) => (
          <li key={featured.id} className="movie-grid-item" style={{ "--stagger": index } as CSSProperties}>
            <FeaturedCard featured={featured} />
          </li>
        ))}
      </ul>
    </section>
  );
}
