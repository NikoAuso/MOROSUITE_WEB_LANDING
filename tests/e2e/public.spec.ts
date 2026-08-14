import { expect, test } from '@playwright/test';

test('homepage emits canonical + og meta tags', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('link[rel=canonical]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
});

// The mock's default_locale ('en') differs from the committed fallback ('it')
// on purpose: same value would make this assertion prove nothing.
test('html lang comes from the backend default_locale', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('sitemap-index.xml is reachable', async ({ request }) => {
  const res = await request.get('/sitemap-index.xml');
  expect(res.ok()).toBe(true);
  const body = await res.text();
  expect(body).toContain('<sitemap>');
});

test('robots.txt is reachable and points at the sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.ok()).toBe(true);
  expect(await res.text()).toMatch(/Sitemap:\s*https?:\/\//i);
});

// 404.astro never sets Astro.response.status itself — the Node adapter maps the
// route to a 404. That is invisible in the source, so pin it here: a regression
// would silently serve "Pagina non trovata" as a 200 and get it indexed.
test('unknown route returns 404, noindex and a titled error page', async ({ page }) => {
  const res = await page.goto('/questa-pagina-non-esiste');

  expect(res?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('h1')).toHaveText('Pagina non trovata');
});
