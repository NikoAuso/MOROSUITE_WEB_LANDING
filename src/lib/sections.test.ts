import { describe, it, expect } from 'vitest';
import { enabledSections, primaryNav, resolveFallbackCta } from './sections';
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
