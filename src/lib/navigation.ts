import { siteContent } from '@content';
import { primaryNav } from '@/lib/sections';
import type { NavEntry } from '@/lib/sections';

/**
 * Header and mobile menu, derived from the enabled sections in
 * `site.content.ts` rather than maintained as a parallel list. Disabling a
 * section therefore also removes its menu entry — the two can no longer drift
 * into an anchor that scrolls nowhere.
 */
export const PRIMARY_NAV: readonly NavEntry[] = primaryNav(siteContent.sections);

/** Legal pages. Always present: they are repo-owned routes, not sections. */
export const FOOTER_NAV = [
  { href: '/policy', label: 'Privacy' },
  { href: '/cookie', label: 'Cookie' },
] as const;
