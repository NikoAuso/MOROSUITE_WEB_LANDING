/**
 * Format an ISO `YYYY-MM-DD` date as an Italian long date (e.g. "1 giugno 2026").
 *
 * Parses with an explicit `T00:00:00` so the value is read in LOCAL time and
 * never shifts a day — a bare `new Date("2026-06-01")` is parsed as UTC and can
 * render as the previous day in negative-offset timezones. Returns `null` for
 * `null`/empty input so callers can hide the field.
 */
export function formatSeasonDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00`).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
