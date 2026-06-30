import { describe, it, expect } from 'vitest';
import { formatSeasonDate, whatsappUrl, safeHref } from './format';

describe('formatSeasonDate', () => {
  it('returns null for null input', () => {
    expect(formatSeasonDate(null)).toBeNull();
  });

  it('formats an ISO date as an Italian long date', () => {
    expect(formatSeasonDate('2026-06-01')).toBe('1 giugno 2026');
    expect(formatSeasonDate('2026-09-15')).toBe('15 settembre 2026');
  });

  it('keeps the calendar day (parses local midnight, not UTC)', () => {
    // The `T00:00:00` local parse must keep day 1, not roll back to 31 of the
    // previous month as a bare UTC `new Date("2026-01-01")` could in some zones.
    expect(formatSeasonDate('2026-01-01')).toBe('1 gennaio 2026');
  });

  it('returns null for a malformed date instead of the string "Invalid Date"', () => {
    expect(formatSeasonDate('2026-13-40')).toBeNull();
    expect(formatSeasonDate('not-a-date')).toBeNull();
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
