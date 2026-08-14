/**
 * The primary menu is NOT defined here: it is derived per request from the
 * resolved site content (`primaryNav()` in `@/lib/sections`), because the
 * backend may be the one deciding which sections exist. `PublicLayout` resolves
 * it and passes it to Header/Footer as a prop.
 */

/** Legal pages. Always present: they are repo-owned routes, not sections. */
export const FOOTER_NAV = [
  { href: '/policy', label: 'Privacy' },
  { href: '/cookie', label: 'Cookie' },
] as const;
