import { useEffect, useState } from "react";

import type { MovieDetails } from "../models/movie.ts";
import { getMovieById, hasOmdbApiKey } from "../services/omdbService.ts";

// Featured titles are fixed, so keep fetched details for the session to avoid refetching on switch.
const detailsCache = new Map<string, MovieDetails | null>();

type FeaturedRequest = {
  id: string;
  details: MovieDetails | null;
};

export function useFeaturedMovie(movieId: string): MovieDetails | null {
  const enabled = hasOmdbApiKey();
  const [request, setRequest] = useState<FeaturedRequest | null>(null);

  useEffect(() => {
    if (!enabled || detailsCache.has(movieId)) return;

    const controller = new AbortController();
    getMovieById(movieId)
      .then((details) => {
        detailsCache.set(movieId, details);
        if (!controller.signal.aborted) setRequest({ id: movieId, details });
      })
      .catch(() => {
        // The hero falls back to its static gradient when details are unavailable.
        if (!controller.signal.aborted) setRequest({ id: movieId, details: null });
      });

    return () => controller.abort();
  }, [enabled, movieId]);

  if (!enabled) return null;
  if (detailsCache.has(movieId)) return detailsCache.get(movieId) ?? null;
  return request?.id === movieId ? request.details : null;
}
