import { expect, test } from '@playwright/test';

test('homepage renders the facility name in the title and h1', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Piscina|Morobello/i);
  await expect(page.locator('h1')).toContainText(/Piscina|Morobello/i);
});

test('homepage shows opening-hours section with at least one row', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section#orari table')).toBeVisible();
});

test('homepage shows pricing section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section#prezzi')).toBeVisible();
});
