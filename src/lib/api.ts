import { config } from './config';
import { STATIC_DATA } from '@content';
import type { SitePayload, OpeningHoursPayload, PricingPayload } from './dto';
import type { SectionDataSource } from './sections';

type CacheEntry<T> = { value: T | null; timestamp: number };

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (config.apiAuthToken) {
    headers.Authorization = `Bearer ${config.apiAuthToken}`;
  }
  return headers;
}

async function rawFetch<T>(url: string): Promise<T | null> {
  const { retries, retryDelayMs, timeoutMs } = config.fetch;
  const headers = authHeaders();
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { signal: controller.signal, headers });

      if (!response.ok) {
        console.warn(`[api] GET ${url} -> HTTP ${response.status}`);
        if (response.status >= 500 && attempt < retries) {
          await sleep(retryDelayMs * (attempt + 1));
          continue;
        }
        return null;
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      const isNetworkError =
        error instanceof TypeError || (error as { name?: string }).name === 'AbortError';

      if (isNetworkError) {
        console.warn(`[api] GET ${url} -> network error: ${String(error)}`);
        return null;
      }

      if (attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  console.error(`[api] GET ${url} -> exhausted retries: ${String(lastError)}`);
  return null;
}

async function fetchJson<T>(
  path: string,
  normalize: (data: T) => T | null = (d) => d,
  source: SectionDataSource = config.dataSource,
): Promise<T | null> {
  // DEMO_MODE overrides even an explicit per-section 'backend': the demo
  // promise is "renders with zero backend", and a preset shipping a backend
  // override must not break it.
  const effective = config.demoMode ? 'static' : source;
  // Static serving: the committed STATIC_DATA from site.content.ts, no
  // network and no cache. The payloads are type-checked at build, so this
  // path cannot 503 a page the way an unreachable backend can.
  if (effective === 'static') {
    const raw = STATIC_DATA[path] as T | undefined;
    return raw === undefined ? null : normalize(raw);
  }

  const url = `${config.apiBaseUrl}${path}`;
  const now = Date.now();
  const entry = cache.get(url) as CacheEntry<T> | undefined;

  if (entry && now - entry.timestamp < config.fetch.cacheTtlMs) {
    return entry.value;
  }

  const inflightPromise = inflight.get(url);
  if (inflightPromise) {
    return inflightPromise as Promise<T | null>;
  }

  const promise = (async (): Promise<T | null> => {
    try {
      const raw = await rawFetch<T>(url);
      const value = raw === null ? null : normalize(raw);
      cache.set(url, { value, timestamp: Date.now() });
      return value;
    } finally {
      inflight.delete(url);
    }
  })();

  inflight.set(url, promise);
  return promise;
}

function normalizeSite(p: SitePayload): SitePayload | null {
  // The components dereference these required objects without optional chaining
  // (footer address/gdpr, opening-hours season). A 200 that omits any of them
  // violates the dto contract; treat it as null so the page degrades to 503
  // instead of throwing during SSR render.
  if (!p.address || !p.gdpr || !p.season) return null;

  // Integrity check, warning-only: the backend echoes which site it thinks it
  // is serving; a mismatch with the facility this deploy asked for means the
  // deploy is pointed at the wrong backend/slug. Runs once per cache fill —
  // and only when the payload actually came from a backend: static/demo
  // serving reads committed fixtures uncached on every request (the warn
  // would spam) and their slug proves nothing about the deploy anyway.
  // Availability wins over strictness, so the page still renders.
  if (config.dataSource === 'backend' && p.slug && p.slug !== config.facilitySlug) {
    console.warn(
      `[api] /site returned slug "${p.slug}" but this deploy is configured for ` +
        `FACILITY_SLUG "${config.facilitySlug}" — check the deploy configuration`,
    );
  }

  // The backend's kill switch for the booking flow. Nulling the link here,
  // at the single normalization point, downgrades every booking CTA (hero,
  // pricing, rules, highlight) to the disabled state at once — gating at the
  // render sites would have to be repeated and would eventually be forgotten.
  if (!p.online_bookings_enabled && p.links?.booking) {
    return { ...p, links: { ...p.links, booking: null } };
  }

  return p;
}

function normalizeOpeningHours(p: OpeningHoursPayload): OpeningHoursPayload | null {
  if (!p.daily_hours || p.daily_hours.length === 0) return null;
  return p;
}

function normalizePricing(p: PricingPayload): PricingPayload | null {
  if (!p.has_prices) return null;
  if ((p.entrance_sections?.length ?? 0) === 0 && (p.pass_sections?.length ?? 0) === 0) return null;
  return p;
}

export const api = {
  /** Identity always follows the deploy-level source: it has no owning section. */
  site: () => fetchJson<SitePayload>('/site', normalizeSite),
  /** `source` lets the hours/pricing sections override the deploy default. */
  openingHours: (source?: SectionDataSource) =>
    fetchJson<OpeningHoursPayload>('/site/opening-hours', normalizeOpeningHours, source),
  pricing: (source?: SectionDataSource) =>
    fetchJson<PricingPayload>('/site/pricing', normalizePricing, source),
};
