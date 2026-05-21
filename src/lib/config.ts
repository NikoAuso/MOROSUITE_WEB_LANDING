import { siteConfig as base } from '@config';

// import.meta.env is populated by Vite at build time. For server-only
// (non-PUBLIC_) variables Vite inlines the build-time value, so at runtime
// we fall back to process.env to allow the SSR node process to override them.
const _imenv = import.meta.env;
const _proc = typeof process !== 'undefined' ? process.env : {};
const env = {
  ..._imenv,
  API_BASE_URL: _proc['API_BASE_URL'] || _imenv['API_BASE_URL'],
  API_AUTH_TOKEN: _proc['API_AUTH_TOKEN'] || _imenv['API_AUTH_TOKEN'],
  CACHE_TTL_SECONDS: _proc['CACHE_TTL_SECONDS'] || _imenv['CACHE_TTL_SECONDS'],
  PUBLIC_SITE_URL: _proc['PUBLIC_SITE_URL'] || _imenv['PUBLIC_SITE_URL'],
  PUBLIC_GA4_MEASUREMENT_ID: _proc['PUBLIC_GA4_MEASUREMENT_ID'] || _imenv['PUBLIC_GA4_MEASUREMENT_ID'],
};

const DEMO_API_BASE_URL = 'http://localhost:8765/api/public/v1';
const DEMO_SITE_URL = 'http://localhost:4321';
const DEFAULT_CACHE_TTL_SECONDS = 300;

const parsedTtl = Number(env.CACHE_TTL_SECONDS);
const cacheTtlSeconds = Number.isFinite(parsedTtl) && parsedTtl >= 0
  ? parsedTtl
  : DEFAULT_CACHE_TTL_SECONDS;

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
