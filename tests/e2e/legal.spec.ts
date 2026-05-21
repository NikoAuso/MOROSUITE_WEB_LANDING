import { expect, test } from '@playwright/test';

for (const doc of ['policy', 'cookie'] as const) {
  test(`/${doc} renders title + body + download-PDF link`, async ({ page }) => {
    await page.goto(`/${doc}`);

    await expect(page.locator('article h2').first()).toBeVisible();
    await expect(page.locator('article .prose')).not.toBeEmpty();

    const pdfLink = page.locator(`a[href$="/legal/${doc}.pdf"]`);
    await expect(pdfLink).toBeVisible();
    await expect(pdfLink).toHaveAttribute('href', /\/api\/public\/v1\/legal\/.+\.pdf$/);
  });
}
