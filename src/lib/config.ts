import { siteConfig as base } from '@config';

// Astro exposes import.meta.env.* at build time. We read overrides if present.
const env = import.meta.env;

export const config = {
  ...base,
  coreApiBase: env.PUBLIC_CORE_API_BASE || base.coreApiBase,
  coreAppUrl: env.PUBLIC_CORE_APP_URL || base.coreAppUrl,
  siteUrl: env.PUBLIC_SITE_URL || base.siteUrl,
  analytics: {
    ...base.analytics,
    ga4MeasurementId: env.PUBLIC_GA4_MEASUREMENT_ID || base.analytics.ga4MeasurementId,
  },
} as const;

export type Config = typeof config;
