import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

import {
  MOVIE_TYPES,
  type Movie,
  type MovieSearchFilters,
  type MovieType,
} from "../models/movie.ts";
import { searchMovies } from "../services/omdbService.ts";

export type MovieSearchStatus = "idle" | "loading" | "results" | "empty" | "error";

export type MovieSearchValidation = {
  field: "query" | "year";
  message: string;
} | null;

type SearchResults = {
  requestKey: string;
  status: "ready" | "error";
  movies: Movie[];
  totalResults: number;
  page: number;
  hasMore: boolean;
  errorMessage: string;
};

type LoadMoreRequest = {
  requestKey: string;
  status: "loading" | "error";
  errorMessage: string;
};

// OMDb returns 10 results per page and serves at most 100 pages.
const PAGE_SIZE = 10;
const MAX_PAGE = 100;
const YEAR_PATTERN = /^\d{4}$/;
const EMPTY_FILTERS: MovieSearchFilters = { query: "", year: "", type: "" };

function isMovieType(value: string): value is MovieType {
  return (MOVIE_TYPES as readonly string[]).includes(value);
}

function readFilters(params: URLSearchParams): MovieSearchFilters {
  const year = params.get("y")?.trim() ?? "";
  const type = params.get("type")?.trim() ?? "";
  return {
    query: params.get("q")?.trim() ?? "",
    year: YEAR_PATTERN.test(year) ? year : "",
    type: isMovieType(type) ? type : "",
  };
}

function toSearchParams(filters: MovieSearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.year) params.set("y", filters.year);
  if (filters.type) params.set("type", filters.type);
  return params;
}

function hasMorePages(page: number, totalResults: number, lastPageSize: number): boolean {
  return lastPageSize > 0 && page < MAX_PAGE && page * PAGE_SIZE < totalResults;
}

function appendUnique(current: Movie[], next: Movie[]): Movie[] {
  const seen = new Set(current.map((movie) => movie.id));
  return [...current, ...next.filter((movie) => !seen.has(movie.id))];
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The movie search failed.";
}

export function useMovieSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);
  const searchKey = filters.query ? toSearchParams(filters).toString() : "";

  const [reloadCount, setReloadCount] = useState(0);
  const requestKey = `${searchKey}#${reloadCount}`;

  const [draft, setDraft] = useState<MovieSearchFilters>(filters);
  const [syncedSearchKey, setSyncedSearchKey] = useState(searchKey);
  const [validation, setValidation] = useState<MovieSearchValidation>(null);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loadMoreRequest, setLoadMoreRequest] = useState<LoadMoreRequest | null>(null);

  // Keep the form in sync when the URL changes (Back/Forward or a shared link).
  if (syncedSearchKey !== searchKey) {
    setSyncedSearchKey(searchKey);
    setDraft(searchKey ? readFilters(new URLSearchParams(searchKey)) : EMPTY_FILTERS);
    setValidation(null);
  }

  useEffect(() => {
    if (searchKey === "") return;

    const controller = new AbortController();
    const key = `${searchKey}#${reloadCount}`;

    searchMovies(readFilters(new URLSearchParams(searchKey)), 1)
      .then((page) => {
        if (controller.signal.aborted) return;
        setResults({
          requestKey: key,
          status: "ready",
          movies: page.movies,
          totalResults: page.totalResults,
          page: 1,
          hasMore: hasMorePages(1, page.totalResults, page.movies.length),
          errorMessage: "",
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setResults({
          requestKey: key,
          status: "error",
          movies: [],
          totalResults: 0,
          page: 0,
          hasMore: false,
          errorMessage: toErrorMessage(error),
        });
      });

    return () => controller.abort();
  }, [searchKey, reloadCount]);

  const currentResults = results?.requestKey === requestKey ? results : null;
  const currentLoadMore = loadMoreRequest?.requestKey === requestKey ? loadMoreRequest : null;

  let status: MovieSearchStatus = "idle";
  if (searchKey !== "") {
    if (currentResults === null) status = "loading";
    else if (currentResults.status === "error") status = "error";
    else status = currentResults.movies.length === 0 ? "empty" : "results";
  }

  const isLoadingMore = currentLoadMore?.status === "loading";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const query = draft.query.trim();
    const year = draft.year.trim();

    if (query.length === 0) {
      setValidation({ field: "query", message: "Enter a title." });
      return;
    }

    if (year.length > 0 && !YEAR_PATTERN.test(year)) {
      setValidation({ field: "year", message: "Enter a 4-digit year, for example 2008." });
      return;
    }

    setValidation(null);
    const nextParams = toSearchParams({ query, year, type: draft.type });

    if (nextParams.toString() === searchKey) {
      setReloadCount((count) => count + 1);
      return;
    }

    setSearchParams(nextParams);
  }

  function retry() {
    setReloadCount((count) => count + 1);
  }

  async function loadMore() {
    if (currentResults?.status !== "ready" || !currentResults.hasMore || isLoadingMore) return;

    const key = requestKey;
    const nextPage = currentResults.page + 1;
    setLoadMoreRequest({ requestKey: key, status: "loading", errorMessage: "" });

    try {
      const page = await searchMovies(filters, nextPage);
      setResults((previous) => {
        if (previous?.requestKey !== key) return previous;
        return {
          ...previous,
          movies: appendUnique(previous.movies, page.movies),
          totalResults: page.totalResults || previous.totalResults,
          page: nextPage,
          hasMore: hasMorePages(nextPage, page.totalResults, page.movies.length),
        };
      });
      setLoadMoreRequest((previous) => (previous?.requestKey === key ? null : previous));
    } catch (error: unknown) {
      setLoadMoreRequest((previous) =>
        previous?.requestKey === key
          ? { requestKey: key, status: "error", errorMessage: toErrorMessage(error) }
          : previous,
      );
    }
  }

  return {
    draft,
    setQuery: (query: string) => setDraft((current) => ({ ...current, query })),
    setYear: (year: string) => setDraft((current) => ({ ...current, year })),
    setType: (type: MovieType | "") => setDraft((current) => ({ ...current, type })),
    movies: currentResults?.movies ?? [],
    totalResults: currentResults?.totalResults ?? 0,
    hasMore: currentResults?.status === "ready" && currentResults.hasMore,
    status,
    errorMessage: currentResults?.errorMessage ?? "",
    validation,
    isLoadingMore,
    loadMoreErrorMessage: currentLoadMore?.status === "error" ? currentLoadMore.errorMessage : "",
    handleSubmit,
    retry,
    loadMore,
  };
}
