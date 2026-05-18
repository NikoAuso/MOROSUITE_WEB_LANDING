import { config } from './config';
import type {
  SitePayload,
  OpeningHoursPayload,
  PricingPayload,
  LegalPayload,
  LegalDocumentName,
} from './dto';
import {
  PLACEHOLDER_SITE,
  PLACEHOLDER_OPENING_HOURS,
  PLACEHOLDER_PRICING,
  PLACEHOLDER_LEGAL,
} from './placeholders';

// Per-process cache of successful responses (keyed by absolute URL) so
// calling `api.site()` from a page AND its layout costs one round-trip.
const memo = new Map<string, unknown>();

// Per-process circuit breaker. The first time any endpoint on a given host
// fails at the network level (ECONNREFUSED, DNS, timeout, etc.) we mark the
// host as unreachable; every subsequent fetch to it short-circuits to the
// placeholder immediately. This is what turns an offline backend from a
// 30-second wall of retries into a sub-second build.
const deadHosts = new Set<string>();

class HostUnreachableError extends Error {}

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${config.apiBaseUrl}${path}`;
  const host = new URL(url).host;

  if (memo.has(url)) {
    return memo.get(url) as T;
  }

  if (deadHosts.has(host)) {
    throw new HostUnreachableError(`Skipping ${url}: host ${host} marked unreachable.`);
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < config.fetch.retries + 1; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.fetch.timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`GET ${url} → ${response.status}`);
      }

      const data = (await response.json()) as T;
      memo.set(url, data);
      return data;
    } catch (error) {
      lastError = error;

      // Network-level errors (ECONNREFUSED, DNS failure, abort/timeout) mean
      // the host is not reachable: stop retrying and trip the breaker so the
      // remaining endpoints don't waste the same wait time.
      if (error instanceof TypeError || (error as { name?: string }).name === 'AbortError') {
        if (!deadHosts.has(host)) {
          deadHosts.add(host);
          console.warn(
            `[api] ${host} unreachable (${String(error)}). Skipping further requests this build.`,
          );
        }
        break;
      }

      // HTTP error from a live server: a retry may succeed.
      if (attempt < config.fetch.retries) {
        await new Promise((r) => setTimeout(r, config.fetch.retryDelayMs * (attempt + 1)));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(
    `Failed to fetch ${url} after ${config.fetch.retries + 1} attempts: ${String(lastError)}`,
  );
}

/**
 * Same as `fetchJson` but, on failure, returns the provided fallback so the
 * build can still complete. Fallbacks come from `./placeholders.ts` — edit
 * that file to change the demo content shown offline.
 */
async function fetchJsonSafe<T>(path: string, fallback: T): Promise<T> {
  try {
    return await fetchJson<T>(path);
  } catch (error) {
    // Quiet log: HostUnreachableError already produced a single warn above.
    if (!(error instanceof HostUnreachableError)) {
      console.warn(`[api] ${path} unreachable, using placeholder: ${String(error)}`);
    }
    return fallback;
  }
}

export const api = {
  site: () => fetchJsonSafe<SitePayload>('/site', PLACEHOLDER_SITE),
  openingHours: () =>
    fetchJsonSafe<OpeningHoursPayload>('/site/opening-hours', PLACEHOLDER_OPENING_HOURS),
  pricing: () => fetchJsonSafe<PricingPayload>('/site/pricing', PLACEHOLDER_PRICING),
  legal: (doc: LegalDocumentName) =>
    fetchJsonSafe<LegalPayload>(`/legal/${doc}`, PLACEHOLDER_LEGAL[doc]),
};
