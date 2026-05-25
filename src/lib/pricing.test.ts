import { describe, it, expect } from 'vitest';
import { visiblePricingSections } from './pricing';

describe('visiblePricingSections', () => {
  it('drops sections that have no rows', () => {
    const sections = [
      { label: 'Intero', rows: [{ label: 'Adulto' }] },
      { label: 'Vuoto', rows: [] },
    ];
    expect(visiblePricingSections(sections)).toEqual([
      { label: 'Intero', rows: [{ label: 'Adulto' }] },
    ]);
  });

  it('returns an empty array when every section is empty (caller shows the fallback)', () => {
    expect(
      visiblePricingSections([
        { label: 'A', rows: [] },
        { label: 'B', rows: [] },
      ]),
    ).toEqual([]);
  });

  it('keeps every section when all have rows', () => {
    const sections = [
      { label: 'Intero', rows: [{ label: 'Adulto' }] },
      { label: 'Pomeridiano', rows: [{ label: 'Adulto' }] },
    ];
    expect(visiblePricingSections(sections)).toEqual(sections);
  });
});
