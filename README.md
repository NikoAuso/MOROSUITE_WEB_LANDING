# morosuite-site-template

White-label Astro template for MOROSUITE customers' public marketing site.
Consumes the core's read-only API at `${coreApiBase}/api/public/v1/*`.

## Stack

- Astro 6 (static output) + Tailwind 4 (CSS-first `@theme`) + TypeScript 5
- Build-time fetcher (`src/lib/api.ts`) with retry + per-process memoization
- Playwright for E2E smoke + Lighthouse CI for performance/SEO gates
- Cloudflare Pages deploy target

## Local dev

1. Clone, then `pnpm install` (requires Node 22+ and pnpm 11).
2. Copy `.env.example` to `.env` and point `PUBLIC_CORE_API_BASE` at a running MOROSUITE instance
   (`http://localhost:8765/api/public/v1` if you `php artisan serve --port=8765` on the core).
3. `pnpm dev` — opens on `http://localhost:4321`.

## White-label a deploy

1. Fork or branch this repo.
2. Edit `site.config.ts`:
   - `facilitySlug`, `coreApiBase`, `coreAppUrl`, `siteUrl`
   - `brand.primaryColor`, `brand.accentColor`, `brand.logoUrl`
3. Replace `public/images/{logo,favicon,og}.*` with the client's assets.
4. Set GitHub secrets (see below).
5. Push to `main` → Cloudflare Pages publishes.

## Public site navigation

Navigation entries (header + footer) are **hardcoded** in `src/lib/navigation.ts`.
They are not configurable from the core admin. To tweak menu labels per client,
fork the template and edit that file — same for the legal-data categories list
in `src/pages/trasparenza.astro`.

## Scripts

| Command          | Use                                       |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Dev server with HMR                       |
| `pnpm build`     | Produce `dist/` static bundle             |
| `pnpm preview`   | Serve `dist/` locally                     |
| `pnpm check`     | Astro type-check + `tsc --noEmit`         |
| `pnpm lint`      | ESLint                                    |
| `pnpm format`    | Prettier write                            |
| `pnpm test:e2e`  | Playwright E2E (auto-starts preview)      |
| `pnpm test:lh`   | Lighthouse CI                             |

## Required GitHub secrets

For CI + Cloudflare Pages preview deploy:

- `CLOUDFLARE_API_TOKEN` — token with `Pages:Edit` permission on the account that hosts the project.
- `CLOUDFLARE_ACCOUNT_ID` — found in the Cloudflare dashboard top-right.
- `STAGING_CORE_API_BASE` — e.g. `https://app-staging.morobello.it/api/public/v1`.
- `STAGING_CORE_APP_URL` — e.g. `https://app-staging.morobello.it`.
- `PREVIEW_GA4_ID` — GA4 measurement id for preview deploys (or empty to disable analytics).

## Related

- Core repo: [`MOROSUITE`](https://github.com/NikoAuso/MOROSUITE)
- Spec: `docs/superpowers/specs/2026-05-15-public-template-split-design.md` in MOROSUITE
- Plan: `docs/superpowers/plans/2026-05-16-public-template-split-template-repo.md` in MOROSUITE
