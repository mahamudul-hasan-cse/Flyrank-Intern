import { useState, type FormEvent } from "react";

import type { Movie } from "../models/movie.ts";
import { searchMoviesByTitle } from "../services/omdbService.ts";

export type MovieSearchStatus = "idle" | "loading" | "results" | "empty" | "error";

export function useMovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<MovieSearchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const title = query.trim();
    if (title.length === 0) {
      setValidationMessage("Enter a movie title.");
      setStatus("idle");
      setMovies([]);
      setErrorMessage("");
      return;
    }

    setValidationMessage("");
    setErrorMessage("");
    setStatus("loading");

    try {
      const results = await searchMoviesByTitle(title);
      setMovies(results);
      setStatus(results.length === 0 ? "empty" : "results");
    } catch (error: unknown) {
      setMovies([]);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "The movie search failed.");
    }
  }

  return {
    query,
    setQuery,
    movies,
    status,
    errorMessage,
    validationMessage,
    handleSubmit,
  };
}
