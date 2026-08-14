# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An **Astro 7 SSR site template** (one site per deploy) with a strict three-way split of ownership. Know which side a
change belongs on before making it:

| Owner                          | Holds                                                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Backend** (external service) | Live data (identity, contacts, GDPR entities, opening hours, pricing, CTA links) **and, optionally, the whole page structure** via `GET /site/content` |
| **`site.config.ts`**           | Per-deploy identity: brand colours and asset URLs, analytics, fetch, locale fallback                                                                   |
| **`site.content.ts`**          | The committed page structure — sections, order, copy. The **default** when the backend does not serve `/site/content`, and the demo-mode content       |

Nothing under `src/` carries business copy. If you find yourself typing a user-visible sentence into a component,
it belongs in `site.content.ts` (page copy) or `src/lib/copy.ts` (degraded-state copy) instead.

Dynamic content is fetched **at request time** from a read-only HTTP backend implementing
[`src/lib/dto.ts`](src/lib/dto.ts), rooted at `API_BASE_URL`, with a Bearer token from `API_AUTH_TOKEN`. The backend is
fully external; the template hosts no part of it. Results are cached in-process (default TTL 300 s, `CACHE_TTL_SECONDS`).

For local exploration without a backend, set `DEMO_MODE=true`: `src/lib/api.ts` serves bundled fixtures from
`src/lib/demo-data.ts` (no network, no cache).

**The DTO is still domain-shaped**, and that is the one place the pool origin still shows: `season`,
`entrance_sections`/`pass_sections`, `allows_umbrella_booking`. A deploy for a
different kind of venue reuses the shapes or extends the contract; it cannot ignore them.

Stack: Astro 7 (SSR, Node standalone) + Tailwind 4 (CSS-first `@theme` in `src/styles/tokens.css`) + TypeScript 5.
Vitest for unit tests, Playwright for E2E, Lighthouse config (`lighthouserc.json`) for manual audits. Node **22+**.

## Commands

