import { FeaturedHero } from "../components/FeaturedHero.tsx";
import { FeaturedRow } from "../components/FeaturedRow.tsx";
import { MovieGrid } from "../components/MovieGrid.tsx";
import { MovieGridSkeleton } from "../components/MovieGridSkeleton.tsx";
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
    <section className="page home-page">
      <FeaturedHero compact={status !== "idle"} />
      <div className="search-panel">
        <MovieSearchForm
          filters={draft}
          onQueryChange={setQuery}
          onYearChange={setYear}
          onTypeChange={setType}
          onSubmit={handleSubmit}
          isSearching={status === "loading"}
          validation={validation}
        />
      </div>
      <div className="search-status" aria-live="polite" aria-busy={status === "loading"}>
        {status === "loading" ? <p>Searching…</p> : null}
        {status === "error" ? (
          <div className="status-panel status-panel-error">
            <p className="form-error">{errorMessage}</p>
            <button type="button" className="secondary-button" onClick={retry}>
              Try again
            </button>
          </div>
        ) : null}
        {status === "empty" ? (
          <p className="status-panel">No results found. Try a different title, year, or type.</p>
        ) : null}
        {status === "results" ? (
          <p>
            Showing {movies.length} of {totalResults} results.
          </p>
        ) : null}
      </div>
      {status === "idle" ? <FeaturedRow /> : null}
      {status === "loading" ? <MovieGridSkeleton count={10} /> : null}
      {status === "results" ? (
        <>
          <MovieGrid movies={movies} />
          {isLoadingMore ? <MovieGridSkeleton count={5} /> : null}
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
