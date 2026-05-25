import { test, expect } from '@playwright/test';

test.describe('degraded — backend unreachable', () => {
  test('homepage returns 503', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(503);
    const body = await res.text();
    expect(body).toContain('Servizio temporaneamente non disponibile');
  });

  test('/policy returns 503', async ({ request }) => {
    const res = await request.get('/policy');
    expect(res.status()).toBe(503);
  });

  test('/cookie returns 503', async ({ request }) => {
    const res = await request.get('/cookie');
    expect(res.status()).toBe(503);
  });

  test('/health returns degraded with backend_reachable=false and backend_up=false', async ({
    request,
  }) => {
    const res = await request.get('/health');
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('degraded');
    expect(json.backend_reachable).toBe(false);
    expect(json.backend_up).toBe(false);
  });
});
