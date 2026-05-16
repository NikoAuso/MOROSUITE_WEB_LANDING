import { config } from './config';
import type {
  FacilityPayload,
  OpeningHoursPayload,
  PricingPayload,
  LegalPayload,
  LegalDocumentName,
  TransparencyPayload,
  SeoPayload,
} from './types';

const memo = new Map<string, unknown>();

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${config.coreApiBase}${path}`;

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

export const api = {
  facility: () => fetchJson<FacilityPayload>('/facility'),
  openingHours: () => fetchJson<OpeningHoursPayload>('/facility/opening-hours'),
  pricing: () => fetchJson<PricingPayload>('/facility/pricing'),
  legal: (doc: LegalDocumentName) => fetchJson<LegalPayload>(`/legal/${doc}`),
  transparency: () => fetchJson<TransparencyPayload>('/transparency'),
  seoStructuredData: () => fetchJson<SeoPayload>('/seo/structured-data'),
};
