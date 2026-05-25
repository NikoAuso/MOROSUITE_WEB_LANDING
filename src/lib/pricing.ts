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
