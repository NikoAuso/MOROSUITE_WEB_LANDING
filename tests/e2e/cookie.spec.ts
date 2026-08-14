import { expect, test } from '@playwright/test';

const banner = '#cookie-banner';
const preferences = '[data-cookie-preferences]';

test('banner appears on a first visit and stays away once a choice is stored', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(banner)).toBeVisible();

  await page.locator('#cookie-reject').click();
  await expect(page.locator(banner)).toBeHidden();

  await page.reload();
  await expect(page.locator(banner)).toBeHidden();
});

test('the footer trigger reopens the banner after a choice was made', async ({ page }) => {
  await page.goto('/');
  await page.locator('#cookie-accept').click();
  await expect(page.locator(banner)).toBeHidden();

  await page.locator(preferences).click();
  await expect(page.locator(banner)).toBeVisible();

  // The point of the affordance: the earlier choice can actually be replaced.
  await page.locator('#cookie-reject').click();
  await expect(page.locator(banner)).toBeHidden();
  const stored = await page.evaluate(() => localStorage.getItem('cookie_consent'));
  expect(stored).toContain('rejected');
});

test('the trigger is hidden until the banner script unhides it', async ({ page }) => {
  // It ships with the `hidden` attribute so it is never a dead control without
  // JS; the assertion is that the script does claim it.
  await page.goto('/');
  await expect(page.locator(preferences)).toBeVisible();
});
