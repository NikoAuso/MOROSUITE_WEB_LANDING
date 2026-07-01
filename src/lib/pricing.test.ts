import { describe, it, expect } from 'vitest';
import { visiblePricingSections, formatPrice, countRows } from './pricing';

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

describe('formatPrice', () => {
  it('shows "Gratis" for a free row even when the value is null', () => {
    expect(formatPrice(null, true)).toBe('Gratis');
    expect(formatPrice(0, true)).toBe('Gratis');
  });

  it('shows the em-dash only for a non-free null value', () => {
    expect(formatPrice(null, false)).toBe('—');
  });

  it('formats a numeric value as euros', () => {
    expect(formatPrice(10, false)).toBe('€ 10,00');
  });
});

describe('countRows', () => {
  it('sums the rows across sections so the badge matches the rendered list', () => {
    expect(countRows([{ rows: [{}, {}] }, { rows: [{}] }])).toBe(3);
    expect(countRows([])).toBe(0);
  });
});
