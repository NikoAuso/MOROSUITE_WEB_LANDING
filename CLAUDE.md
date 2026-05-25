# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **white-label Astro 6 SSR template** for a backend-driven marketing/showcase site (one site per deploy). The
template is generic and ships no business data: all dynamic content is fetched **at request time** from a read-only
HTTP backend that implements the contract in [`src/lib/dto.ts`](src/lib/dto.ts), served under the absolute URL
configured in the `API_BASE_URL` env var. Every backend call carries a Bearer token from `API_AUTH_TOKEN`. The
backend is a fully external service: the template does not host any part of it. A seasonal venue is the worked
example, but nothing in the data layer is domain-specific.

For local exploration without a backend, set `DEMO_MODE=true`: `src/lib/api.ts` then serves bundled fixtures from
`src/lib/demo-data.ts` (no network, no cache).

The template is backend-agnostic: any server that returns the documented JSON shapes under the canonical paths can drive
it. Results are cached in-process (default TTL 300 s, tunable via `CACHE_TTL_SECONDS`).

Stack: Astro 6 (SSR, Node standalone) + Tailwind 4 (CSS-first `@theme` in `src/styles/tokens.css`) + TypeScript 5.
Vitest for unit tests, Playwright for E2E, Lighthouse CI for perf/SEO gates. Node **22+**.

## Commands

