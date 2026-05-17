# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **white-label Astro 6 static-site template** for the public marketing site of a single venue (one site per deploy). All dynamic data is fetched **at build time** from a read-only HTTP backend that implements the contract in [`src/lib/dto.ts`](src/lib/dto.ts), served under the absolute URL configured in the `API_BASE_URL` env var. The backend is a fully external service: the template does not host any part of it. The output in `dist/` is fully static and deployed to Cloudflare Pages.

The template is backend-agnostic: any server that returns the documented JSON shapes under the canonical paths can drive it.

Stack: Astro 6 (static) + Tailwind 4 (CSS-first `@theme` in `src/styles/tokens.css`) + TypeScript 5 + `marked` for legal markdown. Playwright for E2E, Lighthouse CI for perf/SEO gates. Node **22.12+**.

## Commands

| Command            | Purpose                                                                |
| ------------------ | ---------------------------------------------------------------------- |
| `npm run dev`      | Dev server on `:4321` (HMR). Works offline (API calls fall back to empty payloads). |
| `npm run build`    | Static build into `dist/`. Does NOT fail on API errors (each wrapper has an `EMPTY_*` fallback). |
| `npm run preview`  | Serve `dist/` locally.                                                 |
| `npm run check`    | `astro check` + `tsc --noEmit`. Run before claiming success.           |
| `npm run lint`     | ESLint (flat config in `eslint.config.js`).                            |
| `npm run format`   | Prettier write. `format:check` for read-only.                          |
| `npm run test:e2e` | Playwright. Auto-starts `preview` via `webServer` config.              |
| `npm run test:lh`  | Lighthouse CI (perf ≥0.9, SEO ≥0.95, a11y warn ≥0.9).                  |

Run a single E2E spec: `npx playwright test --config tests/e2e/playwright.config.ts tests/e2e/seo.spec.ts`. Add `--ui` for the UI mode.

## Architecture: how a page renders

