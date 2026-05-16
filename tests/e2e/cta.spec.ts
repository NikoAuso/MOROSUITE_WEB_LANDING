import { expect, test } from '@playwright/test';

test('every CTA targeting the core app uses an absolute URL', async ({ page }) => {
  await page.goto('/');

  const ctaSelectors = ['a[href*="/login"]', 'a[href*="/prenota"]'];

  for (const sel of ctaSelectors) {
    const hrefs = await page
      .locator(sel)
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toMatch(/^https?:\/\/.+/);
      expect(href).not.toMatch(/^http:\/\/localhost:4321\/(login|prenota)/);
    }
  }
});
