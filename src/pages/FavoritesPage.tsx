import { Link } from "react-router-dom";

import { MovieGrid } from "../components/MovieGrid.tsx";
import { useFavorites } from "../hooks/useFavorites.ts";

export function FavoritesPage() {
  const { favorites, status, errorMessage } = useFavorites();

  return (
    <section className="page">
      <h1>Favorites</h1>

      {status === "loading" ? (
        <p className="status-panel" aria-live="polite" aria-busy="true">
          Loading your favorites…
        </p>
      ) : null}

      {status === "error" ? (
        <p className="status-panel status-panel-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {status === "ready" && favorites.length === 0 ? (
        <p>
          You have not saved any movies yet. <Link to="/">Search for a movie</Link>
        </p>
      ) : null}

      {status === "ready" && favorites.length > 0 ? <MovieGrid movies={favorites} /> : null}
    </section>
  );
}
