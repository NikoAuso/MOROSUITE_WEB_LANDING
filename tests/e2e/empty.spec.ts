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
});
