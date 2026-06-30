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
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Build a `https://wa.me/<digits>` URL from a backend-supplied contact value.
 *
 * Gates on the digit-stripped result, not the raw value: a non-numeric
 * placeholder (e.g. "N/A", "da definire") yields `null` so the caller hides the
 * button instead of linking to a numberless, broken wa.me page.
 */
export function whatsappUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const digits = value.replace(/[^0-9]/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

const SAFE_HREF_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

/**
 * Return a backend-supplied URL only when it uses a safe scheme, else `null`.
 *
 * Guards every `href` built from backend data against `javascript:`/`data:`
 * injection (defence in depth: the backend is Bearer-authed and trusted, but
 * unsanitized external data should never reach a clickable href). Relative URLs
 * and fragments resolve to the safe base and pass through unchanged.
 */
export function safeHref(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const scheme = new URL(url, 'https://base.invalid').protocol;
    return SAFE_HREF_SCHEMES.includes(scheme) ? url : null;
  } catch {
    return null;
  }
}
