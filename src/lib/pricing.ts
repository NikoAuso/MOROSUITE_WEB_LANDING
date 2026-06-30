/**
 * Keep only the pricing sections that have at least one row.
 *
 * Lets the template hide groups the backend returns empty while staying fully
 * data-driven on whatever rows/labels arrive. When every section is empty the
 * result is `[]`, so the caller renders its "non disponibile" fallback.
 */
export function visiblePricingSections<T extends { rows: readonly unknown[] }>(
  sections: readonly T[],
): T[] {
  return sections.filter((section) => section.rows.length > 0);
}

/**
 * Render a price cell. `isFree` wins over a `null` value: the backend marks a
 * row "Gratis" regardless of the numeric value, so a free row with no price
 * must read "Gratis", not the em-dash that signals "unavailable".
 */
export function formatPrice(value: number | null, isFree: boolean): string {
  if (isFree) return 'Gratis';
  if (value === null) return '—';
  return `€ ${value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Total rendered rows across already-filtered sections — drives the tab badges so they match the list. */
export function countRows(sections: ReadonlyArray<{ rows: readonly unknown[] }>): number {
  return sections.reduce((total, section) => total + section.rows.length, 0);
}
