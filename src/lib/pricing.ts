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

export type PriceFormat = {
  /** BCP-47 locale for the number (site.config.ts `formatting.locale`). */
  locale: string;
  /** Currency symbol/prefix (site.config.ts `formatting.currency`). */
  currency: string;
  /** Copy for backend-flagged free rows (PricingContent.freeLabel). */
  freeLabel: string;
};

/**
 * Render a price cell. `isFree` wins over a `null` value: the backend flags a
 * row free regardless of the numeric value, so a free row with no price must
 * read the free label, not the em-dash that signals "unavailable".
 */
export function formatPrice(value: number | null, isFree: boolean, format: PriceFormat): string {
  if (isFree) return format.freeLabel;
  if (value === null) return '—';
  return `${format.currency} ${value.toLocaleString(format.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Total rendered rows across already-filtered sections — drives the tab badges so they match the list. */
export function countRows(sections: ReadonlyArray<{ rows: readonly unknown[] }>): number {
  return sections.reduce((total, section) => total + section.rows.length, 0);
}
