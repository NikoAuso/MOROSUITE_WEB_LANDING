import { siteConfig as base } from '@config';

// import.meta.env is populated by Vite at build time. At runtime under SSR,
// Astro re-resolves the variables from process.env on each request, so the
// fallbacks below kick in only when the corresponding variable is unset.
const env = import.meta.env;

const DEMO_API_BASE_URL = 'http://localhost:8765/api/public/v1';
const DEMO_SITE_URL = 'http://localhost:4321';
const DEFAULT_CACHE_TTL_SECONDS = 300;

const cacheTtlSeconds = Number(env.CACHE_TTL_SECONDS) || DEFAULT_CACHE_TTL_SECONDS;

export const config = {
  ...base,
  apiBaseUrl: env.API_BASE_URL || DEMO_API_BASE_URL,
  apiAuthToken: env.API_AUTH_TOKEN || '',
  siteUrl: env.PUBLIC_SITE_URL || DEMO_SITE_URL,
  fetch: {
    ...base.fetch,
    cacheTtlMs: cacheTtlSeconds * 1000,
  },
  analytics: {
    ...base.analytics,
    ga4MeasurementId: env.PUBLIC_GA4_MEASUREMENT_ID || base.analytics.ga4MeasurementId,
  },
} as const;

export type Config = typeof config;
