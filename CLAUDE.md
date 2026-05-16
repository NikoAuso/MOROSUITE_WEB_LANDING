# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **white-label Astro 6 static-site template** for the public marketing site of a MOROSUITE customer (one facility per deploy). All dynamic data is fetched **at build time** from the MOROSUITE core's read-only public API (`${coreApiBase}/api/public/v1/*`); the output in `dist/` is fully static and deployed to Cloudflare Pages. The core lives in a separate repo ([NikoAuso/MOROSUITE](https://github.com/NikoAuso/MOROSUITE)).

Stack: Astro 6 (static) + Tailwind 4 (CSS-first `@theme` in `src/styles/tokens.css`) + TypeScript 5 + `marked` for legal markdown. Playwright for E2E, Lighthouse CI for perf/SEO gates. Node **22.12+**.

## Commands

| Command            | Purpose                                                                |
| ------------------ | ---------------------------------------------------------------------- |
| `npm run dev`      | Dev server on `:4321` (HMR). Requires the core API reachable.          |
| `npm run build`    | Static build into `dist/`. Fails the build if the core API is down.    |
| `npm run preview`  | Serve `dist/` locally.                                                 |
| `npm run check`    | `astro check` + `tsc --noEmit`. Run before claiming success.           |
| `npm run lint`     | ESLint (flat config in `eslint.config.js`).                            |
| `npm run format`   | Prettier write. `format:check` for read-only.                          |
| `npm run test:e2e` | Playwright. Auto-starts `preview` via `webServer` config.              |
| `npm run test:lh`  | Lighthouse CI (perf ≥0.9, SEO ≥0.95, a11y warn ≥0.9).                  |

Run a single E2E spec: `npx playwright test --config tests/e2e/playwright.config.ts tests/e2e/seo.spec.ts`. Add `--ui` for the UI mode.

## Architecture: how a page renders

1. **`site.config.ts`** — committed, per-deploy identity: `facilitySlug`, `coreApiBase`, `coreAppUrl`, `siteUrl`, brand colors, asset URLs, feature flags, fetcher retry/timeout. This is the **white-label switchboard**.
2. **`src/lib/config.ts`** — merges `site.config.ts` with `import.meta.env.PUBLIC_*` overrides (env wins). **Always import `@/lib/config` from runtime code, not `@config` directly** — otherwise per-environment env vars (preview vs prod URLs, GA4 ID) are ignored.
3. **`src/lib/api.ts`** — the only network layer. Single `fetchJson` with **per-process memoization** + retry-with-backoff (`config.fetch.retries`/`retryDelayMs`/`timeoutMs`). Exposes typed wrappers: `api.facility()`, `api.openingHours()`, `api.pricing()`, `api.legal(doc)`, `api.transparency()`, `api.seoStructuredData()`. Page frontmatter calls these directly; because each URL is memoized, calling `api.facility()` in both a page and its layout costs one HTTP round-trip per build.
4. **`src/lib/types.ts`** — TypeScript mirror of the core's JSON shapes. **Intentional contract**: any drift between the core's controllers and these types is a build-break here. When the core changes an endpoint, update this file first, then propagate.
5. **`src/pages/*.astro`** — top-level route, runs API calls in frontmatter (often with `Promise.all`), passes typed payloads into components, wraps everything in `PublicLayout`.
6. **`src/layouts/PublicLayout.astro`** — `<head>` (canonical, OG, JSON-LD, GA4 consent-mode v2 bootstrap, Bunny Fonts, Font Awesome CDN) + `<Header>` / `<Footer>` / `<CookieBanner>` / `<CookiePreferencesToggle>`. Every page should go through this.
7. **`src/layouts/LegalDocument.astro`** — wraps `PublicLayout` and renders an `api.legal(doc)` payload (markdown → HTML via `src/lib/markdown.ts`). Used by `terms.astro`, `policy.astro`, `cookie.astro`, `regolamento.astro` — each page is a 4-line file that just calls `api.legal('<name>')`.

## Conventions & gotchas

- **CTAs to the core app** (booking, login, register) must build absolute URLs from `config.coreAppUrl`, e.g. `` `${config.coreAppUrl}/prenota` ``. There's an E2E test (`tests/e2e/cta.spec.ts`) that fails if any login/prenota link resolves to `http://localhost:4321/...` — i.e. if you used a relative href by mistake.
- **Navigation is hardcoded.** Header/footer entries live in `src/lib/navigation.ts`, not the API. The legal-data categories shown on `trasparenza.astro` are hardcoded inline too. To white-label menus per client, fork and edit; don't try to expose them through the core API.
- **Legal markdown is trusted.** `src/lib/markdown.ts` runs `marked.parse` and inserts the output via `set:html` with no sanitization — source bodies come from the core's internal authors. Don't change this without also adding a sanitizer.
- **Tailwind 4 CSS-first**: tokens are declared in `src/styles/tokens.css` using `@theme { --... }`. No `tailwind.config.ts`. Add design tokens there, not in JS.
- **Path aliases** (`tsconfig.json`): `@/*` → `src/*`, `@config` → `./site.config.ts`. Prefer `@/lib/config` over `@config` in non-config code so env overrides apply.
- **Cookie consent**: `PublicLayout.astro` injects GA4 with `gtag('consent', 'default', ...)` set to `analytics.consentDefault` (default `denied`). `CookieBanner.astro` persists the user's choice in `localStorage` under `cookie_consent` with a 6-month TTL (Garante 10/06/2021) and calls `gtag('consent', 'update', ...)`. Any element with `data-action="reset-cookie-consent"` re-opens the banner.
- **Trailing slashes**: `astro.config.mjs` sets `trailingSlash: 'never'`. Keep internal hrefs without trailing slashes to avoid canonical churn.
- **Sitemap**: `@astrojs/sitemap` filters out routes containing `/_`. `robots.txt` is generated by `astro-robots-txt` and points at `sitemap-index.xml`.
- **E2E body selector**: legal pages use `.prose` (recent fix `c11dac0`). When adding new legal-style pages, keep that class so the legal spec matcher continues to work.

## White-labeling a new deploy

(Per README) edit `site.config.ts` (`facilitySlug`, `coreApiBase`, `coreAppUrl`, `siteUrl`, `brand.*`), replace `public/images/{logo,favicon,og}.*`, set the matching GitHub secrets, then push to `main` for Cloudflare Pages to publish. `facilitySlug` must match what `GET /api/public/v1/facility` returns from the targeted core.
