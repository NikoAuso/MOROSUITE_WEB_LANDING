import { test, expect } from '@playwright/test';
import { siteContent } from '../../site.content';
import { enabledSections } from '../../src/lib/sections';
import { FALLBACK_COPY } from '../../src/lib/copy';

// The fallback texts come from FALLBACK_COPY and the section presence from the
// committed structure: neither assertion hardcodes deploy copy, so re-theming
// cannot break this suite.
const sections = enabledSections(siteContent.sections);
const hasHours = sections.some((section) => section.type === 'hours');
const hasPricing = sections.some((section) => section.type === 'pricing');

test.describe('empty — backend up, payloads vuoti', () => {
  test('homepage returns 200 with hours unavailable', async ({ page }) => {
    test.skip(!hasHours, 'no hours section in the committed structure');
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    await expect(page.getByText(FALLBACK_COPY.hours.title)).toBeVisible();
  });

  test('homepage returns 200 with pricing unavailable', async ({ page }) => {
    test.skip(!hasPricing, 'no pricing section in the committed structure');
    await page.goto('/');
    await expect(page.getByText(FALLBACK_COPY.pricing.title)).toBeVisible();
  });

  test('html lang falls back to the committed defaultLocale when the backend sends null', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  });
});
