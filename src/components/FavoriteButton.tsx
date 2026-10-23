import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.ts";
import { useFavorites } from "../hooks/useFavorites.ts";
import type { Movie } from "../models/movie.ts";
import { HeartIcon } from "./HeartIcon.tsx";

type FavoriteButtonVariant = "overlay" | "inline";

type FavoriteButtonProps = {
  movie: Movie;
  /** "overlay" renders a compact heart for poster cards; "inline" renders a labelled button. */
  variant?: FavoriteButtonVariant;
};

export function FavoriteButton({ movie, variant = "inline" }: FavoriteButtonProps) {
  const location = useLocation();
  const { user, status } = useAuth();
  const { status: favoritesStatus, isFavorite, addFavorite, removeFavoriteById } = useFavorites();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const saved = isFavorite(movie.id);
  const returnPath = `${location.pathname}${location.search}`;
  const isOverlay = variant === "overlay";
  const controlClass = `favorite-control favorite-control-${variant}`;

  if (status === "loading" || (user && favoritesStatus === "loading")) {
    return isOverlay ? (
      <div className={controlClass}>
        <span className="favorite-overlay favorite-pending">
          <span className="spinner" aria-hidden="true" />
          <span className="sr-only">Checking favorites…</span>
        </span>
      </div>
    ) : (
      <p className={`${controlClass} favorite-status`}>
        <span className="spinner" aria-hidden="true" /> Checking favorites…
      </p>
    );
  }

  if (!user) {
    return (
      <div className={controlClass}>
        <Link
          className={isOverlay ? "favorite-overlay" : "favorite-login"}
          to="/login"
          state={{ from: returnPath }}
          aria-label={isOverlay ? `Log in to save ${movie.title}` : undefined}
        >
          <HeartIcon filled={false} />
          {isOverlay ? null : <span>Log in to save</span>}
        </Link>
      </div>
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

  const buttonClass = [isOverlay ? "favorite-overlay" : "favorite-button", saved ? "saved" : "", isSaving ? "busy" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={controlClass}>
      <button
        type="button"
        className={buttonClass}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
        onClick={handleClick}
        disabled={isSaving}
      >
        <HeartIcon filled={saved} />
        {isOverlay ? null : <span>{isSaving ? "Saving…" : saved ? "Saved" : "Save"}</span>}
      </button>
      {errorMessage ? (
        <p className="favorite-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
