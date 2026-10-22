import type { FormEvent } from "react";

import { MOVIE_TYPES, type MovieSearchFilters, type MovieType } from "../models/movie.ts";
import type { MovieSearchValidation } from "../viewmodels/useMovieSearch.ts";

type MovieSearchFormProps = {
  filters: MovieSearchFilters;
  onQueryChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onTypeChange: (value: MovieType | "") => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSearching: boolean;
  validation: MovieSearchValidation;
};

const TYPE_LABELS: Record<MovieType, string> = {
  movie: "Movies",
  series: "Series",
  episode: "Episodes",
};

function isTypeOption(value: string): value is MovieType | "" {
  return value === "" || (MOVIE_TYPES as readonly string[]).includes(value);
}

export function MovieSearchForm({
  filters,
  onQueryChange,
  onYearChange,
  onTypeChange,
  onSubmit,
  isSearching,
  validation,
}: MovieSearchFormProps) {
  const errorId = "movie-search-error";
  const queryInvalid = validation?.field === "query";
  const yearInvalid = validation?.field === "year";

  return (
    <form className="movie-search" onSubmit={onSubmit} role="search">
      <label htmlFor="movie-title">Title</label>
      <div className="movie-search-row">
        <input
          id="movie-title"
          name="q"
          type="search"
          value={filters.query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-invalid={queryInvalid ? true : undefined}
          aria-describedby={queryInvalid ? errorId : undefined}
          autoComplete="off"
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? "Searching…" : "Search"}
        </button>
      </div>
      <div className="movie-search-filters">
        <div className="movie-search-field">
          <label htmlFor="movie-year">Year (optional)</label>
          <input
            id="movie-year"
            name="y"
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="e.g. 2008"
            value={filters.year}
            onChange={(event) => onYearChange(event.target.value)}
            aria-invalid={yearInvalid ? true : undefined}
            aria-describedby={yearInvalid ? errorId : undefined}
            autoComplete="off"
          />
        </div>
        <div className="movie-search-field">
          <label htmlFor="movie-type">Type</label>
          <select
            id="movie-type"
            name="type"
            value={filters.type}
            onChange={(event) => {
              const { value } = event.target;
              if (isTypeOption(value)) onTypeChange(value);
            }}
          >
            <option value="">All types</option>
            {MOVIE_TYPES.map((type) => (
              <option key={type} value={type}>
                {TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
      </div>
      {validation ? (
        <p id={errorId} className="form-error">
          {validation.message}
        </p>
      ) : null}
    </form>
  );
}
