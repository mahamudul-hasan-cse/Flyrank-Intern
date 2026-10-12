import { useEffect, useState } from "react";

import type { MovieDetails } from "../models/movie.ts";
import { getMovieById, isImdbId } from "../services/omdbService.ts";

type MovieDetailsRequest = {
  id: string;
  status: "ready" | "not-found" | "error";
  movie: MovieDetails | null;
  errorMessage: string;
};

export function useMovieDetails(movieId: string | undefined) {
  const id = movieId?.trim() ?? "";
  const [request, setRequest] = useState<MovieDetailsRequest | null>(null);

  useEffect(() => {
    if (!isImdbId(id)) return;

    const controller = new AbortController();

    getMovieById(id)
      .then((result) => {
        if (controller.signal.aborted) return;
        setRequest({
          id,
          status: result === null ? "not-found" : "ready",
          movie: result,
          errorMessage: "",
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setRequest({
          id,
          status: "error",
          movie: null,
          errorMessage: error instanceof Error ? error.message : "The movie could not be loaded.",
        });
      });

    return () => controller.abort();
  }, [id]);

  if (!isImdbId(id)) {
    return { movie: null, status: "invalid" as const, errorMessage: "" };
  }

  if (request === null || request.id !== id) {
    return { movie: null, status: "loading" as const, errorMessage: "" };
  }

  return {
    movie: request.movie,
    status: request.status,
    errorMessage: request.errorMessage,
  };
}
