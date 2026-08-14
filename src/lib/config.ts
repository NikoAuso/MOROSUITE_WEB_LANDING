import { siteConfig as base } from '@config';

// import.meta.env is populated by Vite at build time. For server-only
// (non-PUBLIC_) variables Vite inlines the build-time value, so at runtime
// we fall back to process.env to allow the SSR node process to override them.
const _imenv = import.meta.env;
const _proc = typeof process !== 'undefined' ? process.env : {};
const env = {
  API_BASE_URL: _proc['API_BASE_URL'] || _imenv['API_BASE_URL'],
  API_AUTH_TOKEN: _proc['API_AUTH_TOKEN'] || _imenv['API_AUTH_TOKEN'],
  FACILITY_SLUG: _proc['FACILITY_SLUG'] || _imenv['FACILITY_SLUG'],
  CACHE_TTL_SECONDS: _proc['CACHE_TTL_SECONDS'] || _imenv['CACHE_TTL_SECONDS'],
  PUBLIC_SITE_URL: _proc['PUBLIC_SITE_URL'] || _imenv['PUBLIC_SITE_URL'],
  PUBLIC_GA4_MEASUREMENT_ID:
    _proc['PUBLIC_GA4_MEASUREMENT_ID'] || _imenv['PUBLIC_GA4_MEASUREMENT_ID'],
  DEMO_MODE: _proc['DEMO_MODE'] || _imenv['DEMO_MODE'],
};

const DEMO_API_ROOT = 'http://127.0.0.1:8000/api/public/v1';
const DEMO_FACILITY_SLUG = 'demo';
const DEMO_SITE_URL = 'http://localhost:4321';
const DEFAULT_CACHE_TTL_SECONDS = 300;

const parsedTtl = Number(env.CACHE_TTL_SECONDS);
const cacheTtlSeconds =
  Number.isFinite(parsedTtl) && parsedTtl >= 0 ? parsedTtl : DEFAULT_CACHE_TTL_SECONDS;

const apiRoot = (env.API_BASE_URL || DEMO_API_ROOT).replace(/\/+$/, '');
const facilitySlug = env.FACILITY_SLUG || DEMO_FACILITY_SLUG;

export const config = {
  ...base,
  // When true, src/lib/api.ts serves bundled data from the active preset (presets/*/demo-data.ts)
  // instead of fetching from the backend. Toggled by the DEMO_MODE env var.
  demoMode: env.DEMO_MODE === 'true',
  // Exposed so normalizeSite can cross-check SitePayload.slug against the
  // facility this deploy is actually pointed at.
  facilitySlug,
  apiBaseUrl: `${apiRoot}/${facilitySlug}`,
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
