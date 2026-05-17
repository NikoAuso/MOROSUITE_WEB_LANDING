import { siteConfig as base } from '@config';

// Astro exposes import.meta.env.* at build time. Per-environment URLs are
// sourced exclusively from env, with the demo fallbacks declared below kicking
// in only when the corresponding variable is empty/unset (e.g. local dev with
// no .env). These fallbacks are not part of `site.config.ts` because they are
// environment-level concerns, not per-deploy branding.
const env = import.meta.env;

const DEMO_API_BASE_URL = 'http://localhost:8765/api/public/v1';
const DEMO_APP_BASE_URL = 'http://localhost:8765';
const DEMO_SITE_URL = 'http://localhost:4321';

export const config = {
  ...base,
  apiBaseUrl: env.API_BASE_URL || DEMO_API_BASE_URL,
  appBaseUrl: env.APP_BASE_URL || DEMO_APP_BASE_URL,
  siteUrl: env.PUBLIC_SITE_URL || DEMO_SITE_URL,
  analytics: {
    ...base.analytics,
    ga4MeasurementId: env.PUBLIC_GA4_MEASUREMENT_ID || base.analytics.ga4MeasurementId,
  },
} as const;

export type Config = typeof config;
