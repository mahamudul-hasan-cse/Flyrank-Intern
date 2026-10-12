import { useEffect, useMemo, useState, type ReactNode } from "react";

import { useAuth } from "../hooks/useAuth.ts";
import type { Movie } from "../models/movie.ts";
import { removeFavorite, saveFavorite, watchFavorites } from "../services/favoritesService.ts";
import { FavoritesContext, type FavoritesContextValue } from "./favorites-context.ts";

type FavoritesProviderProps = {
  children: ReactNode;
};

type FavoritesSnapshot = {
  uid: string;
  movies: Movie[];
  errorMessage: string;
};

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { user } = useAuth();
  const [snapshot, setSnapshot] = useState<FavoritesSnapshot | null>(null);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const timeoutId = window.setTimeout(() => {
      setSnapshot((current) => {
        if (current?.uid === uid) return current;
        return {
          uid,
          movies: [],
          errorMessage:
            "Firestore is unavailable. Create a Firestore database in the Firebase console and try again.",
        };
      });
    }, 8000);

    const unsubscribe = watchFavorites(
      uid,
      (movies) => {
        window.clearTimeout(timeoutId);
        setSnapshot({ uid, movies, errorMessage: "" });
      },
      (error) => {
        window.clearTimeout(timeoutId);
        setSnapshot({ uid, movies: [], errorMessage: error.message });
      },
    );

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [user]);

  const value = useMemo<FavoritesContextValue>(() => {
    const current = user && snapshot?.uid === user.uid ? snapshot : null;
    const status = !user ? "signed-out" : !current ? "loading" : current.errorMessage ? "error" : "ready";

    return {
      favorites: current?.movies ?? [],
      status,
      errorMessage: current?.errorMessage ?? "",
      isFavorite: (imdbId) => current?.movies.some((movie) => movie.id === imdbId) ?? false,
      addFavorite: async (movie) => {
        if (!user) throw new Error("Sign in to save favorites.");
        await saveFavorite(user.uid, movie);
      },
      removeFavoriteById: async (imdbId) => {
        if (!user) throw new Error("Sign in to change favorites.");
        await removeFavorite(user.uid, imdbId);
      },
    };
  }, [snapshot, user]);

  return <FavoritesContext value={value}>{children}</FavoritesContext>;
}
