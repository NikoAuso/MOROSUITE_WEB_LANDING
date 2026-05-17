import { config } from './config';
import type {
  SitePayload,
  OpeningHoursPayload,
  PricingPayload,
  LegalPayload,
  LegalDocumentName,
  TransparencyPayload,
  SeoPayload,
} from './dto';
import {
  PLACEHOLDER_SITE,
  PLACEHOLDER_OPENING_HOURS,
  PLACEHOLDER_PRICING,
  PLACEHOLDER_LEGAL,
  PLACEHOLDER_TRANSPARENCY,
  PLACEHOLDER_SEO,
} from './placeholders';

const memo = new Map<string, unknown>();

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${config.apiBaseUrl}${path}`;

  if (memo.has(url)) {
    return memo.get(url) as T;
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < config.fetch.retries; attempt++) {
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
      if (attempt < config.fetch.retries - 1) {
        await new Promise((r) => setTimeout(r, config.fetch.retryDelayMs * (attempt + 1)));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(
    `Failed to fetch ${url} after ${config.fetch.retries} attempts: ${String(lastError)}`,
  );
}

/**
 * Same as `fetchJson` but, on failure, logs a warning and returns the provided
 * fallback so the build can still complete. The fallbacks come from
 * `./placeholders.ts` — edit that file to change the demo content shown offline.
 */
async function fetchJsonSafe<T>(path: string, fallback: T): Promise<T> {
  try {
    return await fetchJson<T>(path);
  } catch (error) {
    console.warn(`[api] ${path} unreachable, using placeholder: ${String(error)}`);
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
  transparency: () =>
    fetchJsonSafe<TransparencyPayload>('/transparency', PLACEHOLDER_TRANSPARENCY),
  seoStructuredData: () => fetchJsonSafe<SeoPayload>('/seo/structured-data', PLACEHOLDER_SEO),
};
