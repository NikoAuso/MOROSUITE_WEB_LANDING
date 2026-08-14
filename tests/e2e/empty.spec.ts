import { test, expect } from '@playwright/test';

test.describe('empty — backend up, payloads vuoti', () => {
  test('homepage returns 200 with hours unavailable', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('Orari non disponibili')).toBeVisible();
  });

  test('homepage returns 200 with pricing unavailable', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Listino non disponibile')).toBeVisible();
  });

  test('html lang falls back to the committed defaultLocale when the backend sends null', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  });

  // In empty mode the mock answers 404 on /site/content, like a backend that
  // never implemented the optional endpoint: the committed site.content.ts
  // must render, and the missing endpoint must never be the reason for a 503.
  test('missing /site/content falls back to the committed structure', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Prenota la tua postazione in piscina');
    await expect(page.locator('section#regolamento')).toBeVisible();
  });
});
