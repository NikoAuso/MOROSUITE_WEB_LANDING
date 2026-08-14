import { describe, it, expect, vi, beforeEach } from 'vitest';

// A fully static deploy: dataSource 'static' at config level, DEMO_MODE off.
// The facilitySlug deliberately differs from the fixture slug: the integrity
// warning must stay silent because the payload never came from a backend.
vi.mock('@/lib/config', () => ({
  config: {
    apiBaseUrl: 'http://unused.local/api/public/v1',
    apiAuthToken: '',
    facilitySlug: 'altra-struttura',
    demoMode: false,
    dataSource: 'static',
    fetch: { retries: 0, retryDelayMs: 0, timeoutMs: 1000, cacheTtlMs: 1000 },
  },
}));

describe('static data source (deploy-level)', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  it('site() serves the committed payload with no network and no slug warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { api } = await import('./api');
    const { STATIC_DATA } = await import('@content');
    const site = await api.site();
    expect(site).toEqual(STATIC_DATA['/site']);
    expect(site).not.toBeNull(); // the no-503 guarantee of static mode
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('hours and pricing follow the deploy default without an explicit source', async () => {
    const { api } = await import('./api');
    const { STATIC_DATA } = await import('@content');
    expect(await api.openingHours()).toEqual(STATIC_DATA['/site/opening-hours']);
    expect(await api.pricing()).toEqual(STATIC_DATA['/site/pricing']);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('a section can still opt back into the backend explicitly', async () => {
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ timezone: 'Europe/Rome', daily_hours: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const { api } = await import('./api');
    await api.openingHours('backend');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
