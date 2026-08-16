# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An **Astro 7 SSR site template** (one site per deploy) with a strict three-way split of ownership. Know which side a
change belongs on before making it:

| Owner                          | Holds                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Backend** (external service) | Live data only: identity, contacts, GDPR entities, opening hours, pricing, CTA links                                      |
| **`site.config.ts`**           | Per-deploy identity: asset URLs, analytics, fetch, data source, formatting, locale fallback (no colours)                  |
| **`presets/<tema>/`**          | The vertical: `content.ts` (structure+copy), `theme.css` (palette), `demo-data.ts`, assets under `public/presets/<tema>/` |
| **`site.content.ts`**          | The DEPLOY file: imports the chosen preset's content and applies per-section overrides                                    |

Nothing under `src/` carries business copy. If you find yourself typing a user-visible sentence into a component,
it belongs in `site.content.ts` (page copy) or `src/lib/copy.ts` (degraded-state copy) instead.

Live data has a **per-deploy source**: with `dataSource: 'backend'` (site.config.ts) identity/hours/pricing are
fetched at request time from a read-only HTTP backend implementing [`src/lib/dto.ts`](src/lib/dto.ts) (rooted at
`API_BASE_URL`, Bearer token from `API_AUTH_TOKEN`, cached in-process with TTL `CACHE_TTL_SECONDS`); with
`'static'` they come from the committed `STATIC_DATA` exported by `site.content.ts` — no network, no cache, no 503
path, the site is fully self-contained. The `hours`/`pricing` sections can override the deploy default individually
via `data.source`. `DEMO_MODE=true` forces static serving everywhere (even over an explicit per-section
`'backend'`), using whatever `STATIC_DATA` holds — by default the active preset's demo payloads.

**The DTO keeps a pool-shaped corner**, now softened for other verticals: `season` is nullable and never fails the
page (a missing season only hides the season cards), `allows_umbrella_booking` is optional (the fine-print renders
only on an explicit `false`), and `entrance_sections`/`pass_sections` remain admission-shaped — non-pool verticals
use the `menu` section instead of pricing.

Stack: Astro 7 (SSR, Node standalone) + Tailwind 4 (CSS-first `@theme` in `src/styles/tokens.css`) + TypeScript 6.
Vitest for unit tests, Playwright for E2E, Lighthouse config (`lighthouserc.json`) for manual audits. Node **22+**.

## Commands

