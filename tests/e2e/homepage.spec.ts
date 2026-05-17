import { expect, test } from '@playwright/test';

test('homepage shows opening-hours section with at least one row', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section#orari table')).toBeVisible();
});

test('homepage shows pricing section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section#prezzi')).toBeVisible();
});
