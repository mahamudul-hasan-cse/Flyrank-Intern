# AI Research Workspace

> Capstone project for the **FlyRank Frontend AI Engineering Internship**.

## Project Overview

**AI Research Workspace** is a frontend-focused AI application that helps users do research with AI. Users can chat with an AI assistant, organize their findings into workspaces, save useful responses, and come back to their research later.

The goal of the project is to practice building a production-quality, accessible, and well-structured AI-powered frontend using modern React tooling, while following professional engineering workflows (Git, code review, Conventional Commits, CI/CD deployment).

## Planned Features

- **AI chat interface** – Ask questions and receive AI-generated responses, with streaming output.
- **Research workspaces** – Create, rename, and delete workspaces to group related research topics.
- **Saved responses** – Bookmark useful AI responses and store them inside a workspace.
- **Notes and organization** – Add notes, tags, or titles to saved items for easier retrieval.
- **Search and filter** – Quickly find saved responses across workspaces.
- **Conversation history** – Revisit previous AI conversations per workspace.
- **Robust UI states** – Clear loading, error, and empty states throughout the app.
- **Responsive and accessible design** – Works on desktop and mobile; keyboard and screen-reader friendly.
- **Secure AI integration** – AI API calls go through server-side routes so API keys are never exposed to the browser.

## Technology Stack

| Area              | Technology                                   |
| ----------------- | -------------------------------------------- |
| Framework         | [Next.js](https://nextjs.org/) (App Router)  |
| UI Library        | [React](https://react.dev/)                  |
| Language          | [TypeScript](https://www.typescriptlang.org/) |
| Styling           | [Tailwind CSS](https://tailwindcss.com/)     |
| AI                | AI API integration (via server-side routes)  |
| Version Control   | Git and GitHub                               |
| Deployment        | [Vercel](https://vercel.com/)                |

## Development Approach

- **Incremental delivery** – The project is built in small, reviewable steps. Each assignment adds a focused piece of functionality.
- **Component-driven UI** – Reusable, typed React functional components with clear props.
- **Type safety first** – TypeScript in strict mode; avoid `any`.
- **Accessibility by default** – Semantic HTML, proper labels, keyboard navigation, and sufficient color contrast.
- **Complete UI states** – Every data-driven view handles loading, error, and empty states.
- **Security** – Secrets live in environment variables (`.env.local`), are never committed, and are only used on the server.
- **AI-assisted coding** – AI tools are used to speed up development, guided by the rules in [`CLAUDE.md`](./CLAUDE.md). All AI-generated code is reviewed before it is committed.
- **Continuous deployment** – The `main` branch will be deployed to Vercel, with preview deployments for pull requests.

## Git Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(optional scope): <short description>
```

| Type       | Use for                                                   |
| ---------- | --------------------------------------------------------- |
| `feat`     | A new feature                                             |
| `fix`      | A bug fix                                                 |
| `docs`     | Documentation-only changes                                |
| `style`    | Formatting changes that do not affect code behavior       |
| `refactor` | Code changes that neither fix a bug nor add a feature     |
| `test`     | Adding or updating tests                                  |
| `chore`    | Tooling, dependencies, configuration, and maintenance     |
| `ci`       | CI/CD configuration changes                               |
| `perf`     | Performance improvements                                  |

Examples:

```
docs: add project README and AI coding rules
feat(chat): add streaming AI response component
fix(workspace): handle empty workspace list
chore: configure Tailwind CSS
```

## Current Project Status

**Phase: Environment setup (Assignment FE-01) – In Progress**

FE-01 deliverables (submission not yet finished):

- [ ] Repository initialized and pushed to GitHub
- [ ] `README.md` – project overview and conventions
- [ ] `CLAUDE.md` – rules for AI-assisted development
- [ ] `.gitignore` – Next.js / Node.js ignores
- [ ] `LICENSE` – MIT License

Upcoming work:

- [ ] Scaffold the Next.js + TypeScript + Tailwind CSS application
- [ ] Build the core UI layout
- [ ] Integrate the AI API
- [ ] Implement workspaces and saved responses
- [ ] Deploy to Vercel

The Next.js application has **not** been created yet. This repository currently contains only the setup and documentation files.

## License

This project is licensed under the [MIT License](./LICENSE).
