import { useContext } from "react";

import { FavoritesContext, type FavoritesContextValue } from "../context/favorites-context.ts";

export function useFavorites(): FavoritesContextValue {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites must be used within FavoritesProvider.");
  return value;
}