| Command                     | Purpose                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm run dev`               | Dev server on `:4321` (HMR). Calls backend on every request; shows inline "non disponibile" if down.         |
| `npm run build`             | SSR build into `dist/`. Entry point: `dist/server/entry.mjs`.                                                |
| `npm run preview`           | `node --env-file-if-exists=.env ./dist/server/entry.mjs` — runs the built server locally, loading `.env`.    |
| `npm run check`             | `astro check` + `tsc --noEmit`. Run before claiming success.                                                 |
| `npm run lint`              | ESLint (flat config in `eslint.config.js`).                                                                  |
| `npm run format`            | Prettier write. `format:check` for read-only.                                                                |
| `npm test`                  | Vitest unit tests (cache layer, single-flight, auth, null normalization).                                    |
| `npm run test:e2e`          | Playwright against mock backend (ok mode). Auto-starts mock + SSR server via `webServer`.                    |
| `npm run test:e2e:degraded` | Playwright with backend unreachable — asserts 503 for home and the legal pages, degraded `/health`.          |
| `npm run test:e2e:empty`    | Playwright with mock backend in empty-payload mode — asserts `<ErrorState>` for hours/pricing, disabled CTA. |
| `npm run test:lh`           | Lighthouse CI (perf ≥0.9, SEO ≥0.95, a11y warn ≥0.9).                                                        |

Run a single E2E spec: `npx playwright test --config tests/e2e/playwright.config.ts tests/e2e/seo.spec.ts`. Add `--ui`
for the UI mode.

## Architecture: how a page renders

1. **`site.config.ts`** — committed, per-deploy identity: `siteSlug`, brand (colors, logo/favicon/og URLs), `analytics`,
   `features`, `fetch`. This is the **white-label switchboard**. It does NOT contain per-environment URLs
   (`API_BASE_URL`, `PUBLIC_SITE_URL`) — those live in env, with demo fallbacks inlined in `src/lib/config.ts`.
2. **`src/lib/config.ts`** — merges `site.config.ts` with runtime env overrides (env wins). Reads `API_BASE_URL`,
   `FACILITY_SLUG`, `API_AUTH_TOKEN`, `PUBLIC_SITE_URL`, `PUBLIC_GA4_MEASUREMENT_ID`, `CACHE_TTL_SECONDS`. Composes
   `apiBaseUrl = ${API_BASE_URL}/${FACILITY_SLUG}` so the wrappers in `api.ts` just append `/site`, `/site/pricing`, etc.
   Also exposes `apiRoot` (without slug) and `facilitySlug` separately. Prefers `process.env.*` over `import.meta.env.*`
   for server-only vars so the Node process can override build-time inlined values. Also reads `DEMO_MODE` and exposes
   `config.demoMode`. **Always import `@/lib/config` from runtime code, not `@config` directly**.
3. **`src/lib/api.ts`** — the only network layer. `fetchJson(path, normalize?)` implements:
   - **Demo short-circuit**: when `config.demoMode` is on, returns `normalize(DEMO_DATA[path])` from
     `src/lib/demo-data.ts` and skips network + cache entirely. With it off, behavior is unchanged.
   - **In-process cache** keyed by absolute URL. Returns the cached value (even if `null`) until the TTL expires.
   - **Single-flight / request coalescing**: concurrent requests for an expired key attach to the same in-flight
     `Promise` rather than firing redundant fetches.
   - **Bearer auth**: every call includes `Authorization: Bearer ${config.apiAuthToken}` (except `/up`, which is called
     without auth by the health endpoint).
   - **`T | null` returns, never throws**: network errors, non-2xx responses, timeouts, and "empty in a meaningful way"
     payloads all cache and return `null`. Callers never see exceptions.
   - Exported wrappers: `api.site()`, `api.openingHours()`, `api.pricing()`.
4. **`src/lib/dto.ts`** — the public API contract. TypeScript types with JSDoc for every field, plus the canonical
   endpoint map (`/site`, `/site/opening-hours`, `/site/pricing`). Legal docs are local (`src/content/legal/`), not
   backend-served. **Intentional contract**: any drift between the backend's responses and these types is a type error
   here. When the contract changes, update this file first, then propagate to the affected components.
5. **`src/lib/copy.ts`** — centralizes all user-visible fallback strings (`FALLBACK_COPY.service`, `.hours`,
   `.pricing`, `.cta.*`). Edit here to change what visitors see when data is unavailable.
6. **`src/pages/*.astro`** — top-level route, runs API calls in frontmatter (often with `Promise.all`), passes typed
   payloads into components, wraps everything in `PublicLayout`. Pattern:
   - `const [site, hours, pricing] = await Promise.all([api.site(), api.openingHours(), api.pricing()]);`
   - If `site === null`: set `Astro.response.status = 503` + `Retry-After: 60`, return `<ServiceUnavailable />`.
   - Otherwise: render `<PublicLayout site={site}>...</PublicLayout>` with the remaining nullable payloads passed to
     the relevant components.
7. **`src/layouts/PublicLayout.astro`** — requires `site: SitePayload` as a prop (does not fetch it itself).
   Renders `<head>` (canonical, OG, JSON-LD, GA4 consent-mode v2 bootstrap, Bunny Fonts, Font Awesome CDN) +
   `<Header>` / `<Footer>` / `<CookieBanner>`. Every page goes through this layout.
8. **`src/layouts/LegalDocument.astro`** — renders a `legal` content-collection entry (`src/content/legal/*.md`) via
   Astro's native `<Content />`. Used by `policy.astro` and `cookie.astro`, which load the entry with
   `getEntry('legal', …)` and still fetch `site` from the backend for the layout (so they 503 when `/site` is null).
9. **`src/components/ServiceUnavailable.astro`** — standalone minimal page (no dependency on `SitePayload`). Rendered
   when `site === null`. Includes `<meta name="robots" content="noindex,nofollow">` and no GA4 script.
10. **`src/components/CtaButton.astro`** — wrapper for `SitePayload.links.*`. If `link` is present renders an `<a>`;
    if `link === null` and `hideWhenMissing` is set renders nothing; otherwise renders a disabled `<button>` with the
    `fallbackLabel` and disabled styling. Use this everywhere instead of raw `{link && <a>}` patterns.
11. **`src/pages/health.ts`** — `GET /health`. Always responds 200 with
    `{ status, backend_reachable, backend_up, demo, timestamp }` and `Cache-Control: no-store`. Use for
    process-manager healthchecks and smoke tests. `backend_up` probes `${API_BASE_URL host root}/up` without auth (2 s
    timeout, no cache). `backend_reachable` is `true` if `api.site()` returns non-null. `status` is `'ok'` when both
    are true, `'degraded'` otherwise. **In demo mode** (`config.demoMode`) the `/up` probe is skipped and the endpoint
    returns `{ status: 'ok', backend_reachable: true, backend_up: true, demo: true }` — there is no external backend to
    probe.
12. **`src/pages/404.astro`** — generic Not Found page using `<ErrorState>`. Does not depend on `SitePayload`.
13. **`src/components/ErrorState.astro`** — reusable centered error block (badge + title + description + CTA). Use for
    non-critical inline "non disponibile" states (hours, pricing).

## Conventions & gotchas

- **CTAs to external apps** (booking, login, register, hotel) come from `SitePayload.links` (`site.links.booking`/
  `login`/`register`/`hotel`), each shaped as `{ label, url } | null`. Always render with
  `<CtaButton link={...} fallbackLabel={...} />` — never with a raw `<a>` or a hardcoded URL. If `link` is `null`,
  `CtaButton` shows a disabled button (or hides, for `hotel`). There is an E2E test (`tests/e2e/cta.spec.ts`) that
  fails if any login/prenota link resolves to `http://localhost:4321/...` — i.e. if a relative href was used by
  mistake.
- **Navigation is hardcoded.** Header/footer entries live in `src/lib/navigation.ts`, not the API. To white-label menus
  per client, fork and edit; don't try to expose them through the backend.
- **Tailwind 4 CSS-first**: tokens are declared in `src/styles/tokens.css` using `@theme { --... }`. No
  `tailwind.config.ts`. Add design tokens there, not in JS.
- **Path aliases** (`tsconfig.json`): `@/*` → `src/*`, `@config` → `./site.config.ts`. Prefer `@/lib/config` over
  `@config` in non-config code so env overrides apply.
- **Cookie consent**: `PublicLayout.astro` injects GA4 with `gtag('consent', 'default', ...)` set to
  `analytics.consentDefault` (default `denied`). `CookieBanner.astro` persists the user's choice in `localStorage`
  under `cookie_consent` with a 6-month TTL (Garante 10/06/2021) and calls `gtag('consent', 'update', ...)`. There is
  no "edit preferences" affordance — the banner reappears only when the TTL expires.
- **Trailing slashes**: `astro.config.mjs` sets `trailingSlash: 'never'`. Keep internal hrefs without trailing slashes
  to avoid canonical churn.
- **Sitemap**: `@astrojs/sitemap` filters out routes containing `/_`. `robots.txt` is generated by `astro-robots-txt`
  and points at `sitemap-index.xml`. Note: the health endpoint lives at `/health` (not `/_health`) so it appears in the
  route table but is excluded from the sitemap via its own `<meta name="robots">` / response headers.
- **E2E body selector**: legal pages use `.prose`. When adding new legal-style pages, keep that class so the legal spec
  matcher continues to work.
- **Caching `null`**: the cache layer stores `null` results with the same TTL as successful payloads. This prevents a
  backend outage from causing every pageview to attempt a full retry sequence (which would add seconds of latency per
  request). To force a cache flush restart the Node process.
- **`API_AUTH_TOKEN` is server-only**: it has no `PUBLIC_` prefix, so Astro never bundles it into the client. Never
  log its value — `src/lib/api.ts` logs only the URL and status code on errors.

## White-labeling a new deploy

1. Fork or branch the repo.
2. Edit `site.config.ts` (branding and per-deploy identity only):
   - `siteSlug` — must match `SitePayload.slug` returned by `GET /site` on the target backend.
   - `brand.primaryColor`, `brand.accentColor`, `brand.logoUrl`, `brand.faviconUrl`, `brand.ogImageUrl` — logo,
     favicon and OG image are absolute URLs to hosted assets, not local files.
3. Set env vars in the deploy environment:

   | Var                         | Required in prod? | Default                               | Use                                                                       |
   | --------------------------- | ----------------- | ------------------------------------- | ------------------------------------------------------------------------- |
   | `DEMO_MODE`                 | no                | `false`                               | `true` serves bundled data from `src/lib/demo-data.ts`; no backend needed |
   | `API_BASE_URL`              | yes               | `http://127.0.0.1:8000/api/public/v1` | Backend root. Full URL = `${API_BASE_URL}/${FACILITY_SLUG}/<endpoint>`    |
   | `FACILITY_SLUG`             | yes               | `demo`                                | Slug of the facility this deploy serves. Inserted right after `/v1/`.     |
   | `API_AUTH_TOKEN`            | yes               | —                                     | Bearer token on every backend call (not `/up`)                            |
   | `PUBLIC_SITE_URL`           | yes               | `http://localhost:4321`               | Canonical URL, sitemap, OG tags                                           |
   | `CACHE_TTL_SECONDS`         | no                | `300`                                 | In-process cache TTL in seconds                                           |
   | `PUBLIC_GA4_MEASUREMENT_ID` | no                | —                                     | GA4 measurement ID (omit to disable GA4)                                  |
   | `PORT` / `HOST`             | no                | Astro Node defaults                   | Server bind address and port                                              |

4. Build and start:
   ```bash
   npm ci && npm run build
   node ./dist/server/entry.mjs
   ```
   Run under PM2 or systemd for automatic restarts. Put Nginx or Caddy in front for TLS, gzip, and to serve
   `dist/client/` directly (bypassing Node for static assets).
5. Smoke-test: `curl https://<sito>/health` should return `{"status":"ok","backend_reachable":true,"backend_up":true,...}`.
