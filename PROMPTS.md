# AI prompts — Movie Explorer AI

## Prompt 1 — Project setup

Goal:
Replace the inherited Next.js shell on `assignment/movie-ai-app` with a Vite + React + TypeScript app at the repository root, add React Router, and leave a minimal Home / Favorites / Login shell. Do not implement OMDb, Firebase, search, favorites logic, or theme switching yet.

Prompt summary:
Keep `README.md`, `CLAUDE.md`, `LICENSE`, and `.gitignore`. Remove Next.js app and config files. Scaffold Vite + React + TypeScript in the current root without a nested project or nested git repo. Keep TypeScript strict and use functional components. Install `react-router-dom`. Add routes `/`, `/favorites`, and `/login`, a shared header, and basic responsive styling. Add an MVVM-inspired folder layout without extra unused feature code. Verify with install, lint, build, and a type check. Document this prompt. Do not commit.

AI output:
Vite React TypeScript project files, React Router shell, placeholder pages, shared header, global CSS, empty `models`, `viewmodels`, `services`, `hooks`, and `context` folders, and this prompt log.

Manual review:
The Vite template did not set `"strict": true`, so that option was added to `tsconfig.app.json` and `tsconfig.node.json`. The generated package name and page title were corrected. A first scaffold landed in a wrongly named folder because the template path was not passed through; those files were moved to the repository root and the extra folder was removed. No feature-code rewrites beyond that.

## Prompt 2 — OMDb search and movie cards

Goal:
Add OMDb title search and movie result cards on the Home page. Do not add Firebase, authentication, favorites persistence, recent searches, genre filters, movie details, or theme switching.

Prompt summary:
Read the existing structure and `CLAUDE.md`. Call OMDb with `VITE_OMDB_API_KEY`, never a hard-coded key. Add a movie service, search-result types, a submit-only search form, a responsive grid, and a reusable `MovieCard` showing poster, title, and year. Skip empty searches. Show loading, error, and no-results states, and keep the typed title after results load. Handle a missing poster. Add `.env.example` with an empty `VITE_OMDB_API_KEY`. Update this prompt log. Verify lint, typecheck, and build. Do not commit.

AI output:
`omdbService`, movie and OMDb types, `useMovieSearch`, `MovieSearchForm`, `MovieGrid`, `MovieCard`, Home page states, search styles, and `.env.example`.

Manual review:
Lint, typecheck, and build passed. There is no `.env.local`, so a live OMDb search was not run. The label weight was changed from `650` to `600` so it uses a standard font weight. No other code changes were required after verification.

## Prompt 3 — Movie details page

Goal:
Open a movie details page from each search card. Load the movie by IMDb ID and show its poster and main facts. Do not add Firebase, authentication, favorites persistence, recent searches, genre filters, or theme switching.

Prompt summary:
Read the existing structure and `CLAUDE.md`. Add `/movie/:id`. Link each `MovieCard` to that route. Fetch details through the OMDb service with the existing environment variable. Show poster, title, year, rated, runtime, genre, director, actors, plot, and IMDb rating when OMDb provides them. Handle loading, an invalid ID, a missing movie, API or network errors, a missing poster, and missing optional fields. Keep the back link keyboard accessible. Update this prompt log. Verify lint, typecheck, and build. Test one real movie if a local key exists. Do not commit.

AI output:
`getMovieById`, `MovieDetails`, `useMovieDetails`, `MovieDetailsPage`, a card link, details styles, and shared OMDb request handling.

Manual review:
Lint warned about setting state immediately inside the details effect, so loading and invalid states are derived during render instead. A live check of Batman Begins (`tt0372784`) showed the poster, title facts, plot, and a focusable Back link. An ID OMDb cannot resolve returned “Error getting data.”, so that response is now treated as movie not found rather than a raw service error.

## Prompt 4 — Firebase authentication

