import { expect, test } from '@playwright/test';
import { siteContent } from '../../site.content';
import { enabledSections } from '../../src/lib/sections';

// Derived from the committed content, not hardcoded: re-theming the deploy
// (rewriting site.content.ts — the product's founding operation) must not
// break CI. Anchor ids, section presence and the hours/pricing expectations
// all follow whatever structure is committed.
const sections = enabledSections(siteContent.sections);
const anchored = sections.filter(
  (section): section is Extract<(typeof sections)[number], { id: string }> => 'id' in section,
);
const hoursSection = sections.find((section) => section.type === 'hours');
const pricingSection = sections.find((section) => section.type === 'pricing');

test('every enabled anchored section renders with its anchor id', async ({ page }) => {
  await page.goto('/');
  expect(anchored.length).toBeGreaterThan(0);
  for (const section of anchored) {
    await expect(page.locator(`section#${section.id}`)).toBeVisible();
  }
});

test('the hours section shows at least one interval row from the mock backend', async ({
  page,
}) => {
  test.skip(!hoursSection, 'no hours section in the committed structure');
  await page.goto('/');
  await expect(
    page.locator(`section#${(hoursSection as { id: string }).id} .rounded-2xl`).first(),
  ).toBeVisible();
});

test('the pricing section renders the mock price list', async ({ page }) => {
  test.skip(!pricingSection, 'no pricing section in the committed structure');
  await page.goto('/');
  await expect(page.locator(`section#${(pricingSection as { id: string }).id}`)).toBeVisible();
});