| Command                     | Purpose                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm run dev`               | Dev server on `:4321` (HMR). Calls backend on every request; shows inline "non disponibile" if down.         |
| `npm run build`             | SSR build into `dist/`. Entry point: `dist/server/entry.mjs`.                                                |
| `npm run preview`           | `node --env-file-if-exists=.env ./dist/server/entry.mjs` — runs the built server locally, loading `.env`.    |
| `npm run check`             | `astro check` + `tsc --noEmit`. Run before claiming success.                                                 |
| `npm run lint`              | ESLint (flat config in `eslint.config.js`).                                                                  |
| `npm run format`            | Prettier write. `format:check` for read-only — **CI gates on it**, so run it before pushing.                 |
| `npm test`                  | Vitest unit tests (api cache/auth, sections, pricing, format, structured data).                              |
| `npm run test:e2e`          | Playwright against mock backend (ok mode). Auto-starts mock + SSR server via `webServer`.                    |
| `npm run test:e2e:degraded` | Playwright with backend unreachable — asserts 503 for home and the legal pages, degraded `/health`.          |
| `npm run test:e2e:empty`    | Playwright with mock backend in empty-payload mode — asserts `<ErrorState>` for hours/pricing, disabled CTA. |
| `npm run test:lh`           | Lighthouse CI (perf ≥0.9, SEO ≥0.95, a11y warn ≥0.9). Manual, not a CI gate.                                 |

Run a single E2E spec: `npx playwright test --config tests/e2e/playwright.config.ts tests/e2e/homepage.spec.ts`. Add
`--ui` for UI mode. Specs: `content` (backend-driven structure, ok mode only), `cookie`, `cta`, `degraded`, `empty`
(includes the /site/content-missing fallback), `homepage`, `legal`, `public`.

CI (`.github/workflows/ci.yml`) runs `quality` (check → lint → **format:check** → unit) and `e2e` (all three suites).

## Architecture: how a page renders

1. **`site.config.ts`** — per-deploy identity: `brand`, `analytics`, `fetch` timeouts/retries, `defaultLocale`
   (fallback only — the backend's `default_locale` drives `<html lang>`). Which facility a deploy serves is the
   `FACILITY_SLUG` env var alone; `normalizeSite` warns if `SitePayload.slug` disagrees with it. Does NOT
   hold per-environment URLs (`API_BASE_URL`, `PUBLIC_SITE_URL`) — those live in env, with demo fallbacks inlined in
   `src/lib/config.ts`.
2. **`src/lib/sections.ts` + `src/lib/content.ts` + `site.content.ts`** — the homepage itself. `sections.ts` has the
   types, the runtime normalizer and three helpers; `content.ts` exposes `resolveSiteContent()` (backend
   `/site/content` first, committed `site.content.ts` as fallback); `site.content.ts` is the committed default. See
   "Sections" below.
3. **`src/lib/config.ts`** — merges `site.config.ts` with runtime env overrides (env wins). Reads `API_BASE_URL`,
   `FACILITY_SLUG`, `API_AUTH_TOKEN`, `PUBLIC_SITE_URL`, `PUBLIC_GA4_MEASUREMENT_ID`, `CACHE_TTL_SECONDS`, `DEMO_MODE`.
   Composes `apiBaseUrl = ${API_BASE_URL}/${FACILITY_SLUG}` so the wrappers in `api.ts` just append `/site` etc.
   Prefers `process.env.*` over `import.meta.env.*` for server-only vars so the Node process can override build-time
   inlined values. **Always import `@/lib/config` from runtime code, not `@config` directly.**
4. **`src/lib/api.ts`** — the only network layer. `fetchJson(path, normalize?)` implements:

- **Demo short-circuit**: when `config.demoMode` is on, returns `normalize(DEMO_DATA[path])`, skipping network + cache.
- **In-process cache** keyed by absolute URL. Returns the cached value (even if `null`) until the TTL expires.
- **Single-flight**: concurrent requests for an expired key attach to the same in-flight `Promise`.
- **Bearer auth** on every call except `/up` (called without auth by the health endpoint).
- **`T | null`, never throws**: network errors, non-2xx, timeouts and "empty in a meaningful way" payloads all cache
  and return `null`. Callers never see exceptions.
- Wrappers: `api.site()`, `api.openingHours()`, `api.pricing()`, `api.content()`, each with its own `normalize*`
  guard. `/site/content` is the only _optional_ endpoint: `null` there means "use the committed default", never an
  error state.

5. **`src/lib/dto.ts`** — the API contract: types with JSDoc per field, plus the canonical endpoint map (`/site`,
   `/site/opening-hours`, `/site/pricing`, optional `/site/content` whose shape lives in `sections.ts`). **Intentional contract**: any drift between backend responses and these
   types is a type error here. Change this file first, then propagate. [`BACKEND_CONTRACT.md`](BACKEND_CONTRACT.md) is
   the human-readable mirror — keep the two in sync.
6. **`src/lib/copy.ts`** — degraded-state strings only (`FALLBACK_COPY.service`, `.hours`, `.pricing`, `.cta.*`). Page
   copy lives in `site.content.ts`.
7. **`src/lib/format.ts`** — `formatSeasonDate` (explicit `T00:00:00` to avoid UTC day-shift), `whatsappUrl` (gates on
   the digit-stripped result), **`safeHref` — the security gate**: every href built from backend data goes through it
   and anything outside `http/https/mailto/tel` becomes `null`; and `toAbsoluteUrl` for the two places that need an
   absolute URL by spec (og:image, schema.org logo).
8. **`src/lib/pricing.ts`** — `visiblePricingSections`, `formatPrice` (`isFree` wins over a `null` value), `countRows`.
9. **`src/pages/index.astro`** — awaits `/site` **first and alone**; hours+pricing only fire if it succeeded _and_ an
   enabled section consumes them. If `site === null`: status 503 + `Retry-After: 60` + `<ServiceUnavailable />`.
   Otherwise it walks the enabled sections and mounts one component each.
10. **`src/layouts/PublicLayout.astro`** — requires `site: SitePayload` (does not fetch it), but DOES resolve the
    site content itself to derive the menu (`primaryNav`) for Header/Footer — the cache + single-flight make that free
    on pages that already resolved it. Renders `<head>`
    (canonical, OG/Twitter, `LocalBusiness` JSON-LD with `<` escaped against script breakout, GA4 consent-mode v2
    bootstrap, Bunny Fonts + preloaded 700 weight, optional `noindex`) + skip-link + `<Header>` / `<Footer>` /
    `<CookieBanner>`. Icons are inline SVG via `astro-icon`, no CDN.
11. **`src/content.config.ts` + `src/layouts/LegalDocument.astro`** — a `legal` collection (`src/content/legal/*.md`,
    frontmatter `title` / `version` / optional `effective_date`) rendered via `<Content />`. The layout also renders a
    **data-controller block from `site.gdpr` + `site.address`** above the prose, so the Markdown never hardcodes
    controller identity and rows with null values are dropped.
12. **`src/components/CtaButton.astro`** — the only correct way to render `SitePayload.links.*`. Renders an `<a>` when
    the link exists **and** `safeHref` accepts its URL; nothing if `link === null` and `hideWhenMissing`; otherwise a
    disabled `<button>`. An unsafe URL degrades to the disabled button, not a broken link.
13. **`src/pages/health.ts`** — `GET /health`, always 200 with `{ status, backend_reachable, backend_up, demo,
timestamp }` and `Cache-Control: no-store`. `backend_up` probes `${API_BASE_URL host root}/up` without auth (2 s,
    no cache); `backend_reachable` is `api.site() !== null`; `status` is `'ok'` only when both hold. **In demo mode**
    the probe is skipped and it reports everything healthy.
14. **`src/pages/404.astro`** — uses `<ErrorState>`, does not depend on `SitePayload`. It never sets a status itself;
    the Node adapter maps it to 404, pinned by `tests/e2e/public.spec.ts`.
15. **`src/middleware.ts`** — security headers on every HTML response: CSP (GA4 inline bootstrap +
    `googletagmanager.com`, Bunny Fonts, `img-src 'self' data:`), `X-Content-Type-Options`, `Referrer-Policy`,
    `X-Frame-Options`. Non-HTML responses (e.g. `/health`) untouched. HSTS/TLS stay at the reverse proxy.

## Sections: how the homepage is assembled

The structure is a `SiteContent`: `meta` plus an ordered array of `{ type, id, navLabel, enabled, data }`.
`resolveSiteContent()` picks the source — the backend's `GET /site/content` when it returns a payload that survives
`normalizeSiteContent` (shallow skeleton check: known `type`, boolean `enabled`, object `data`, string `id` on
anchored sections; unknown types dropped, unusable payloads rejected wholesale), the committed `site.content.ts`
otherwise. `index.astro` walks the enabled sections and switches on `type`. The component catalog:

| `type`      | Component              | Backend data                |
| ----------- | ---------------------- | --------------------------- |
| `hero`      | `Hero.astro`           | — (no anchor, no nav entry) |
| `features`  | `FeatureGrid.astro`    | —                           |
| `hours`     | `OpeningHours.astro`   | `/site/opening-hours`       |
| `pricing`   | `PricingTables.astro`  | `/site/pricing`             |
| `services`  | `ServiceList.astro`    | —                           |
| `rules`     | `RuleGroups.astro`     | —                           |
| `highlight` | `HighlightPanel.astro` | —                           |

Three helpers in `src/lib/sections.ts`, all unit-tested:

- `enabledSections()` — filters, preserving declaration order.
- `primaryNav()` — **derives** the header/mobile menu from the _resolved_ content (PublicLayout passes it to
  Header/Footer as a `nav` prop), so a disabled section — whether disabled in the backend or in the file — cannot
  leave a menu entry pointing at a missing anchor. `src/lib/navigation.ts` only keeps `FOOTER_NAV` (legal routes).
- `resolveFallbackCta()` — drops a cross-section link (the "vai ai prezzi" on the hours error state, and vice versa)
  when its target section is disabled. Always route such links through it; do not trust the config.

**Adding a section type** means: a `*Content` type + a `Section` union member in `sections.ts`, a component taking
`{ id, content }` (plus backend payloads if any), and a `case` in `index.astro`. The switch is exhaustive, so a new
union member without a `case` is a type error.

## Conventions & gotchas

- **CTAs to external apps** come from `SitePayload.links` (`booking` / `login` / `manager` / `hotel`). Customer `login`
  renders in the header, back-office `manager` in the footer. Always `<CtaButton />` — never a raw `<a>` or a
  hardcoded URL. `tests/e2e/cta.spec.ts` fails if a login/prenota href resolves to `http://localhost:4321/...`.
- **`brand.*Url` accepts two forms**: an absolute URL to a hosted asset, or a root-relative path served from
  `public/`. Header/Footer/favicon use the raw value; og:image and the schema.org logo go through `toAbsoluteUrl`.
  Defaults are the local placeholders in `public/brand/`. Note `og.png` is a raster while the logo and favicon are
  SVG: social crawlers do not render SVG previews, so any replacement OG image must stay a PNG or JPG at 1200x630.
- **CSP `img-src` is `'self' data:`** — every shipped image is self-hosted. Widen it if a deploy points `brand.*Url`
  at an external CDN.
- **Tailwind 4 CSS-first**: tokens in `src/styles/tokens.css` via `@theme`. No `tailwind.config.ts`.
- **Path aliases** (`tsconfig.json`): `@/*` → `src/*`, `@config` → `./site.config.ts`, `@content` → `./site.content.ts`.
- **Cookie consent**: `PublicLayout` injects GA4 with `gtag('consent', 'default', ...)` from `analytics.consentDefault`
  (default `denied`). `CookieBanner.astro` persists the choice in `localStorage` under `cookie_consent` with a 6-month
  TTL (Garante 10/06/2021). A "Preferenze cookie" button in the footer (`[data-cookie-preferences]`) reopens the
  banner before the TTL expires; it ships `hidden` and the banner script unhides it, so it is never a dead control
  with JS off. Any new trigger just needs that data attribute.
- **Trailing slashes**: `trailingSlash: 'never'`. Keep internal hrefs bare.
- **Sitemap**: `@astrojs/sitemap` filters routes containing `/_`; `robots.txt` comes from `astro-robots-txt`.
  `/health` is excluded via its own response headers, not the filter.
- **Legal pages** match on `article h1` + `article .prose` in E2E. `.prose` styling is hand-written in
  `LegalDocument.astro` because `@tailwindcss/typography` is not a dependency — no `prose-*` utility resolves.
- **Caching `null`**: `null` results cache with the same TTL as successes, so an outage doesn't make every pageview
  replay the retry sequence. To flush, restart the Node process.
- **`API_AUTH_TOKEN` is server-only**: no `PUBLIC_` prefix, so Astro never bundles it client-side. Never log its value.
- **`.idea/` and `docs/` are gitignored.** Don't track them.

## Known issues

- **`extract-zip`** — 8 high advisories in `npm audit`, all from this one root, which has no fixed release at any
  version. Reaches the tree via `astro-icon` → `@iconify/tools` (build time) and `@lhci/cli` → puppeteer (dev only);
  neither runs in the SSR server. Accepted rather than downgrading `astro-icon` to 0.8.2 as `audit fix --force` wants.
- **TypeScript is pinned to 6.x** — `@astrojs/check@0.9.10`, the latest release, peers `typescript ^5 || ^6`, so TS 7
  fails resolution outright. Retry when upstream updates.
- **Placeholder assets and legal text** ship as placeholders by design; both need replacing per deploy (see README).

## White-labeling a new deploy

Full walkthrough in [`README.md`](README.md#white-labeling-a-deploy). In short: fork, then edit `site.config.ts`
(identity/branding), `site.content.ts` (sections and copy), `public/brand/` + `public/placeholder/` (assets),
`src/content/legal/` (documents), and set the env vars:

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

Then:

```bash
npm ci && npm run build
node ./dist/server/entry.mjs
```

Run under PM2 or systemd for restarts; put Nginx or Caddy in front for TLS, gzip, and to serve `dist/client/` directly.
Smoke-test: `curl https://<sito>/health` → `{"status":"ok","backend_reachable":true,"backend_up":true,...}`.
