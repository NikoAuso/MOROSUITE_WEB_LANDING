export const siteConfig = {
  // Which facility this deploy serves is NOT configured here: it is the
  // FACILITY_SLUG env var (see src/lib/config.ts), which both builds the
  // backend URL and is cross-checked against SitePayload.slug at runtime.

  // Fallback `<html lang>`: the backend's default_locale wins when present.
  defaultLocale: 'it' as const,

  // Colours are NOT configured here: the theming surface is the semantic
  // token block in src/styles/tokens.css (brand-*/cta-*/accent-* + hero
  // glows); per-vertical presets will override those custom properties
  // (docs/VISIONE.md, fase C). The removed primaryColor/accentColor fields
  // were dead knobs nothing read.
  //
  // Each *Url below accepts either an absolute URL to an externally hosted
  // asset or a root-relative path served out of public/. The defaults are
  // local placeholders so a fresh clone reaches no third-party host; replace
  // the files in public/brand/ (or point these at your CDN) per deploy.
  // ogImageUrl is a PNG, not an SVG like the other two: social crawlers do not
  // render SVG previews, so an SVG here means no preview at all. Keep any
  // replacement a raster (PNG/JPG) at 1200x630.
  brand: {
    logoUrl: '/brand/logo.svg',
    faviconUrl: '/brand/favicon.svg',
    ogImageUrl: '/brand/og.png',
  },

  analytics: {
    ga4MeasurementId: '' as string, // override via env per deploy
    consentDefault: 'denied' as 'denied' | 'granted',
  },

  // Network behaviour for backend calls. Tuned for "fail fast under SSR":
  // if the backend doesn't answer quickly, the cache populates a null for
  // CACHE_TTL_SECONDS and pages render the explicit "non disponibile" state
  // instead of hanging the request.
  fetch: {
    retries: 1,
    retryDelayMs: 250,
    timeoutMs: 3_000,
  },
} as const;

export type SiteConfig = typeof siteConfig;
