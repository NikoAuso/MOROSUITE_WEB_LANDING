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

  test('/policy returns 200 with document unavailable', async ({ page }) => {
    const res = await page.goto('/policy');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('Documento temporaneamente non disponibile')).toBeVisible();
  });

  test('/cookie returns 200 with document unavailable', async ({ page }) => {
    const res = await page.goto('/cookie');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('Documento temporaneamente non disponibile')).toBeVisible();
  });
});
