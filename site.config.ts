export const siteConfig = {
  // Stable slug used to identify this deploy against the backend. Must match
  // the value returned by GET /site (SitePayload.slug).
  siteSlug: 'demo',

  defaultLocale: 'it' as const,
  supportedLocales: ['it', 'en'] as const,

  // Each *Url below accepts either an absolute URL to an externally hosted
  // asset or a root-relative path served out of public/. The defaults are
  // local placeholders so a fresh clone reaches no third-party host; replace
  // the files in public/brand/ (or point these at your CDN) per deploy.
  // ogImageUrl must end up a raster (PNG/JPG) on a real deploy: the social
  // crawlers do not render SVG previews.
  brand: {
    primaryColor: '#0c4a6e',
    accentColor: '#facc15',
    logoUrl: '/brand/logo.svg',
    faviconUrl: '/brand/favicon.svg',
    ogImageUrl: '/brand/og.svg',
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
