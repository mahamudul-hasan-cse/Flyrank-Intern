import { MovieGrid } from "../components/MovieGrid.tsx";
import { MovieSearchForm } from "../components/MovieSearchForm.tsx";
import { useMovieSearch } from "../viewmodels/useMovieSearch.ts";

export function HomePage() {
  const { query, setQuery, movies, status, errorMessage, validationMessage, handleSubmit } =
    useMovieSearch();

  return (
    <section className="page">
      <h1>Movie Explorer AI</h1>
      <p>Search for a movie by title.</p>
      <MovieSearchForm
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        isSearching={status === "loading"}
        validationMessage={validationMessage}
      />
      <div className="search-status" aria-live="polite" aria-busy={status === "loading"}>
        {status === "loading" ? <p>Searching for movies…</p> : null}
        {status === "error" ? <p className="form-error">{errorMessage}</p> : null}
        {status === "empty" ? <p>No movies found for that title.</p> : null}
      </div>
      {status === "results" ? <MovieGrid movies={movies} /> : null}
    </section>
  );
}
