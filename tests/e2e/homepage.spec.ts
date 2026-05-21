import { expect, test } from '@playwright/test';

test('homepage shows opening-hours section with at least one row', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section#orari')).toBeVisible();
  await expect(page.locator('section#orari .rounded-2xl').first()).toBeVisible();
});

test('homepage shows pricing section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section#prezzi')).toBeVisible();
});