Goal:
Add email and password registration, login, logout, and signed-in state. Do not add favorites storage, protected routes, recent searches, genre filters, or theme switching.

Prompt summary:
Read the existing structure and `CLAUDE.md`. Install Firebase and read only `VITE_FIREBASE_*` environment variables. Do not hard-code credentials. Add a Firebase config module, auth service, and React auth state. Update `/login` with login and signup modes, labels, loading, errors, and a redirect after success. Show Login when signed out, and the user email plus Logout when signed in. Update `.env.example` with empty Firebase values and this prompt log. Verify lint, typecheck, and build. Do not invent credentials or commit.

AI output:
Firebase 11 setup, `firebase` and `authService` modules, `AuthProvider`, `useAuth`, `AuthForm`, login page states, and header account controls.

Manual review:
The newest Firebase release requires Node 24, and this machine uses Node 22, so the app uses Firebase 11.10.0 instead. After real Firebase values were added to `.env.local`, a browser pass created a temporary account, confirmed redirect to `/`, the header email and Logout button, logout back to Login, login with the same account, and that refresh kept the session. Invalid email, empty password, and a wrong password each showed a clear message and stayed on `/login`. No page crash occurred. The browser logged one HTTP 400 for the rejected password, which is Firebase’s failed sign-in response, not an unhandled app error. No Firebase config values appeared in the page. Lint, typecheck, and build passed. No auth code change was required after this check.

## Prompt 5 — Firebase favorites and protected route

Goal:
Save favorites per signed-in user in Cloud Firestore and protect `/favorites`. Do not add recent searches, genre filters, or theme switching.

Prompt summary:
Read the existing structure and `CLAUDE.md`. Store each favorite at `users/{uid}/favorites/{imdbID}` with only `imdbID`, `title`, `year`, and `posterUrl`. Add and remove favorites from movie cards and the details page. Show a login action when signed out. Show whether a movie is already saved, with a text label as well as `aria-pressed`. Redirect signed-out visits to `/favorites` toward `/login`, then return there after login. The favorites page should show saved cards, an empty state, a loading state, and a Firebase error. Keep Firestore calls in the service and context layers and reuse `MovieCard`. Update this prompt log. Verify lint, typecheck, and build. Do not commit.

AI output:
Firestore access on the existing Firebase app, `favoritesService`, `FavoritesProvider`, `useFavorites`, `FavoriteButton`, `RequireAuth`, a real favorites page, login return path, and favorite-button styles.

Manual review:
Lint, typecheck, and build passed. Vite warns that the production bundle is over 500 kB because the Firebase SDK is included; that was left as-is. A browser pass confirmed that a signed-out visit to `/favorites` redirects to `/login`, and submitting that login form returns to `/favorites`. Signed-out search cards show a “Log in to save” link. A signed-in Save button exposes the text “Save”, `aria-pressed="false"`, and an “Add … to favorites” label, and Enter activates it. The details page shows the same labeled button. The card link originally covered the button, so the card layout was changed so the favorite control sits outside the link and can be clicked. Before the Firestore database existed, the app could not reach it (`unavailable`). The favorites page and the Save button both showed that error instead of marking the movie saved.

After the database was created, a live browser pass confirmed that a signed-in user can save Batman Begins from a search card, the details page then shows “Saved”, the movie appears on `/favorites`, it is still there after a refresh, and it can be removed. A newly created second account saw an empty favorites page, while the first account still had its saved movie. The test favorite was removed afterward.

Two corrections came from this pass. First, the list accepted Firestore’s local pending snapshot, so a card could show “Saved” before the server accepted the write, and leaving the page immediately lost it. The list now ignores snapshots with pending writes. Second, a deleted document reports no pending write, so a removal looked confirmed too early and a quick reload brought the movie back. Save and remove now wait for Firestore’s own write promise, with a 10-second timeout that shows the unavailable message. One limit remains: on `/favorites`, a removed card disappears immediately, so a reload in the second before the delete finishes can still restore it.
