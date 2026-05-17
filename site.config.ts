export const siteConfig = {
  // Stable slug used to identify this deploy against the backend. Must match
  // the value returned by GET /site (SitePayload.slug).
  siteSlug: 'morobello',

  defaultLocale: 'it' as const,
  supportedLocales: ['it', 'en'] as const,

  brand: {
    primaryColor: '#0c4a6e',
    accentColor: '#facc15',
    logoUrl: 'https://placehold.co/200x200/3291a8/ffffff/png?text=D',
    faviconUrl: 'https://placehold.co/64x64/3291a8/ffffff/png?text=D',
    ogImageUrl: 'https://picsum.photos/seed/pool-og/1200/630',
  },

  analytics: {
    ga4MeasurementId: '' as string, // override via env per deploy
    consentDefault: 'denied' as 'denied' | 'granted',
  },

  features: {
    showLiveAvailability: false,
    showPricingFilters: true,
    pdfDownload: true,
  },

  // Build-time fetcher behaviour. Tuned for "fail fast then serve placeholder":
  // worst case on a fully unreachable host is one ECONNREFUSED (~ms) plus the
  // circuit breaker in src/lib/api.ts skipping every subsequent endpoint.
  fetch: {
    retries: 1,
    retryDelayMs: 250,
    timeoutMs: 3_000,
  },
} as const;

export type SiteConfig = typeof siteConfig;
