import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DEMO_DATA } from './demo-data';

// Mock applies to this whole file only: api.test.ts is unaffected.
vi.mock('@/lib/config', () => ({
  config: {
    demoMode: true,
    apiBaseUrl: 'http://unused.local/api/public/v1',
    apiAuthToken: '',
    fetch: { retries: 0, retryDelayMs: 0, timeoutMs: 1000, cacheTtlMs: 1000 },
  },
}));

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.resetModules();
  fetchSpy = vi.spyOn(globalThis, 'fetch');
});

afterEach(() => {
  fetchSpy.mockRestore();
});

describe('api in demo mode', () => {
  it('serves /site from demo data without hitting the network', async () => {
    const { api } = await import('./api');
    const site = await api.site();
    expect(site).toEqual(DEMO_DATA['/site']);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('serves opening hours, pricing and legal from demo data', async () => {
    const { api } = await import('./api');
    expect(await api.openingHours()).toEqual(DEMO_DATA['/site/opening-hours']);
    expect(await api.pricing()).toEqual(DEMO_DATA['/site/pricing']);
    expect(await api.legal('policy')).toEqual(DEMO_DATA['/legal/policy']);
    expect(await api.legal('cookie')).toEqual(DEMO_DATA['/legal/cookie']);
    // Demo fixtures must survive the normalize step (non-empty hours/prices/body).
    expect(await api.openingHours()).not.toBeNull();
    expect(await api.pricing()).not.toBeNull();
    expect(await api.legal('policy')).not.toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
