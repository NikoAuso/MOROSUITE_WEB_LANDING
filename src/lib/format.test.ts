import { describe, it, expect } from 'vitest';
import { formatSeasonDate } from './format';

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
});
