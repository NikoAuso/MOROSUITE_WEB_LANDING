import { describe, it, expect } from 'vitest';
import { formatSeasonDate, whatsappUrl, safeHref, toAbsoluteUrl, mapsUrl } from './format';

describe('formatSeasonDate', () => {
  it('returns null for null input', () => {
    expect(formatSeasonDate(null, 'it-IT')).toBeNull();
  });

  it('formats an ISO date as an Italian long date', () => {
    expect(formatSeasonDate('2026-06-01', 'it-IT')).toBe('1 giugno 2026');
    expect(formatSeasonDate('2026-09-15', 'it-IT')).toBe('15 settembre 2026');
  });

  it('keeps the calendar day (parses local midnight, not UTC)', () => {
    // The `T00:00:00` local parse must keep day 1, not roll back to 31 of the
    // previous month as a bare UTC `new Date("2026-01-01")` could in some zones.
    expect(formatSeasonDate('2026-01-01', 'it-IT')).toBe('1 gennaio 2026');
  });

  it('returns null for a malformed date instead of the string "Invalid Date"', () => {
    expect(formatSeasonDate('2026-13-40', 'it-IT')).toBeNull();
    expect(formatSeasonDate('not-a-date', 'it-IT')).toBeNull();
  });
});

describe('whatsappUrl', () => {
  it('returns null for null/undefined/empty input', () => {
    expect(whatsappUrl(null)).toBeNull();
    expect(whatsappUrl(undefined)).toBeNull();
    expect(whatsappUrl('')).toBeNull();
  });

  it('returns null when the value has no digits (avoids a numberless wa.me link)', () => {
    expect(whatsappUrl('N/A')).toBeNull();
    expect(whatsappUrl('da definire')).toBeNull();
  });

  it('strips non-digits and builds the wa.me URL', () => {
    expect(whatsappUrl('+39 333 123 4567')).toBe('https://wa.me/393331234567');
  });
});

describe('safeHref', () => {
  it('returns null for null/undefined/empty', () => {
    expect(safeHref(null)).toBeNull();
    expect(safeHref(undefined)).toBeNull();
    expect(safeHref('')).toBeNull();
  });

  it('rejects dangerous schemes', () => {
    expect(safeHref('javascript:alert(1)')).toBeNull();
    expect(safeHref('data:text/html,<script>')).toBeNull();
    expect(safeHref('vbscript:msgbox')).toBeNull();
  });

  it('passes through safe absolute and relative URLs', () => {
    expect(safeHref('https://app.example/booking')).toBe('https://app.example/booking');
    expect(safeHref('mailto:info@example.com')).toBe('mailto:info@example.com');
    expect(safeHref('tel:+390001234567')).toBe('tel:+390001234567');
    expect(safeHref('/policy')).toBe('/policy');
    expect(safeHref('#orari')).toBe('#orari');
  });
});

describe('toAbsoluteUrl', () => {
  const site = 'https://example.com';

  it('resolves a root-relative path against the site URL', () => {
    expect(toAbsoluteUrl('/brand/og.svg', site)).toBe('https://example.com/brand/og.svg');
  });

  it('leaves an already-absolute URL untouched', () => {
    // The regression this guards: the old `${siteUrl}${value}` concatenation
    // produced "https://example.comhttps://cdn.example/og.png" here.
    expect(toAbsoluteUrl('https://cdn.example/og.png', site)).toBe('https://cdn.example/og.png');
  });

  it('does not double the origin when the site URL has a trailing slash', () => {
    expect(toAbsoluteUrl('/brand/og.svg', 'https://example.com/')).toBe(
      'https://example.com/brand/og.svg',
    );
  });

  it('returns the input unchanged when no absolute URL can be built', () => {
    expect(toAbsoluteUrl('/brand/og.svg', 'not-a-url')).toBe('/brand/og.svg');
  });
});

describe('mapsUrl', () => {
  it('prefers the backend pin, falls back to a locality search, else null', () => {
    expect(mapsUrl({ google_maps_url: 'https://maps.app.goo.gl/x', locality: 'Milano' })).toBe(
      'https://maps.app.goo.gl/x',
    );
    expect(mapsUrl({ locality: 'Milano', region: 'MI' })).toBe(
      'https://www.google.com/maps/search/?api=1&query=Milano%20MI',
    );
    expect(mapsUrl({ google_maps_url: 'javascript:alert(1)' })).toBeNull();
  });
});
