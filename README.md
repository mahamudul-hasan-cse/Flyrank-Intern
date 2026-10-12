# Movie Explorer AI

## Overview

Movie Explorer AI is a React and TypeScript movie discovery app. Users can search for movies, open a details page, sign in with email and password, and keep a personal list of favorites stored in Firebase.

It was built for the FlyRank Frontend AI Engineering internship using AI-assisted development in Cursor, with every change reviewed and verified before it was committed.

## Features

- **OMDb movie search** – search movies by title.
- **Movie cards** – a responsive grid showing poster, title, and year, with a fallback when no poster exists.
- **Movie details page** – `/movie/:id` shows the poster, year, rating, runtime, genre, director, actors, IMDb rating, and plot.
- **Firebase email/password authentication** – sign up, log in, log out, and stay signed in after a refresh.
- **Protected Favorites route** – signed-out visitors to `/favorites` are sent to `/login` and returned to Favorites after logging in.
- **User-specific Firestore favorites** – save or remove movies from cards and the details page; each user sees only their own list.
- **Favorite persistence** – favorites are stored in Cloud Firestore and survive refreshes and new sessions.
- **Responsive UI** – layouts adapt from mobile to desktop.
- **Loading, error, and empty states** – every async view shows clear feedback.
- **Accessible forms and controls** – labeled inputs, keyboard-usable buttons, visible focus styles, and saved state shown with text and `aria-pressed`, not color alone.

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [OMDb API](https://www.omdbapi.com/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)

## Project Structure

```text
src/
  components/   Reusable UI: movie cards, grid, search form, auth form, favorite button, route guard
  pages/        Route-level screens: Home, Movie Details, Favorites, Login
  services/     External access: OMDb requests, Firebase setup, auth and favorites operations
  viewmodels/   Hooks that hold page logic and state for search and movie details
  context/      React providers for auth state and the signed-in user's favorites
  hooks/        Small hooks that read those contexts (useAuth, useFavorites)
  models/       App-level data shapes such as Movie and MovieDetails
  types/        API and helper types for OMDb responses, auth, and navigation
```

Firebase and API calls stay in `services`, `context`, and `viewmodels`, so components and pages focus on rendering.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your own values. `.env.local` is git-ignored and must never be committed.

```bash
VITE_OMDB_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- Get an OMDb key at [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx).
- Firebase values come from **Project settings → Your apps → Web app** in the Firebase console.

Vite reads these values only when the dev server starts, so restart it after changing them.

## Local Setup

Requires Node.js 20.19+ or 22.12+ (needed by Vite).

```bash
# 1. Clone the repository
git clone https://github.com/mahamudul-hasan-cse/Flyrank-Intern.git
cd Flyrank-Intern

# 2. Check out the assignment branch
git checkout assignment/movie-ai-app

# 3. Install dependencies
npm install

# 4. Create your local environment file
cp .env.example .env.local
# Windows PowerShell: Copy-Item .env.example .env.local

# 5. Add your OMDb and Firebase values to .env.local

# 6. Start the dev server
npm run dev
```

## Available Scripts

| Command             | Description                                 |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Start the Vite development server           |
| `npm run lint`      | Run oxlint on the source code               |
| `npm run typecheck` | Run the TypeScript project type check       |
| `npm run build`     | Type-check and create a production build    |

## Firebase Setup

1. In the Firebase console, enable **Authentication → Sign-in method → Email/Password**.
2. Create a **Firestore Database** for the project.
3. Favorites are stored at:

   ```text
   users/{uid}/favorites/{imdbID}
   ```

   Each document holds only `imdbID`, `title`, `year`, and `posterUrl`.

4. Use rules that let each signed-in user read and write only their own favorites:

   ```text
   match /users/{userId}/favorites/{movieId} {
     allow read, write: if request.auth != null && request.auth.uid == userId;
   }
   ```

## AI-Assisted Development

- [`PROMPTS.md`](./PROMPTS.md) records each feature prompt, the AI output, and my manual review.
- [`AI_DEVELOPMENT.md`](./AI_DEVELOPMENT.md) summarizes how AI helped, the workflow used, the manual corrections made, and what I learned.

Project rules for AI coding assistants are in [`CLAUDE.md`](./CLAUDE.md).

## Verification

Each feature was checked with `npm run lint`, `npm run typecheck`, and `npm run build`. Live browser tests covered OMDb search, movie details, Firebase signup/login/logout and session persistence, the protected Favorites route, saving and removing Firestore favorites, persistence after refresh, and isolation of favorites between two users.

## Assignment

This project was built for the **FlyRank Frontend AI Engineering internship – Week 3 assignment**.

## License

This project is licensed under the [MIT License](./LICENSE).
