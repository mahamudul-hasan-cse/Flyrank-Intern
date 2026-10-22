import { MovieGrid } from "../components/MovieGrid.tsx";
import { MovieSearchForm } from "../components/MovieSearchForm.tsx";
import { useMovieSearch } from "../viewmodels/useMovieSearch.ts";

export function HomePage() {
  const {
    draft,
    setQuery,
    setYear,
    setType,
    movies,
    totalResults,
    hasMore,
    status,
    errorMessage,
    validation,
    isLoadingMore,
    loadMoreErrorMessage,
    handleSubmit,
    retry,
    loadMore,
  } = useMovieSearch();

  return (
    <section className="page">
      <h1>Movie Explorer AI</h1>
      <p>Search for movies, series, and episodes by title.</p>
      <MovieSearchForm
        filters={draft}
        onQueryChange={setQuery}
        onYearChange={setYear}
        onTypeChange={setType}
        onSubmit={handleSubmit}
        isSearching={status === "loading"}
        validation={validation}
      />
      <div className="search-status" aria-live="polite" aria-busy={status === "loading"}>
        {status === "loading" ? <p>Searching…</p> : null}
        {status === "error" ? (
          <>
            <p className="form-error">{errorMessage}</p>
            <button type="button" className="secondary-button" onClick={retry}>
              Try again
            </button>
          </>
        ) : null}
        {status === "empty" ? <p>No results found. Try a different title, year, or type.</p> : null}
        {status === "results" ? (
          <p>
            Showing {movies.length} of {totalResults} results.
          </p>
        ) : null}
      </div>
      {status === "results" ? (
        <>
          <MovieGrid movies={movies} />
          <div className="load-more" aria-live="polite">
            {loadMoreErrorMessage ? <p className="form-error">{loadMoreErrorMessage}</p> : null}
            {hasMore ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => void loadMore()}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading…" : loadMoreErrorMessage ? "Try again" : "Load more"}
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}
