import type { Movie, MovieDetails } from "../models/movie.ts";
import type { OmdbSearchItem, OmdbSearchResponse } from "../types/omdb.ts";

const OMDB_SEARCH_URL = "https://www.omdbapi.com/";
const NOT_FOUND_MESSAGES = new Set([
  "Movie not found!",
  "Incorrect IMDb ID.",
  "Error getting data.",
]);
const IMDB_ID_PATTERN = /^tt\d+$/;

export function isImdbId(id: string): boolean {
  return IMDB_ID_PATTERN.test(id);
}

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
  return optionalText(poster);
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.toUpperCase() === "N/A") return null;
  return trimmed;
}

async function fetchOmdb(params: Record<string, string>): Promise<unknown> {
  const url = new URL(OMDB_SEARCH_URL);
  url.searchParams.set("apikey", readApiKey());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("Could not reach the movie service. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new Error("The movie service is unavailable right now. Please try again.");
  }

  return response.json() as Promise<unknown>;
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

  const payload = await fetchOmdb({ s: query, type: "movie" });
  const parsed = parseSearchResponse(payload);

  if (parsed.Response === "False") {
    if (NOT_FOUND_MESSAGES.has(parsed.Error)) return [];
    throw new Error(parsed.Error);
  }

  return parsed.Search.map(toMovie);
}

function toMovieDetails(value: Record<string, unknown>): MovieDetails {
  const title = optionalText(value.Title);
  const id = optionalText(value.imdbID);
  if (!title || !id) {
    throw new Error("The movie service returned an unexpected response.");
  }

  return {
    id,
    title,
    year: optionalText(value.Year),
    rated: optionalText(value.Rated),
    runtime: optionalText(value.Runtime),
    genre: optionalText(value.Genre),
    director: optionalText(value.Director),
    actors: optionalText(value.Actors),
    plot: optionalText(value.Plot),
    imdbRating: optionalText(value.imdbRating),
    posterUrl: optionalText(value.Poster),
  };
}

export async function getMovieById(id: string): Promise<MovieDetails | null> {
  if (!isImdbId(id)) return null;

  const payload = await fetchOmdb({ i: id, plot: "full" });
  if (!isRecord(payload)) {
    throw new Error("The movie service returned an unexpected response.");
  }

  if (payload.Response === "False") {
    const message = typeof payload.Error === "string" ? payload.Error : "The movie could not be loaded.";
    if (NOT_FOUND_MESSAGES.has(message)) return null;
    throw new Error(message);
  }

  if (payload.Response !== "True") {
    throw new Error("The movie service returned an unexpected response.");
  }

  return toMovieDetails(payload);
}