| Command                     | Purpose                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`               | Dev server on `:4321` (HMR). Same in-process cache as prod; shows inline "non disponibile" if backend down.            |
| `npm run build`             | SSR build into `dist/`. Entry point: `dist/server/entry.mjs`.                                                          |
| `npm run preview`           | `node --env-file-if-exists=.env ./dist/server/entry.mjs` — runs the built server locally, loading `.env`.              |
| `npm run check`             | `astro check` + `tsc --noEmit`. Run before claiming success.                                                           |
| `npm run lint`              | ESLint (flat config in `eslint.config.js`).                                                                            |
| `npm run format`            | Prettier write. `format:check` for read-only — **CI gates on it**, so run it before pushing.                           |
| `npm test`                  | Vitest unit tests (api cache/auth, sections, pricing, format, structured data).                                        |
| `npm run test:e2e`          | Playwright against mock backend (ok mode). Auto-starts mock + SSR server via `webServer`.                              |
| `npm run test:e2e:degraded` | Playwright with backend unreachable — asserts 503 for home and the legal pages, degraded `/health`.                    |
| `npm run test:e2e:empty`    | Playwright with mock backend in empty-payload mode — asserts `<ErrorState>` for hours/pricing, `<html lang>` fallback. |
| `npm run test:lh`           | Lighthouse CI (perf ≥0.9, SEO ≥0.95, a11y warn ≥0.9). Manual, not a CI gate.                                           |
| `npm run screenshots`       | Rebuilds `.github/screenshots/` (README images) from the `/demo/<preset>` routes. Manual.                              |

Run a single E2E spec: `npx playwright test --config tests/e2e/playwright.config.ts tests/e2e/homepage.spec.ts`. Add
`--ui` for UI mode. Specs: `cookie`, `cta`, `degraded`, `empty`, `homepage`, `legal`, `public`. **The homepage and
empty specs derive their expectations from the committed `site.content.ts`** (anchor ids, section presence, fallback
copy from `FALLBACK_COPY`): re-theming the deploy — the product's founding operation — skips what no longer exists
instead of failing. Never hardcode deploy copy or anchors in a spec.

CI (`.github/workflows/ci.yml`) runs `quality` (check → lint → **format:check** → unit) and `e2e` (all three suites).

## Architecture: how a page renders

1. **`site.config.ts`** — per-deploy identity: `dataSource` (`'backend' | 'static'`, the deploy-level data source),
   `brand`, `analytics`, `fetch` timeouts/retries, `defaultLocale`
   (fallback only — the backend's `default_locale` drives `<html lang>`). Which facility a deploy serves is the
   `FACILITY_SLUG` env var alone; `normalizeSite` warns if `SitePayload.slug` disagrees with it. Does NOT
   hold per-environment URLs (`API_BASE_URL`, `PUBLIC_SITE_URL`) — those live in env, with demo fallbacks inlined in
   `src/lib/config.ts`.
2. **`src/lib/sections.ts` + `presets/` + `site.content.ts`** — the homepage itself. `sections.ts` has the types
   and four helpers; a preset (`presets/<tema>/content.ts`) is the structure; `site.content.ts` is the deploy file
   that imports it and applies overrides (explicit per-section replacement, no deep-merge). Committed files only —
   no runtime content source, no runtime validation: a malformed structure is a compile error. **Preset selection is
   TWO imports that must agree**: the content import in `site.content.ts` and the theme `@import` in
   `src/styles/tokens.css`. There is deliberately no `preset` field in `site.config.ts` — it would be a third
   declaration free to lie about the two that actually bind. See "Sections" below.
3. **`src/lib/config.ts`** — merges `site.config.ts` with runtime env overrides (env wins). Reads `API_BASE_URL`,
   `FACILITY_SLUG`, `API_AUTH_TOKEN`, `PUBLIC_SITE_URL`, `PUBLIC_GA4_MEASUREMENT_ID`, `CACHE_TTL_SECONDS`, `DEMO_MODE`.
   Composes `apiBaseUrl = ${API_BASE_URL}/${FACILITY_SLUG}` so the wrappers in `api.ts` just append `/site` etc.
   Prefers `process.env.*` over `import.meta.env.*` for every var (PUBLIC_ ones included) so the Node process can
   override build-time inlined values. **Always import `@/lib/config` from runtime code, not `@config` directly.**
4. **`src/lib/api.ts`** — the only network layer. `fetchJson(path, normalize?, source?)` implements:

- **Static serving**: when the resolved source is `'static'` (deploy default, per-section override, or DEMO_MODE
  which force-overrides everything), returns `normalize(STATIC_DATA[path])`, skipping network + cache.
- **In-process cache** keyed by absolute URL. Returns the cached value (even if `null`) until the TTL expires.
- **Single-flight**: concurrent requests for an expired key attach to the same in-flight `Promise`.
- **Bearer auth** on every call when `API_AUTH_TOKEN` is non-empty, except `/up` (called without auth by the
  health endpoint).
- **`T | null`, never throws**: network errors, non-2xx, timeouts and "empty in a meaningful way" payloads all cache
  and return `null`. Callers never see exceptions.
- Wrappers: `api.site()` (always deploy-level source — identity has no owning section), `api.openingHours(source?)`
  and `api.pricing(source?)` (per-section override), each with its own `normalize*` guard. The slug-integrity
  warning fires only when the deploy-level source is `'backend'`.

5. **`src/lib/dto.ts`** — the API contract: types with JSDoc per field, plus the canonical endpoint map (`/site`,
   `/site/opening-hours`, `/site/pricing`). **Intentional contract**: live responses are cast to these types (no runtime
   validation), the committed fixtures are type-checked against them. Change this file first, then propagate. [`BACKEND_CONTRACT.md`](BACKEND_CONTRACT.md)
   is the human-readable mirror — keep the two in sync.
6. **`src/lib/copy.ts`** — degraded-state strings only (`FALLBACK_COPY.service`, `.hours`, `.pricing`, `.cta.*`). Page
   copy lives in `site.content.ts`.
7. **`src/lib/format.ts`** — `formatSeasonDate` (explicit `T00:00:00` to avoid UTC day-shift), `whatsappUrl` (gates on
   the digit-stripped result), **`safeHref` — the security gate**: every href built from backend data goes through it
   and anything outside `http/https/mailto/tel` becomes `null`; and `toAbsoluteUrl` for the two places that need an
   absolute URL by spec (og:image, schema.org logo).
8. **`src/lib/pricing.ts`** — `visiblePricingSections`, `formatPrice` (`isFree` wins over a `null` value), `countRows`.
9. **`src/pages/index.astro`** — awaits `/site` **first and alone**; hours+pricing only fire if it succeeded _and_ an
   enabled section consumes them. If `site === null`: status 503 + `Retry-After: 60` + `<ServiceUnavailable />`.
   Otherwise it hands content + payloads to **`src/components/LandingPage.astro`**, which walks the enabled sections
   and mounts one component each (no network in there). **`src/pages/demo/[preset].astro`** reuses it as the preset
   showcase: DEMO_MODE only (404 otherwise), one route per `presets/*`, fed by the preset's `DEMO_DATA`, menu anchored
   to its own path via `primaryNav(sections, basePath)`, palette re-valued at request time by inlining the preset's
   `theme.css` as `html:root` (`PublicLayout` `extraCss`), `noindex`.
10. **`src/layouts/PublicLayout.astro`** — requires `site: SitePayload` (does not fetch anything). Renders `<head>`
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
data_source, timestamp }` and `Cache-Control: no-store`. `data_source` is `'backend' | 'static' | 'demo' |
'mixed'` and the verdict follows what the deploy ACTUALLY depends on: fully static (or demo) short-circuits to
    `ok` with no probe; a backend deploy — or a static one where any enabled section overrides to `'backend'`
    (`'mixed'`) — probes `${API_BASE_URL host root}/up` (2 s, no auth, no cache) and checks `api.site()`, reporting
    `degraded` when either fails. Unit-covered in `src/pages/health.test.ts`; the backend branch also by
    `degraded.spec.ts`.
14. **`src/pages/404.astro`** — awaits `/site` (needed by `PublicLayout`) and renders `<ErrorState>`, or
    `<ServiceUnavailable />` when `/site` is null. It never sets a status itself;
    the Node adapter maps it to 404, pinned by `tests/e2e/public.spec.ts`.
15. **`src/middleware.ts`** — security headers on every HTML response: CSP (GA4 inline bootstrap +
    `googletagmanager.com`, Bunny Fonts, `img-src 'self' data:`), `X-Content-Type-Options`, `Referrer-Policy`,
    `X-Frame-Options`. Non-HTML responses (e.g. `/health`) untouched. HSTS/TLS stay at the reverse proxy.

## Sections: how the homepage is assembled

The structure is a `SiteContent`: `meta` plus an ordered array of sections (`EnabledSection` requires `data`;
`DisabledSection` is just `{ type, enabled: false }`), defined by the preset + deploy overrides and type-checked at
build. `LandingPage.astro` walks the enabled sections and switches on `type`.
The component catalog:

| `type`         | Component              | Backend data                                   |
| -------------- | ---------------------- | ---------------------------------------------- |
| `hero`         | `Hero.astro`           | `links.booking` (CTA); no anchor, no nav entry |
| `features`     | `FeatureGrid.astro`    | —                                              |
| `hours`        | `OpeningHours.astro`   | `/site/opening-hours`                          |
| `pricing`      | `PricingTables.astro`  | `/site/pricing`                                |
| `services`     | `ServiceList.astro`    | —                                              |
| `rules`        | `RuleGroups.astro`     | `links.booking`, `contacts.whatsapp` (CTAs)    |
| `highlight`    | `HighlightPanel.astro` | `links.booking` (CTA)                          |
| `menu`         | `MenuCourses.astro`    | — (prices are free-form strings, author-owned) |
| `gallery`      | `GalleryGrid.astro`    | — (text optional: photo-driven by design)      |
| `faq`          | `Faq.astro`            | — (native `<details>`, no script)              |
| `testimonials` | `Testimonials.astro`   | — (copy-only quotes, never schema.org Review)  |
| `location`     | `Location.astro`       | `site.address` (Maps link + postal address)    |
| `story`        | `Story.astro`          | —                                              |
| `rooms`        | `RoomsGrid.astro`      | `links.booking` (per-room CTA)                 |

Four helpers in `src/lib/sections.ts`, all unit-tested:

- `enabledSections()` — filters, preserving declaration order.
- `primaryNav()` — **derives** the header/mobile menu; `src/lib/navigation.ts` exports the module-scope
  `PRIMARY_NAV` built from it, so a disabled section cannot leave a menu entry pointing at a missing anchor.
- `resolveFallbackCta()` — drops a cross-section link (the "vai ai prezzi" on the hours error state, and vice versa)
  when its target section is disabled. Always route such links through it; do not trust the config.
- `menuGroups()` — groups a menu's courses under their `tab` (first-seen order); an untabbed course falls into the
  first group rather than disappearing, and a menu with no tabs yields one untabbed group.

**Adding a section type** means: a `*Content` type + an `EnabledSection` union member in `sections.ts`, a component
taking `{ id, content }` (plus `site`/backend payloads if any), and a `case` in `LandingPage.astro`. The switch's `default`
returns `section satisfies never`, so a union member without a `case` is a hard build error naming the forgotten
type (mutation-checked). Disabling a section never needs a dummy `data`: `DisabledSection` only requires
`{ type, enabled: false }`. `enabledSections()` narrows to `EnabledSection`, so components always receive their
content.

## Conventions & gotchas

- **CTAs to external apps** come from `SitePayload.links` (`booking` / `login` / `manager` / `hotel`). Customer `login`
  renders in the header, back-office `manager` in the footer. Always `<CtaButton />` — never a raw `<a>` or a
  hardcoded URL. `tests/e2e/cta.spec.ts` fails if a login/prenota href resolves to `http://localhost:4321/...`.
  Those two buttons are per-deploy switchable via `site.config.ts headerLinks.{login,manager}`: `enabled: false`
  hides the button outright (not the disabled state), and a non-empty `label` overrides the backend's. The URL is
  always the backend's.
- **`menu` sections carry optional tabs and an external link**: courses declaring a `tab` group into a tablist
  (`menuGroups()`), each course renders as a `<details>` accordion, and `externalCta` adds a link to the full
  menu/PDF. The tablist ships `hidden` and a small inline script unhides it, so with JS off every panel stays
  visible — never gate content behind the tabs alone.
- **`gallery` uses `grid-flow-dense`** so a `wide` cell cannot leave a hole on the right of its row; photos have no
  reading order, so backfilling is free.
- **Theming goes through semantic tokens, never raw hues.** The scales (`brand-*`, `cta-*`, `accent-*`, plus
  `--hero-glow-a/b`) are VALUED by the active preset's `theme.css`, `@import`ed by `src/styles/tokens.css` inside
  the Tailwind graph — that placement is load-bearing: opacity-modified utilities inline the resolved colour at
  build, so the palette must be present at build time, and `tokens.css` itself holds NO colour tokens (single
  source). Components use only the semantic utilities; neutral `slate` and RuleGroups' `TONES` map are the
  sanctioned literals. All three invariants are enforced by `src/lib/theme-tokens.test.ts`, on every preset. There
  are NO colour fields in `site.config.ts`.
- **UI labels rendered around backend data live in the content, not in components**: `todayLabel`/`closedLabel`/
  `seasonLabels` on `HoursContent` (season cards render only when both the labels AND the payload dates exist),
  `icon`/`freeLabel` on `PricingContent`. Number/date formatting for backend values follows
  `site.config.ts formatting.{locale,currency}`; the count-up client script receives the locale via a data attribute
  because importing `@/lib/config` in a client script would leak server-only values into the browser bundle.
- **The hero photo comes from the content** (`HeroContent.image`, root-relative path under `public/`, optional —
  the gradient alone carries the hero without it). `public/` assets are served as-is: ship pre-sized files (~1920w).
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
  `/health` is an endpoint (`health.ts`), so it never enters the sitemap.
- **Legal pages** match on `article h1` + `article .prose` in E2E. `.prose` styling is hand-written in
  `LegalDocument.astro` because `@tailwindcss/typography` is not a dependency — no `prose-*` utility resolves.
- **Caching `null`**: `null` results cache with the same TTL as successes, so an outage doesn't make every pageview
  replay the retry sequence. To flush, restart the Node process.
- **`API_AUTH_TOKEN` is server-only**: no `PUBLIC_` prefix, so Astro never bundles it client-side. Never log its value.
- **`.idea/` and `docs/` are gitignored.** Don't track them.
- **README screenshots are generated, not hand-shot**: `scripts/screenshots.mjs` boots the SSR server in DEMO_MODE
  and shoots the `/demo/<preset>` routes into `.github/screenshots/` (JPEG — full-page PNGs are ~1.2 MB each). It
  throws on a missing anchor, so a renamed section id fails the run instead of silently leaving a stale image.
  Re-run `npm run screenshots` after any visual change and commit the result.

## Known issues

- **`extract-zip`** — 8 high advisories in `npm audit`, all from this one root, which has no fixed release at any
  version. Reaches the tree via `astro-icon` → `@iconify/tools` (build time) and `@lhci/cli` → puppeteer (dev only);
  neither runs in the SSR server. Accepted rather than downgrading `astro-icon` to 0.8.2 as `audit fix --force` wants.
- **TypeScript is pinned to 6.x** — `@astrojs/check@0.9.10`, the latest release, peers `typescript ^5 || ^6`, so TS 7
  fails resolution outright. Retry when upstream updates.
- **Placeholder assets and legal text** ship as placeholders by design; both need replacing per deploy (see README).

## White-labeling a new deploy

Full walkthrough in [`README.md`](README.md#white-labeling-di-un-deploy). In short: fork, then: pick the
preset (the two imports — content in `site.content.ts`, theme in `src/styles/tokens.css`), apply copy overrides in
`site.content.ts`, edit `site.config.ts` (identity/branding), replace `public/brand/` assets (the
`public/presets/<tema>/` ones are the preset's demo assets), rewrite `src/content/legal/`, and set the env vars:

| Var                         | Required in prod? | Default                               | Use                                                                    |
| --------------------------- | ----------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| `DEMO_MODE`                 | no                | `false`                               | `true` serves `STATIC_DATA` (the preset's `demo-data.ts`); no backend  |
| `API_BASE_URL`              | backend/mixed     | `http://127.0.0.1:8000/api/public/v1` | Backend root. Full URL = `${API_BASE_URL}/${FACILITY_SLUG}/<endpoint>` |
| `FACILITY_SLUG`             | backend/mixed     | `demo`                                | Slug of the facility this deploy serves. Inserted right after `/v1/`.  |
| `API_AUTH_TOKEN`            | backend/mixed     | —                                     | Bearer token on every backend call (not `/up`); empty = no header      |
| `PUBLIC_SITE_URL`           | yes               | `http://localhost:4321`               | Canonical URL, sitemap, OG tags                                        |
| `CACHE_TTL_SECONDS`         | no                | `300`                                 | In-process cache TTL in seconds                                        |
| `PUBLIC_GA4_MEASUREMENT_ID` | no                | —                                     | GA4 measurement ID (omit to disable GA4)                               |
| `PORT` / `HOST`             | no                | Astro Node defaults                   | Server bind address and port                                           |

Then:

```bash
npm ci && npm run build
node ./dist/server/entry.mjs
```

Run under PM2 or systemd for restarts; put Nginx or Caddy in front for TLS, gzip, and to serve `dist/client/` directly.
Smoke-test: `curl https://<sito>/health` → `{"status":"ok","backend_reachable":true,"backend_up":true,...}`.
