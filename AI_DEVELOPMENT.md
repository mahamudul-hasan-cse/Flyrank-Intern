# AI-Assisted Development Summary

## 1. How AI assisted during implementation

Cursor was used as a coding assistant throughout this assignment, and I reviewed each step before committing it.

- **Project setup:** Cursor replaced the inherited Next.js shell with a Vite, React, and TypeScript project at the repository root, while keeping the existing README, `CLAUDE.md`, license, and `.gitignore`.
- **Routing:** It set up React Router with Home, Movie Details, Favorites, and Login routes, plus a shared header.
- **OMDb integration:** It added a small service that reads the API key from an environment variable and handles OMDb's error responses.
- **Movie search:** It built the search form, results grid, and reusable movie cards with loading, error, and no-results states.
- **Movie details:** It added the `/movie/:id` page, which loads a movie by IMDb ID and handles invalid IDs, missing movies, and missing fields.
- **Firebase Authentication:** It added email and password signup, login, logout, and session persistence through an auth context and service.
- **Firestore favorites:** It added per-user favorites stored in Firestore, a favorite button on cards and the details page, and a protected Favorites route.
- **Accessibility:** It used labeled form fields, accessible button names, `aria-pressed` with visible text for saved state, live regions for status messages, and visible focus styles.
- **Validation:** It added checks for empty searches, invalid IMDb IDs, email format, and password length.
- **Debugging:** It helped trace layout, state, and Firestore timing problems found during browser testing.
- **Verification:** It ran lint, typecheck, and build after each feature and scripted browser tests of real flows.

## 2. Development workflow

Each feature generally followed the same loop: **explore → plan → implement → verify**.

Cursor first read the existing structure and `CLAUDE.md`, planned the smallest change that met the requirements, implemented it, and verified it with lint, typecheck, build, and live browser checks where possible. Each feature was committed separately with a Conventional Commit message.

The prompt for each feature, the AI output, and my manual review notes are documented in `PROMPTS.md`.

## 3. Manual improvements and corrections

AI output was not accepted as-is. These corrections came from review and testing:

- **Scaffold placement:** The first Vite scaffold landed in a wrongly named folder inside the repository. The files were moved to the repository root and the extra folder was removed.
- **CSS font weight:** A label used `font-weight: 650`, which was changed to the standard value `600`.
- **Movie card layout:** The card link covered the favorite button, so clicks never reached it. The card layout was changed so the button sits outside the link.
- **Movie details state:** Lint warned about setting state immediately inside an effect. Loading and invalid states are now derived during render instead.
- **OMDb not-found handling:** OMDb returns "Error getting data." for some unknown IDs. This is now shown as a clear "movie not found" state instead of a raw service error.
- **Favorite save timing:** A card could show "Saved" before Firestore accepted the write. "Saved" now appears only after server confirmation.
- **Favorite removal timing:** A quick reload after removal could bring the movie back. Save and remove now wait for Firestore's confirmation, with a timeout that shows a clear error.
- **Firebase compatibility:** The newest Firebase release requires Node 24, and this machine uses Node 22. The project uses Firebase 11.10.0 instead.
- **Manual verification:** I verified signup, login, logout, auth persistence after refresh, favorites persistence, and isolation between two user accounts in a real browser.

## 4. What I learned

- AI is fast at generating project structure, boilerplate, and repetitive UI states.
- Detailed prompts with explicit requirements and limits produce more reliable results than vague requests.
- AI-generated code still needs human review.
- Runtime testing exposes issues that lint and build do not catch, such as an overlapping layout or a write that looks saved too early.
- Security-sensitive configuration, such as API keys and Firebase values, belongs in `.env.local`, which is git-ignored, while `.env.example` lists only variable names.
- Breaking the project into small, verified features made each change easier to review, test, and commit.

## 5. Final verification

The project was verified repeatedly after each feature with:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Live browser testing was performed for:

- OMDb movie search
- Movie details
- Firebase signup, login, logout, and session persistence
- The protected Favorites route, including redirect to login and return after login
- Saving and removing favorites in Firestore
- Favorites persistence after a page refresh
- Isolation of favorites between different users

The build shows a bundle-size warning because of the Firebase SDK. It was left as-is for this assignment.
