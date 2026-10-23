import { Link } from "react-router-dom";

import { MovieGrid } from "../components/MovieGrid.tsx";
import { MovieGridSkeleton } from "../components/MovieGridSkeleton.tsx";
import { useFavorites } from "../hooks/useFavorites.ts";

export function FavoritesPage() {
  const { favorites, status, errorMessage } = useFavorites();

  return (
    <section className="page">
      <h1>Favorites</h1>

      {status === "loading" ? (
        <>
          <p className="sr-only" aria-live="polite" aria-busy="true">
            Loading your favorites…
          </p>
          <MovieGridSkeleton count={5} />
        </>
      ) : null}

      {status === "error" ? (
        <p className="status-panel status-panel-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {status === "ready" && favorites.length === 0 ? (
        <div className="status-panel empty-state">
          <p>You have not saved any movies yet.</p>
          <Link className="primary-link" to="/">
            Search for a movie
          </Link>
        </div>
      ) : null}

      {status === "ready" && favorites.length > 0 ? <MovieGrid movies={favorites} /> : null}
    </section>
  );
}
