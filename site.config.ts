export const siteConfig = {
  // Identity of the facility this deploy serves. Must match the slug returned
  // by GET /api/public/v1/facility.
  facilitySlug: 'morobello',

  // URLs — overridable via .env per environment (preview vs production).
  coreApiBase: 'http://localhost:8765/api/public/v1',
  coreAppUrl: 'http://localhost:8765',
  siteUrl: 'https://www.morobello.it',

  defaultLocale: 'it' as const,
  supportedLocales: ['it', 'en'] as const,

  brand: {
    primaryColor: '#0e7490',
    accentColor: '#fbbf24',
    logoUrl: '/images/logo.svg',
    faviconUrl: '/images/favicon.svg',
    ogImageUrl: '/images/og.webp',
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

  // Build-time fetcher behaviour.
  fetch: {
    retries: 3,
    retryDelayMs: 500,
    timeoutMs: 10_000,
  },
} as const;

export type SiteConfig = typeof siteConfig;
