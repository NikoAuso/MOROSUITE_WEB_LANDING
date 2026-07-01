export const siteConfig = {
  // Stable slug used to identify this deploy against the backend. Must match
  // the value returned by GET /site (SitePayload.slug).
  siteSlug: 'demo',

  defaultLocale: 'it' as const,
  supportedLocales: ['it', 'en'] as const,

  brand: {
    primaryColor: '#0c4a6e',
    accentColor: '#facc15',
    logoUrl: 'https://placehold.co/200x200/3291a8/ffffff/png?text=D',
    faviconUrl: 'https://placehold.co/64x64/3291a8/ffffff/png?text=D',
    ogImageUrl: 'https://placehold.co/1200x630/3291a8/ffffff/png?text=D',
  },

  analytics: {
    ga4MeasurementId: '' as string, // override via env per deploy
    consentDefault: 'denied' as 'denied' | 'granted',
  },

  features: {
    showLiveAvailability: false,
    showPricingFilters: true,
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
