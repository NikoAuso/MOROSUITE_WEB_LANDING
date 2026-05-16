import { expect, test } from '@playwright/test';

test('homepage emits canonical + og + structured-data', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('link[rel=canonical]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(ld).toBeTruthy();
  const parsed = JSON.parse(ld!);
  expect(parsed['@type']).toBe('SwimmingPool');
  expect(parsed.url).toMatch(/^https?:\/\//);
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
