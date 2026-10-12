import type { Movie } from "../models/movie.ts";
import type { OmdbSearchItem, OmdbSearchResponse } from "../types/omdb.ts";

const OMDB_SEARCH_URL = "https://www.omdbapi.com/";
const NOT_FOUND_MESSAGE = "Movie not found!";

function readApiKey(): string {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  if (typeof apiKey !== "string" || apiKey.trim().length === 0) {
    throw new Error(
      "OMDb API key is missing. Add VITE_OMDB_API_KEY to .env.local and restart the dev server.",
    );
  }
  return apiKey.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSearchItem(value: unknown): value is OmdbSearchItem {
  if (!isRecord(value)) return false;
  return (
    typeof value.Title === "string" &&
    typeof value.Year === "string" &&
    typeof value.imdbID === "string" &&
    typeof value.Type === "string" &&
    typeof value.Poster === "string"
  );
}

function parseSearchResponse(value: unknown): OmdbSearchResponse {
  if (!isRecord(value)) {
    throw new Error("The movie service returned an unexpected response.");
  }

  if (value.Response === "False") {
    return {
      Response: "False",
      Error: typeof value.Error === "string" ? value.Error : "The movie search failed.",
    };
  }

  if (value.Response !== "True" || !Array.isArray(value.Search)) {
    throw new Error("The movie service returned an unexpected response.");
  }

  const search = value.Search.filter(isSearchItem);
  return {
    Response: "True",
    Search: search,
    totalResults: typeof value.totalResults === "string" ? value.totalResults : String(search.length),
  };
}

function toPosterUrl(poster: string): string | null {
  const trimmed = poster.trim();
  if (trimmed.length === 0 || trimmed.toUpperCase() === "N/A") return null;
  return trimmed;
}

function toMovie(item: OmdbSearchItem): Movie {
  return {
    id: item.imdbID,
    title: item.Title,
    year: item.Year,
    posterUrl: toPosterUrl(item.Poster),
  };
}

export async function searchMoviesByTitle(title: string): Promise<Movie[]> {
  const query = title.trim();
  if (query.length === 0) return [];

  const url = new URL(OMDB_SEARCH_URL);
  url.searchParams.set("apikey", readApiKey());
  url.searchParams.set("s", query);
  url.searchParams.set("type", "movie");

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("Could not reach the movie service. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new Error("The movie service is unavailable right now. Please try again.");
  }

  const payload: unknown = await response.json();
  const parsed = parseSearchResponse(payload);

  if (parsed.Response === "False") {
    if (parsed.Error === NOT_FOUND_MESSAGE) return [];
    throw new Error(parsed.Error);
  }

  return parsed.Search.map(toMovie);
}
