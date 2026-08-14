# Site Landing Template

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A **white-label Astro 7 SSR template** for a marketing/showcase website whose content is driven entirely by an
external HTTP backend. The template ships no business data of its own: site identity, opening hours, pricing, CTA
links are fetched **at request time** from a read-only backend that implements the contract in
[`src/lib/dto.ts`](src/lib/dto.ts) — see [`BACKEND_CONTRACT.md`](BACKEND_CONTRACT.md) for a human-readable reference of
every endpoint and field.

The template is **backend-agnostic** — any server returning the documented JSON shapes under the canonical paths can
drive it. Editorial copy is not in the components either: the homepage is assembled from
[`site.content.ts`](site.content.ts), an ordered list of sections you can reorder, disable or rewrite without touching
`src/`. The bundled example is a seasonal swimming-pool venue; re-theming it for another business means editing that
one file.

Two files own everything per-deploy: **`site.config.ts`** (identity and branding) and **`site.content.ts`** (which
sections exist and what they say). The backend owns the live data.

Want to see it running without writing a backend? Set `DEMO_MODE=true` and it serves bundled sample data. See
[Running the demo](#running-the-demo).

## What you get

- Astro 7 SSR (`output: 'server'`, `@astrojs/node` standalone) — builds to a Node server (`dist/server/entry.mjs`).
- In-process response cache (default TTL 300 s) with single-flight request coalescing.
- Bearer-authenticated backend calls that **never throw**: failures degrade to explicit "non disponibile" UI.
- Tailwind 4 (CSS-first `@theme`), TypeScript 5, GA4 consent-mode v2, sitemap + robots, and a Lighthouse config for
  manual perf/SEO/a11y audits.
- A typed demo dataset so a fresh clone renders a complete site with zero backend.

## Prerequisites

| Requirement  | Minimum                                                                        |
| ------------ | ------------------------------------------------------------------------------ |
| Node.js      | **22+** (see `engines.node` in `package.json`; a `.nvmrc` pins `22`)           |
| npm          | bundled with Node 22 (do not use pnpm/yarn — keep `package-lock.json` in sync) |
| Git          | to clone the repository                                                        |
| Backend HTTP | **not needed for the demo**; required only for real data                       |

## Running the demo

The demo renders the whole site from a bundled, type-checked dataset
([`src/lib/demo-data.ts`](src/lib/demo-data.ts)) plus the local legal documents in
[`src/content/legal/`](src/content/legal/) — **no backend, no API token, no database**. It's the fastest way to see
the template before wiring a real backend.

### Requirements

- **Node.js 22+** and **npm** (there's a `.nvmrc` pinning `22` — run `nvm use` if you use nvm).
- **Git** to clone the repository.
- Nothing else: the demo needs no backend, no `API_AUTH_TOKEN`, and no network access to any API.

### 1. Get the code

```bash
# "Use this template" on GitHub (or fork), then clone your copy:
git clone https://github.com/<you>/<your-repo>.git
cd <your-repo>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Enable demo mode

```bash
cp .env.example .env
```

`.env.example` already ships with `DEMO_MODE=true`, so copying it is enough — no editing required. Demo mode is what
makes the data layer serve bundled data instead of calling a backend.

### 4. Start the dev server

```bash
npm run dev
```

Open **[http://localhost:4321](http://localhost:4321)**. You should see a fully populated site:

- **Home** (`/`) — hero, opening hours, pricing tables and the other sections, all from the demo dataset.
- **Privacy & Cookie** (`/policy`, `/cookie`) — rendered from the placeholder Markdown in `src/content/legal/`.
- **Health** (`/health`) — returns `{"status":"ok","demo":true,...}`.

### Verify you're in demo mode

```bash
curl http://localhost:4321/health
# → {"status":"ok","backend_reachable":true,"backend_up":true,"demo":true,...}
```

`"demo":true` confirms the site is served entirely from bundled data. In this mode the pages render **even if no
backend exists or the configured API is unreachable** — the network is never touched.

### Run the demo as a production build (optional)

```bash
npm run build      # → dist/server/entry.mjs + dist/client/
npm run preview    # runs the built server, reads .env (DEMO_MODE=true) → http://localhost:4321
```

> `npm run preview` runs the built server and loads `.env` (via Node's `--env-file-if-exists`), so the demo works the
> same as `npm run dev`. The **bare** `node ./dist/server/entry.mjs` does **not** read `.env` — in real production you
> provide env vars through your process manager (PM2/systemd/Docker),
> see [Build & run in production](#build--run-in-production).

### Turn the demo off (connect a real backend)

Set `DEMO_MODE=false` in `.env` (or remove it) and fill in the backend variables — see
[Configuration](#configuration):

```bash
DEMO_MODE=false
API_BASE_URL=https://your-backend.example.com/api/public/v1
FACILITY_SLUG=your-facility
API_AUTH_TOKEN=your-bearer-token
```

## How it works

```
page request
  → api.site() / api.openingHours() / api.pricing()   (src/lib/api.ts)
    → DEMO_MODE on?  → bundled data from src/lib/demo-data.ts           (no network, no cache)
    → DEMO_MODE off? → in-process cache → single-flight → fetch backend with Bearer token
                         → on any failure / empty payload: return null → render fallback UI
```

- `GET /site` returning `null` short-circuits the page to **HTTP 503** + `Retry-After: 60` (`<ServiceUnavailable />`).
- Empty/failed hours or pricing render an inline `<ErrorState>` instead.
- Missing CTA links render a disabled `<CtaButton>`. All fallback copy lives in [`src/lib/copy.ts`](src/lib/copy.ts).

## Configuration

`.env` (or process-manager env in prod) overrides the demo defaults inlined in `src/lib/config.ts`:

| Variable                    | Required in prod? | Default                                  | Purpose                                                                |
| --------------------------- | ----------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| `DEMO_MODE`                 | no                | `false` (code) / `true` (`.env.example`) | `true` = serve bundled data from `src/lib/demo-data.ts`, no backend.   |
| `API_BASE_URL`              | yes               | `http://127.0.0.1:8000/api/public/v1`    | Backend root. Full URL = `${API_BASE_URL}/${FACILITY_SLUG}/<endpoint>` |
| `FACILITY_SLUG`             | yes               | `demo`                                   | Slug of the facility this deploy serves; inserted after `/v1/`.        |
| `API_AUTH_TOKEN`            | yes               | _(empty)_                                | Bearer token on every backend call (except `/up`). Server-only.        |
| `PUBLIC_SITE_URL`           | yes               | `http://localhost:4321`                  | Canonical URL, sitemap, OG tags.                                       |
| `CACHE_TTL_SECONDS`         | no                | `300`                                    | In-process cache TTL in seconds.                                       |
| `PUBLIC_GA4_MEASUREMENT_ID` | no                | _(empty)_                                | GA4 measurement ID (omit to disable GA4).                              |
| `PORT` / `HOST`             | no                | Astro Node defaults                      | Server bind address and port.                                          |

> `API_AUTH_TOKEN` has no `PUBLIC_` prefix, so it is never bundled into client code. `src/lib/api.ts` logs only URL +
> status on errors, never the token.

## The API contract

Any backend can drive the template as long as it implements the JSON shapes in
[`src/lib/dto.ts`](src/lib/dto.ts). All responses are `application/json` under the configured base URL.

| Method | Path                  | Response DTO          | Consumed by                  |
| ------ | --------------------- | --------------------- | ---------------------------- |
| `GET`  | `/site`               | `SitePayload`         | Layout (header/footer), home |
| `GET`  | `/site/opening-hours` | `OpeningHoursPayload` | Home (hours section)         |
| `GET`  | `/site/pricing`       | `PricingPayload`      | Home (pricing section)       |

Plus `GET /up` **at the host root** (not under the `/api/...` prefix), **without auth**, returning `200 OK` when the
service is live — used by the template's `/health` probe. On error the backend should return HTTP `>= 400` with an
`ApiError` body `{ error: { code, message } }`. Calls are server-to-server (no CORS needed). See the JSDoc in
`src/lib/dto.ts` for every field.

`src/lib/demo-data.ts` is a complete, type-checked example of all three payloads — a useful reference when building a
backend.

### Legal documents

The privacy and cookie pages are **repo-owned**, not backend-served: edit the Markdown in
[`src/content/legal/policy.md`](src/content/legal/policy.md) and
[`src/content/legal/cookie.md`](src/content/legal/cookie.md) (frontmatter: `title`, `version`, `effective_date`).
Astro renders them natively at `/policy` and `/cookie`.

## White-labeling a deploy

1. Use this repo as a template (GitHub "Use this template") or fork it.
2. Edit `site.config.ts` (branding + per-deploy identity only):

- `siteSlug` — must match `SitePayload.slug` returned by `GET /site`.
- `brand.primaryColor`, `brand.accentColor`, `brand.logoUrl`, `brand.faviconUrl`, `brand.ogImageUrl`. Each `*Url`
  takes either an absolute URL to a hosted asset or a root-relative path served from `public/`; the defaults are the
  local placeholders in `public/brand/`. Replace `og.svg` with a PNG or JPG — social crawlers do not render SVG.

3. Rewrite `site.content.ts` for the new business. It holds `meta` (homepage title/description) and `sections`, an
   ordered list of `{ type, id, navLabel, enabled, data }`:

- **Reorder** the array to reorder the page.
- **`enabled: false`** removes a section from the page, the header menu, the mobile menu and any cross-section
  anchor pointing at it.
- **`id`** is the anchor target (`#prezzi`); **`navLabel`** is the menu entry — omit it to keep a section on the page
  but out of the menu.
- Available `type`s: `hero`, `features`, `hours`, `pricing`, `services`, `rules`, `highlight`. `hours` and `pricing`
  render backend data; the rest render only what you write here. Each `data` shape is typed and documented in
  [`src/lib/sections.ts`](src/lib/sections.ts).

The menu is derived from this file — there is no separate list to keep in sync.

4. Replace the placeholder images in `public/brand/` and `public/placeholder/`.
5. Rewrite the legal documents in `src/content/legal/` and have them reviewed. Controller identity is not in the
   Markdown: it comes from `site.gdpr` on the backend.
6. Set env vars (table above). In prod: `DEMO_MODE=false`, `API_BASE_URL`, `FACILITY_SLUG`, `API_AUTH_TOKEN`,
   `PUBLIC_SITE_URL`.

## Build & run in production

```bash
npm ci && npm run build      # → dist/server/entry.mjs + dist/client/
node ./dist/server/entry.mjs # env vars come from the environment, NOT from .env
```

(For a local run that reads `.env`, use `npm run preview` instead.)

Run under PM2 / systemd / Docker for auto-restart; put Nginx or Caddy in front for TLS, gzip, and to serve
`dist/client/` directly. Smoke-test: `curl https://<site>/health` → `{"status":"ok","backend_reachable":true,...}`.

`GET /health` always returns `200` with `{ status, backend_reachable, backend_up, demo, timestamp }` and
`Cache-Control: no-store`. `backend_up` probes `${host root}/up` without auth; `backend_reachable` is true when
`api.site()` is non-null; `status` is `ok` only when both hold. In demo mode the `/up` probe is skipped and the
endpoint reports `{ status: "ok", backend_reachable: true, backend_up: true, demo: true }` — there is no external
backend to probe.

## Scripts

| Command                     | Purpose                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`               | Dev server with HMR on `:4321`.                                                       |
| `npm run build`             | SSR build into `dist/`.                                                               |
| `npm run preview`           | Run the built `dist/server/entry.mjs` locally; loads `.env` (`--env-file-if-exists`). |
| `npm run check`             | `astro check` + `tsc --noEmit`. Run before claiming success.                          |
| `npm run lint` / `format`   | ESLint / Prettier.                                                                    |
| `npm test`                  | Vitest unit tests (cache, single-flight, auth, demo mode, null normalization).        |
| `npm run test:e2e`          | Playwright E2E against the mock backend (`ok` mode).                                  |
| `npm run test:e2e:degraded` | E2E with the backend unreachable.                                                     |
| `npm run test:e2e:empty`    | E2E with empty payloads.                                                              |
| `npm run test:lh`           | Lighthouse CI (perf ≥ 0.9, SEO ≥ 0.95, a11y warn ≥ 0.9).                              |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Licensed under [MIT](./LICENSE).
