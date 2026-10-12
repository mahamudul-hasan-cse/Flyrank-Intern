import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.ts";
import { useFavorites } from "../hooks/useFavorites.ts";
import type { Movie } from "../models/movie.ts";

type FavoriteButtonProps = {
  movie: Movie;
};

export function FavoriteButton({ movie }: FavoriteButtonProps) {
  const location = useLocation();
  const { user, status } = useAuth();
  const { status: favoritesStatus, isFavorite, addFavorite, removeFavoriteById } = useFavorites();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const saved = isFavorite(movie.id);
  const returnPath = `${location.pathname}${location.search}`;

  if (status === "loading" || (user && favoritesStatus === "loading")) {
    return <p className="favorite-status">Checking favorites…</p>;
  }

  if (!user) {
    return (
      <Link className="favorite-login" to="/login" state={{ from: returnPath }}>
        Log in to save
      </Link>
    );
  }

  async function handleClick() {
    setIsSaving(true);
    setErrorMessage("");
    try {
      if (saved) await removeFavoriteById(movie.id);
      else await addFavorite(movie);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Favorites could not be updated. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="favorite-control">
      <button
        type="button"
        className={saved ? "favorite-button saved" : "favorite-button"}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
        onClick={handleClick}
        disabled={isSaving}
      >
        {isSaving ? "Saving…" : saved ? "Saved" : "Save"}
      </button>
      {errorMessage ? (
        <p className="favorite-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