1. **`site.config.ts`** — committed, per-deploy identity: `siteSlug`, brand (colors, logo/favicon/og URLs), `analytics`, `features`, `fetch`. This is the **white-label switchboard**. Notably it does NOT contain per-environment URLs (`APP_BASE_URL`, `API_BASE_URL`, `PUBLIC_SITE_URL`) — those live in env, with demo fallbacks inlined in `src/lib/config.ts`.
2. **`src/lib/config.ts`** — merges `site.config.ts` with `import.meta.env.*` overrides (env wins). Reads `API_BASE_URL`, `PUBLIC_SITE_URL`, `PUBLIC_GA4_MEASUREMENT_ID`. The URL fields fall back to local `DEMO_*` constants declared in this file (separating env concerns from white-label config). **Always import `@/lib/config` from runtime code, not `@config` directly**. Note: there is no `appBaseUrl` — CTA URLs come from `SitePayload.links` via the API.
3. **`src/lib/api.ts`** — the only network layer. `fetchJson` does **per-process memoization** + retry-with-backoff (`config.fetch.retries`/`retryDelayMs`/`timeoutMs`) **plus a per-host circuit breaker**: a network-level failure (ECONNREFUSED / DNS / timeout) on any endpoint marks the host as dead, and every subsequent fetch to it short-circuits to the placeholder immediately. This keeps an offline backend from turning the build into a 30-second retry wall. HTTP errors from a live server (e.g. 503) still go through the normal retry loop. `fetchJsonSafe` wraps `fetchJson` and returns the provided fallback on failure so a missing backend never breaks the build. All wrappers (`api.site`, `api.openingHours`, `api.pricing`, `api.legal(doc)`, `api.seoStructuredData`) fall back to a `PLACEHOLDER_*` value from `src/lib/placeholders.ts` and always resolve to a real payload (no `null`s).
4. **`src/lib/placeholders.ts`** — **single source of truth for offline/demo content**. Holds `PLACEHOLDER_SITE`, `PLACEHOLDER_OPENING_HOURS`, `PLACEHOLDER_PRICING`, `PLACEHOLDER_SEO` and `PLACEHOLDER_LEGAL` (keyed by `LegalDocumentName`, only `policy` and `cookie`). Edit this file to tweak what users see when the backend is down.
5. **`src/lib/dto.ts`** — the public API contract. TypeScript types with JSDoc for every field, plus the canonical endpoint map (`/site`, `/site/opening-hours`, `/site/pricing`, `/legal/{doc}`, `/transparency`, `/seo/structured-data`). **Intentional contract**: any drift between the backend's responses and these types is a build-break here. When the contract changes, update this file first, then propagate to `src/lib/placeholders.ts`.
6. **`src/pages/*.astro`** — top-level route, runs API calls in frontmatter (often with `Promise.all`), passes typed payloads into components, wraps everything in `PublicLayout`.
7. **`src/layouts/PublicLayout.astro`** — `<head>` (canonical, OG, JSON-LD, GA4 consent-mode v2 bootstrap, Bunny Fonts, Font Awesome CDN) + `<Header>` / `<Footer>` / `<CookieBanner>`. Every page should go through this.
8. **`src/layouts/LegalDocument.astro`** — wraps `PublicLayout` and renders an `api.legal(doc)` payload (markdown → HTML via `src/lib/markdown.ts`). Used by `policy.astro` and `cookie.astro` — the only two legal pages this template serves (booking T&C live on the booking app; the on-site rules are rendered inline as the homepage `#regolamento` section).
9. **`src/pages/404.astro`** — generic Not Found page using `PublicLayout` + `<ErrorState>`. Astro emits it as `dist/404.html`; Cloudflare Pages serves it automatically for missing routes.
10. **`src/components/ErrorState.astro`** — reusable centered error block (badge + title + description + CTA). Use it for unexpected error states (the API layer's placeholders already cover offline/missing-data cases).

## Conventions & gotchas

- **CTAs to external apps** (booking, login, register, hotel) come from `SitePayload.links` (`site.links.booking`/`login`/`register`/`hotel`), each shaped as `{ label, url } | null`. Render with `{link && <a href={link.url}>{link.label}</a>}`. Do NOT hardcode any CTA URL in the template. There's an E2E test (`tests/e2e/cta.spec.ts`) that fails if any login/prenota link resolves to `http://localhost:4321/...` — i.e. if a relative href was used by mistake.
- **Navigation is hardcoded.** Header/footer entries live in `src/lib/navigation.ts`, not the API. The data categories shown on `trasparenza.astro` are hardcoded inline too. To white-label menus per client, fork and edit; don't try to expose them through the backend.
- **Legal markdown is trusted.** `src/lib/markdown.ts` runs `marked.parse` and inserts the output via `set:html` with no sanitization — source bodies are expected to come from trusted internal authors. Don't change this without also adding a sanitizer.
- **Tailwind 4 CSS-first**: tokens are declared in `src/styles/tokens.css` using `@theme { --... }`. No `tailwind.config.ts`. Add design tokens there, not in JS.
- **Path aliases** (`tsconfig.json`): `@/*` → `src/*`, `@config` → `./site.config.ts`. Prefer `@/lib/config` over `@config` in non-config code so env overrides apply.
- **Cookie consent**: `PublicLayout.astro` injects GA4 with `gtag('consent', 'default', ...)` set to `analytics.consentDefault` (default `denied`). `CookieBanner.astro` persists the user's choice in `localStorage` under `cookie_consent` with a 6-month TTL (Garante 10/06/2021) and calls `gtag('consent', 'update', ...)`. There is no "edit preferences" affordance — the banner reappears only when the TTL expires.
- **Trailing slashes**: `astro.config.mjs` sets `trailingSlash: 'never'`. Keep internal hrefs without trailing slashes to avoid canonical churn.
- **Sitemap**: `@astrojs/sitemap` filters out routes containing `/_`. `robots.txt` is generated by `astro-robots-txt` and points at `sitemap-index.xml`.
- **E2E body selector**: legal pages use `.prose`. When adding new legal-style pages, keep that class so the legal spec matcher continues to work.

## White-labeling a new deploy

(Per README) edit `site.config.ts` (`siteSlug`, `brand.*`), set the env vars `APP_BASE_URL` / `API_BASE_URL` / `PUBLIC_SITE_URL` in the deploy environment (the `DEMO_*` fallbacks in `src/lib/config.ts` only cover local dev), replace `public/images/favicon/*` with the real favicons, set the matching GitHub secrets, then push to `main` for Cloudflare Pages to publish. `siteSlug` must match what `GET /site` returns (`SitePayload.slug`) from the targeted backend.
