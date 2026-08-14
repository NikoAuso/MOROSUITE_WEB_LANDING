import { describe, it, expect, beforeEach, vi } from 'vitest';

// /health is a plain APIRoute function: unit-testable by mocking its inputs.
// The static and mixed branches had zero coverage (review 14/08/2026); the
// backend branch is also pinned by tests/e2e/degraded.spec.ts.

const mockConfig = (overrides: Record<string, unknown>) => {
  vi.doMock('@/lib/config', () => ({
    config: {
      apiBaseUrl: 'http://unused.local/api/public/v1',
      apiAuthToken: '',
      facilitySlug: 'demo',
      demoMode: false,
      dataSource: 'backend',
      fetch: { retries: 0, retryDelayMs: 0, timeoutMs: 1000, cacheTtlMs: 1000 },
      ...overrides,
    },
  }));
};

const mockSections = (sections: unknown[]) => {
  vi.doMock('@content', () => ({
    siteContent: { meta: {}, sections },
    STATIC_DATA: {},
  }));
};

const HOURS_BACKEND = {
  type: 'hours',
  id: 'orari',
  enabled: true,
  data: { source: 'backend', eyebrow: '', title: '' },
};
const HOURS_PLAIN = { type: 'hours', id: 'orari', enabled: true, data: { eyebrow: '', title: '' } };

const callHealth = async () => {
  const { GET } = await import('./health');
  const response = await (GET as (ctx: unknown) => Promise<Response>)({});
  return { status: response.status, body: await response.json() };
};

beforeEach(() => {
  vi.resetModules();
});

describe('/health data_source branches', () => {
  it('fully static deploy: ok with data_source "static", no fetch at all', async () => {
    mockConfig({ dataSource: 'static' });
    mockSections([HOURS_PLAIN]);
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { body } = await callHealth();
    expect(body).toMatchObject({ status: 'ok', demo: false, data_source: 'static' });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('demo mode: ok with data_source "demo" even when a section says backend', async () => {
    mockConfig({ demoMode: true, dataSource: 'static' });
    mockSections([HOURS_BACKEND]);
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { body } = await callHealth();
    expect(body).toMatchObject({ status: 'ok', demo: true, data_source: 'demo' });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('static deploy with a backend section override probes and reports "mixed"', async () => {
    mockConfig({ dataSource: 'static' });
    mockSections([HOURS_BACKEND]);
    // /up probe fails: the backend this section depends on is down.
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('fetch failed'));
    const { body } = await callHealth();
    expect(body.data_source).toBe('mixed');
    expect(body.backend_up).toBe(false);
    expect(body.status).toBe('degraded');
    fetchSpy.mockRestore();
  });
});
