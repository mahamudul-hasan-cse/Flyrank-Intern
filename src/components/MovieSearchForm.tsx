import type { FormEvent } from "react";

type MovieSearchFormProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSearching: boolean;
  validationMessage: string;
};

export function MovieSearchForm({
  query,
  onQueryChange,
  onSubmit,
  isSearching,
  validationMessage,
}: MovieSearchFormProps) {
  const errorId = "movie-search-error";

  return (
    <form className="movie-search" onSubmit={onSubmit} role="search">
      <label htmlFor="movie-title">Movie title</label>
      <div className="movie-search-row">
        <input
          id="movie-title"
          name="movie-title"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-invalid={validationMessage ? true : undefined}
          aria-describedby={validationMessage ? errorId : undefined}
          autoComplete="off"
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? "Searching…" : "Search"}
        </button>
      </div>
      {validationMessage ? (
        <p id={errorId} className="form-error">
          {validationMessage}
        </p>
      ) : null}
    </form>
  );
}
