import { config } from './config';
import type {
  SitePayload,
  OpeningHoursPayload,
  PricingPayload,
  LegalPayload,
  LegalDocumentName,
} from './dto';

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
        error instanceof TypeError ||
        (error as { name?: string }).name === 'AbortError';

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
): Promise<T | null> {
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

function normalizeOpeningHours(p: OpeningHoursPayload): OpeningHoursPayload | null {
  if (!p.daily_hours || p.daily_hours.length === 0) return null;
  return p;
}

function normalizePricing(p: PricingPayload): PricingPayload | null {
  if (!p.has_prices) return null;
  if ((p.entrance_sections?.length ?? 0) === 0 && (p.pass_sections?.length ?? 0) === 0) return null;
  return p;
}

function normalizeLegal(p: LegalPayload): LegalPayload | null {
  if (!p.body || p.body.trim() === '') return null;
  return p;
}

export const api = {
  site: () => fetchJson<SitePayload>('/site'),
  openingHours: () => fetchJson<OpeningHoursPayload>('/site/opening-hours', normalizeOpeningHours),
  pricing: () => fetchJson<PricingPayload>('/site/pricing', normalizePricing),
  legal: (doc: LegalDocumentName) =>
    fetchJson<LegalPayload>(`/legal/${doc}`, normalizeLegal),
};
