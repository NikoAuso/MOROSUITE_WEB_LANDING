import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { enabledSections, menuGroups, primaryNav, resolveFallbackCta } from './sections';
import type { Section } from './sections';

const hero = { type: 'hero', enabled: true, data: {} } as unknown as Section;

const anchored = (
  id: string,
  overrides: Partial<{ enabled: boolean; navLabel: string }> = {},
): Section =>
  ({
    type: 'features',
    id,
    enabled: true,
    navLabel: id,
    data: {},
    ...overrides,
  }) as unknown as Section;

describe('enabledSections', () => {
  it('keeps declaration order and drops disabled entries', () => {
    const sections = [anchored('a'), anchored('b', { enabled: false }), anchored('c')];
    expect(enabledSections(sections).map((s) => ('id' in s ? s.id : s.type))).toEqual(['a', 'c']);
  });
});

describe('primaryNav', () => {
  it('builds one entry per enabled, labelled section', () => {
    const sections = [hero, anchored('orari', { navLabel: 'Orari' }), anchored('bar')];
    expect(primaryNav(sections)).toEqual([
      { href: '/#orari', label: 'Orari' },
      { href: '/#bar', label: 'bar' },
    ]);
  });

  it('omits a disabled section, so the menu cannot outlive its anchor', () => {
    const sections = [anchored('orari'), anchored('bar', { enabled: false })];
    expect(primaryNav(sections).map((e) => e.href)).toEqual(['/#orari']);
  });

  it('omits sections without a navLabel and the hero, which has no anchor', () => {
    const sections = [hero, anchored('legal', { navLabel: undefined })];
    expect(primaryNav(sections)).toEqual([]);
  });

  it('anchors to the given base path, so a showcase page keeps its own menu', () => {
    expect(primaryNav([anchored('orari')], '/demo/bar').map((e) => e.href)).toEqual([
      '/demo/bar#orari',
    ]);
  });
});

describe('resolveFallbackCta', () => {
  const sections = [anchored('prezzi'), anchored('regolamento', { enabled: false })];

  it('keeps a link whose target section is enabled', () => {
    const cta = { href: '#prezzi', label: 'Vai ai prezzi' };
    expect(resolveFallbackCta(cta, sections)).toEqual(cta);
  });

  it('drops a link pointing at a disabled section rather than scrolling nowhere', () => {
    expect(resolveFallbackCta({ href: '#regolamento', label: 'x' }, sections)).toBeUndefined();
  });

  it('drops a link pointing at a section that does not exist at all', () => {
    expect(resolveFallbackCta({ href: '#inesistente', label: 'x' }, sections)).toBeUndefined();
  });

  it('leaves non-anchor links alone', () => {
    const cta = { href: '/policy', label: 'Privacy' };
    expect(resolveFallbackCta(cta, sections)).toEqual(cta);
  });

  it('returns undefined when there is no link to resolve', () => {
    expect(resolveFallbackCta(undefined, sections)).toBeUndefined();
  });
});

describe('index.astro source wiring (file guard)', () => {
  // Vitest cannot execute .astro frontmatter, and no committed preset sets a
  // per-section source, so the only production consumer of the `source`
  // parameter is unreachable by behavioural tests: a mutant that drops the
  // argument (api.openingHours() bare) survived every suite (review
  // 14/08/2026). This tripwire pins the plumbing textually until the wiring
  // becomes executable by tests.
  it('index.astro forwards each section override to its api call', () => {
    const src = readFileSync('src/pages/index.astro', 'utf8');
    expect(src).toContain('api.openingHours(hoursSection.data.source)');
    expect(src).toContain('api.pricing(pricingSection.data.source)');
  });
});

describe('menuGroups', () => {
  const course = (label: string, tab?: string) => ({ label, tab, dishes: [] });

  it('returns one untabbed group when no course declares a tab', () => {
    const courses = [course('Antipasti'), course('Primi')];
    expect(menuGroups(courses)).toEqual([{ tab: null, courses }]);
  });

  it('groups by tab in first-seen order', () => {
    const groups = menuGroups([
      course('Signature', 'Cocktail'),
      course('Analcolici', 'Soft'),
      course('Classici', 'Cocktail'),
    ]);
    expect(groups.map((g) => g.tab)).toEqual(['Cocktail', 'Soft']);
    expect(groups[0]!.courses.map((c) => c.label)).toEqual(['Signature', 'Classici']);
  });

  it('drops an untabbed course into the first group instead of losing it', () => {
    const groups = menuGroups([course('Cocktail', 'Bar'), course('Sfusi')]);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.courses.map((c) => c.label)).toEqual(['Cocktail', 'Sfusi']);
  });
});
