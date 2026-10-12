import { createContext } from "react";

import type { Movie } from "../models/movie.ts";

export type FavoritesStatus = "signed-out" | "loading" | "ready" | "error";

export type FavoritesContextValue = {
  favorites: Movie[];
  status: FavoritesStatus;
  errorMessage: string;
  isFavorite: (imdbId: string) => boolean;
  addFavorite: (movie: Movie) => Promise<void>;
  removeFavoriteById: (imdbId: string) => Promise<void>;
};

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);
