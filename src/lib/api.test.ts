import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

const FAKE_TOKEN = 'tkn_test_abc123';
const FAKE_BASE = 'http://mock.local/api/public/v1';

vi.mock('@/lib/config', () => ({
  config: {
    apiBaseUrl: FAKE_BASE,
    apiAuthToken: FAKE_TOKEN,
    fetch: { retries: 0, retryDelayMs: 0, timeoutMs: 1000, cacheTtlMs: 1000 },
  },
}));

const SITE_OK = {
  slug: 'demo',
  name: 'Test',
  short_name: 'Test',
  tagline: null,
  languages: ['it'],
  default_locale: 'it',
  online_bookings_enabled: true,
  customer_can_book_any_weekday: true,
  contacts: {},
  address: {},
  gdpr: { titolare: null, email_privacy: null, email_security: null },
  social: {},
  season: { start_date: null, end_date: null },
  season_dates: null,
  links: { booking: null, login: null, manager: null, register: null, hotel: null },
};

const HOURS_OK = {
  timezone: 'Europe/Rome',
  daily_hours: [
    {
      key: 'monday',
      label: 'Lun',
      closed: false,
      intervals: [{ slot: 'morning', label: 'M', open: '09:00', close: '12:00' }],
    },
  ],
};

const PRICING_OK = {
  active_price_list_name: 'L',
  has_prices: true,
  entrance_count: 1,
  pass_count: 0,
  entrance_sections: [
    {
      label: 'A',
      rows: [
        {
          label: 'X',
          range: null,
          weekday_value: 10,
          weekend_value: 12,
          weekday_is_free: false,
          weekend_is_free: false,
        },
      ],
    },
  ],
  pass_sections: [],
};

let fetchSpy: ReturnType<typeof vi.spyOn>;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

beforeEach(async () => {
  vi.resetModules();
  fetchSpy = vi.spyOn(globalThis, 'fetch');
});

afterEach(() => {
  fetchSpy.mockRestore();
});

describe('api.site', () => {
  it('caches successful responses', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(SITE_OK));
    const { api } = await import('./api');
    const a = await api.site();
    const b = await api.site();
    expect(a).toEqual(SITE_OK);
    expect(b).toEqual(SITE_OK);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('caches network failure as null for the configured TTL', async () => {
    fetchSpy.mockRejectedValue(new TypeError('ECONNREFUSED'));
    const { api } = await import('./api');
    const a = await api.site();
    const b = await api.site();
    expect(a).toBeNull();
    expect(b).toBeNull();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('caches HTTP 5xx as null', async () => {
    fetchSpy.mockResolvedValue(jsonResponse({ error: { code: 'X', message: 'down' } }, 503));
    const { api } = await import('./api');
    expect(await api.site()).toBeNull();
  });

  it('caches HTTP 401 as null (token misconfig surface)', async () => {
    fetchSpy.mockResolvedValue(new Response('', { status: 401 }));
    const { api } = await import('./api');
    expect(await api.site()).toBeNull();
  });

  it('attaches Authorization: Bearer <token> header', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(SITE_OK));
    const { api } = await import('./api');
    await api.site();
    expect(fetchSpy).toHaveBeenCalledWith(
      `${FAKE_BASE}/site`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${FAKE_TOKEN}`,
          Accept: 'application/json',
        }),
      }),
    );
  });

  it('coalesces concurrent requests into a single fetch (single-flight)', async () => {
    let resolveFetch: (v: Response) => void = () => {};
    fetchSpy.mockReturnValue(
      new Promise((r) => {
        resolveFetch = r;
      }),
    );
    const { api } = await import('./api');
    const p1 = api.site();
    const p2 = api.site();
    resolveFetch(jsonResponse(SITE_OK));
    const [a, b] = await Promise.all([p1, p2]);
    expect(a).toEqual(SITE_OK);
    expect(b).toEqual(SITE_OK);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('re-fetches after the TTL expires', async () => {
    vi.useFakeTimers();
    fetchSpy.mockResolvedValue(jsonResponse(SITE_OK));
    const { api } = await import('./api');
    await api.site();
    vi.advanceTimersByTime(2000); // ttl is 1000ms in the mocked config
    await api.site();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});

describe('api.site malformed-payload normalization', () => {
  it.each([
    ['address', { ...SITE_OK, address: undefined }],
    ['gdpr', { ...SITE_OK, gdpr: undefined }],
    ['season', { ...SITE_OK, season: undefined }],
  ])('returns null when the required %s object is missing (so the page degrades to 503)', async (_label, payload) => {
    fetchSpy.mockResolvedValue(jsonResponse(payload));
    const { api } = await import('./api');
    expect(await api.site()).toBeNull();
  });

  it('returns the payload when all required objects are present', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(SITE_OK));
    const { api } = await import('./api');
    expect(await api.site()).toEqual(SITE_OK);
  });
});

describe('api.openingHours empty normalization', () => {
  it('returns null when daily_hours is null', async () => {
    fetchSpy.mockResolvedValue(jsonResponse({ timezone: 'Europe/Rome', daily_hours: null }));
    const { api } = await import('./api');
    expect(await api.openingHours()).toBeNull();
  });

  it('returns null when daily_hours is an empty array', async () => {
    fetchSpy.mockResolvedValue(jsonResponse({ timezone: 'Europe/Rome', daily_hours: [] }));
    const { api } = await import('./api');
    expect(await api.openingHours()).toBeNull();
  });

  it('returns the payload when daily_hours has entries', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(HOURS_OK));
    const { api } = await import('./api');
    expect(await api.openingHours()).toEqual(HOURS_OK);
  });
});

describe('api.pricing empty normalization', () => {
  it('returns null when has_prices is false', async () => {
    fetchSpy.mockResolvedValue(
      jsonResponse({
        active_price_list_name: null,
        has_prices: false,
        entrance_count: 0,
        pass_count: 0,
        entrance_sections: [],
        pass_sections: [],
      }),
    );
    const { api } = await import('./api');
    expect(await api.pricing()).toBeNull();
  });

  it('returns null when both section arrays are empty', async () => {
    fetchSpy.mockResolvedValue(
      jsonResponse({
        active_price_list_name: 'L',
        has_prices: true,
        entrance_count: 0,
        pass_count: 0,
        entrance_sections: [],
        pass_sections: [],
      }),
    );
    const { api } = await import('./api');
    expect(await api.pricing()).toBeNull();
  });

  it('returns the payload when there is at least one section row', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(PRICING_OK));
    const { api } = await import('./api');
    expect(await api.pricing()).toEqual(PRICING_OK);
  });
});
