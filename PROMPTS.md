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
