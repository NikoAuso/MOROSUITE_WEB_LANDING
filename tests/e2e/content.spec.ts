import { expect, test } from '@playwright/test';

// The mock's /site/content payload is deliberately different from the
// committed site.content.ts (hero "Titolo dal backend", only two nav
// sections). These assertions prove the page structure is HTTP-driven, not
// the committed fallback.
test('homepage renders the structure served by /site/content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Titolo dal backend');
});

test('the menu is derived from the backend structure', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav[aria-label="Principale"]');
  await expect(nav.locator('a')).toHaveCount(2);
  await expect(nav.locator('a[href="/#orari"]')).toBeVisible();
  await expect(nav.locator('a[href="/#prezzi"]')).toBeVisible();
  // A committed-default section that the backend structure does not include.
  await expect(nav.locator('a[href="/#piscina"]')).toHaveCount(0);
});

test('sections absent from the backend structure do not render', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section#orari')).toBeVisible();
  await expect(page.locator('section#regolamento')).toHaveCount(0);
  await expect(page.locator('section#bar')).toHaveCount(0);
});
