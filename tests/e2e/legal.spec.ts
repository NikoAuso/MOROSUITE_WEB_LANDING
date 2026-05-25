import { expect, test } from '@playwright/test';

for (const doc of ['policy', 'cookie'] as const) {
  test(`/${doc} renders title + body`, async ({ page }) => {
    await page.goto(`/${doc}`);

    await expect(page.locator('article h2').first()).toBeVisible();
    await expect(page.locator('article .prose')).not.toBeEmpty();
  });
}
