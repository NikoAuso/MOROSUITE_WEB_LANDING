import { siteContent } from '@content';
import { primaryNav } from '@/lib/sections';

/**
 * Header and mobile menu, derived at build time from the enabled sections in
 * `site.content.ts`. The structure is committed (no runtime source), so a
 * module-scope constant is correct: disabling a section removes its menu entry
 * with the same edit.
 */
export const PRIMARY_NAV = primaryNav(siteContent.sections);

/** Legal pages. Always present: they are repo-owned routes, not sections. */
export const FOOTER_NAV = [
  { href: '/policy', label: 'Privacy' },
  { href: '/cookie', label: 'Cookie' },
] as const;
