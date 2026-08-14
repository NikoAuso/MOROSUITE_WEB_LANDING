# Contributing

Thanks for considering a contribution! This is a white-label Astro 7 SSR template; the goal is to keep it generic,
backend-agnostic, and easy to fork per deploy.

## Setup

```bash
npm install
cp .env.example .env   # ships with DEMO_MODE=true — runs with zero backend
npm run dev            # http://localhost:4321
```

Node **22+** and **npm** only (no pnpm/yarn — keep `package-lock.json` consistent).

## Before opening a PR

Run, in order, and make sure each is green:

```bash
npm run check    # astro check + tsc --noEmit
npm run lint     # ESLint
npm run format   # Prettier write (or format:check to verify)
npm test         # Vitest unit tests
```

For changes touching rendering or the data layer, also run the E2E suites:

```bash
npm run test:e2e            # mock backend, "ok" mode
npm run test:e2e:degraded   # backend unreachable → 503 + inline fallbacks
npm run test:e2e:empty      # empty payloads → <ErrorState>, disabled CTAs
```

E2E uses a local mock backend (`tests/e2e/fixtures/`) — no external services needed.

## Conventions

- **Data layer is the only network boundary.** All backend access goes through `src/lib/api.ts`; it returns
  `T | null` and never throws. Don't fetch from components or pages directly.
- **The contract lives in `src/lib/dto.ts`.** Change it there first, then propagate to components. A drift between a
  backend response and these types is a build break by design.
- **CTAs** use `<CtaButton link={site.links.<cta>} fallbackLabel={...} />`, never a raw `<a>` or hardcoded URL.
- **Import `@/lib/config`** (not `@config`) from runtime code so env overrides apply.
- **Design tokens** go in `src/styles/tokens.css` via `@theme`, not in JS (Tailwind 4 CSS-first; no
  `tailwind.config.ts`).
- **Demo data** lives in `src/lib/demo-data.ts`, typed against the DTOs — update it when the contract changes so the
  demo stays representative. (Legal documents are not part of the demo payloads; they live in `src/content/legal/`.)
- **Legal pages** (`/policy`, `/cookie`) are repo-owned Markdown in `src/content/legal/` (an Astro content
  collection) — edit those files, not the backend.
- **Fallback copy** is centralized in `src/lib/copy.ts`.

## Commits & PRs

- Use clear, conventional-style messages (`feat:`, `fix:`, `docs:`, `chore:`).
- Keep PRs focused; describe what changed and how you verified it.
- Make sure `npm run check`, `npm run lint`, and `npm test` pass before requesting review.
