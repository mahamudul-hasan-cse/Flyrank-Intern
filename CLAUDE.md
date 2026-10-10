# CLAUDE.md – AI-Assisted Development Rules

This file guides AI coding assistants (Claude, Cursor, Copilot, etc.) working on the **AI Research Workspace** project. Follow these rules for every change.

## Project Context

- **Project:** AI Research Workspace – users chat with AI, organize research, save useful responses, and manage research workspaces.
- **Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, AI API integration, deployed on Vercel.
- **Status:** Setup phase. Do not scaffold or add large features unless explicitly asked.

## 1. TypeScript

- Write all code in TypeScript (`.ts` / `.tsx`). Do not add `.js` / `.jsx` source files.
- Keep `strict` mode enabled.
- Do not use `any`. Prefer precise types, `unknown` with narrowing, or generics.
- Define explicit types for component props, API request/response shapes, and shared data models.
- Put shared types in a dedicated location (for example, `src/types/`).

## 2. React Functional Components

- Use functional components and hooks only. Do not use class components.
- Type props with an interface or type alias, for example `type ButtonProps = { ... }`.
- Default to **Server Components** in the App Router. Add `"use client"` only when a component needs state, effects, event handlers, or browser APIs.
- Keep components small and focused on one responsibility.
- Move reusable stateful logic into custom hooks (`useSomething`).

## 3. Reusable Components

- Build generic UI primitives (Button, Input, Card, Modal, Spinner, etc.) in `src/components/ui/`.
- Put feature-specific components in feature folders (for example, `src/components/chat/`, `src/components/workspace/`).
- Make components configurable through props instead of duplicating similar components.
- Avoid hard-coded copy, colors, and sizes inside reusable components; use props and Tailwind theme tokens.
- Check whether a suitable component already exists before creating a new one.

## 4. Accessibility (a11y)

- Use semantic HTML (`button`, `nav`, `main`, `header`, `section`, `form`, `label`, and so on).
- Every interactive element must be reachable and usable with the keyboard.
- Keep visible focus styles. Do not remove outlines without providing a replacement.
- All form inputs must have associated labels. Icon-only buttons need an `aria-label`.
- Images need meaningful `alt` text (or `alt=""` if they are decorative).
- Announce dynamic content, such as streaming AI responses and errors, with `aria-live` regions where appropriate.
- Ensure sufficient color contrast (WCAG 2.1 AA).
- Manage focus correctly in modals and dialogs (trap focus, and restore it on close).

## 5. Loading, Error, and Empty States

Every view or component that fetches or depends on async data must handle all of these states:

- **Loading:** Show a spinner or skeleton. Disable submit buttons while a request is in progress to prevent duplicate requests.
- **Error:** Show a clear, user-friendly message and a retry option when it makes sense. Never show raw stack traces or internal error details to users.
- **Empty:** Show a helpful empty state (for example, "No workspaces yet – create your first one") with a call to action.
- **Success:** Render the data.

Use Next.js `loading.tsx` and `error.tsx` route files where appropriate.

## 6. API Keys and Secrets

- **Never** hard-code API keys, tokens, or secrets in source code.
- **Never** expose secret keys to the client. AI provider calls must run on the server (Route Handlers in `app/api/` or Server Actions).
- **Never** prefix secret variables with `NEXT_PUBLIC_`. That prefix bundles the value into client-side JavaScript.
- **Never** log secrets or include them in error messages.
- **Never** commit `.env` files that contain real values.

## 7. Environment Variables

- Store local secrets in `.env.local` (this file is git-ignored).
- Keep a committed `.env.example` that lists every required variable name with placeholder values and no real secrets.
- Read variables through `process.env` in server-only code, and validate that required variables are present at startup or at first use.
- Configure production values in the Vercel project settings, not in the repository.

Example `.env.example`:

```bash
# Server-only – never prefix with NEXT_PUBLIC_
AI_API_KEY=your-api-key-here
```

## 8. Conventional Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) for every commit:

```
<type>(optional scope): <short, imperative description>
```

- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`.
- Use the imperative mood ("add", not "added"), lowercase, and no trailing period.
- Keep each commit focused on one logical change.
- Examples:
  - `feat(chat): add message input component`
  - `fix(api): handle AI provider timeout`
  - `docs: update README setup instructions`

## 9. General Guidelines

- Style with Tailwind CSS utility classes. Avoid inline styles and ad-hoc CSS files unless necessary.
- Keep changes scoped to the task. Do not refactor unrelated code.
- Do not add new dependencies without a clear reason.
- Match the existing code style, naming, and folder structure.
- Explain any non-obvious decisions in the pull request or commit description, not in noisy code comments.
- A human reviews all AI-generated code before it is committed.
