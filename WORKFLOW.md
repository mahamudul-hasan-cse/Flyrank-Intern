# FE-03 AI-Assisted Workflow Experiment

## 1. Experiment setup

Both rounds used the same Next.js baseline on `main` (App Router, TypeScript, Tailwind): header, footer, and home page. Each round built the same feature—a profile settings page at `/settings`—on a separate branch: `experiment/vague-prompt` (Round 1) and `experiment/structured-prompt` (Round 2).

## 2. Round 1: vague-prompt workflow

**Prompt:** Create a settings page with a profile form and validation.

**Inferred by the AI:** A **website** field with URL checks and a **50-character** display-name maximum— not in the structured spec. Labels included “Display name” and “Save changes”; types lived in `src/lib/profile.ts`.

**Strengths:** Shared validation, client-side block before submit, focus on first error, values preserved on failure, reusable `FormField` with labels and `aria-describedby`, and a form-level `role="alert"` when several fields fail.

**Weaknesses:** No automated tests. Server `{ status: "error", errors }` was not passed into `FormField`—only a generic `aria-live` message. Bio hint used raw character count while validation trimmed before the 160-character rule.

## 3. Round 2: structured-prompt workflow

**Prompt:** Named fields (full name, email, short bio, email notifications, Save Settings), validation, UX/a11y, TypeScript rules, and **explore → plan → code → verify**.

**Verification:** Lint, typecheck, build, plus Vitest and React Testing Library—**32 tests** for validation, `saveProfileSettings`, and form behavior.

## 4. Specific branch differences

- **Vague:** website field and 50-char display-name cap; **structured:** full name, email, bio, email notifications as requested.
- **Vague:** server errors not on individual inputs; **structured:** `errorFor()` merges `result.errors` into fields (with a test).
- **Vague:** no tests; **structured:** 32 automated tests.
- **Both:** bio length vs trimming differs between validate, hint, and save—needs a single human-chosen policy.

## 5. Review effort

**Vague** branch: more manual functional and a11y review (invented scope, untested error paths). **Structured** branch: less click-through thanks to tests, but more review of Vitest setup, mocks, and dependency changes.

## 6. AI mistake caught

On `experiment/vague-prompt`, `updateProfile` could return field errors that `profile-settings-form.tsx` never bound to inputs—only a summary line appeared. Round 2 wired `errorFor()` and tested it.

## 7. What I learned

Structured prompts cut **scope invention** and enabled **repeatable verification** through tests. **Human review** remains necessary for normalization rules, tooling choices, and spec alignment. Effective AI-assisted work pairs explicit requirements, automated checks, and focused manual review—not a vague prompt alone.
