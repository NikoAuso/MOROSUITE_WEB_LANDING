/**
 * Shape of the homepage: which sections exist, in what order, and the copy
 * each one renders.
 *
 * `SiteContent` is provided by committed files only — today `site.content.ts`,
 * with per-vertical presets planned under `presets/` (see docs/VISIONE.md).
 * Everything is type-checked at build time, so there is no runtime validation
 * layer: a malformed structure is a compile error, not a fallback.
 *
 * `src/pages/index.astro` walks the enabled `sections` in order and mounts one
 * component per entry, so disabling a section removes it from the page, from
 * the navigation and from the anchor targets in one edit.
 */

/** An entry in the header/footer menu, derived from the enabled sections. */
export type NavEntry = { href: string; label: string };

/** A single icon + heading + body triplet, used by the feature and service grids. */
export type IconItem = {
  /** Iconify name resolved by `src/components/Icon.astro`, e.g. `fa6-solid:droplet`. */
  icon: string;
  title: string;
  text: string;
};

/** An animated counter in the features section. */
export type StatItem = {
  /** Target value as a string so "1.5" keeps its precision. */
  target: string;
  decimals: number;
  prefix?: string;
  suffix: string;
  label: string;
};

/** Link rendered by an `<ErrorState>` when a backend-driven section has no data. */
export type FallbackCta = { href: string; label: string };

export type HeroContent = {
  /**
   * Background photo behind the gradient, as a root-relative path served from
   * public/. Optional: without it the gradient alone carries the hero. Ship a
   * pre-sized file (~1920w) — public/ assets are served as-is, not optimized.
   */
  image?: { src: string };
  title: string;
  /** Second line, rendered in the accent colour. */
  highlight: string;
  lead: string;
  /** Anchor button beside the booking CTA. */
  secondaryCta: NavEntry;
  howItWorks: {
    title: string;
    subtitle: string;
    steps: Array<{ title: string; text: string }>;
  };
};

export type FeaturesContent = {
  eyebrow: string;
  title: string;
  lead: string;
  items: IconItem[];
  stats: StatItem[];
};

export type HoursContent = {
  eyebrow: string;
  title: string;
  /** Shown when the backend returns no schedule. */
  fallbackCta?: FallbackCta;
};

export type PricingContent = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Short line under the lead, e.g. "Tutti i prezzi si intendono a persona." */
  note?: string;
  /** Longer highlighted disclaimer, e.g. a statutory discount. Omit to hide. */
  disclaimer?: string;
  infoCtaLabel: string;
  priceListSubtitle: string;
  entranceTabLabel: string;
  passTabLabel: string;
  ageColumnLabel: string;
  weekdayColumnLabel: string;
  weekendColumnLabel: string;
  priceColumnLabel: string;
  noUmbrellaNote: string;
  emptyEntrances: string;
  emptyPasses: string;
  fallbackCta?: FallbackCta;
};

export type ServicesContent = {
  eyebrow: string;
  title: string;
  lead: string;
  items: IconItem[];
  /** Two highlighted cards beside the list. `image` is a path under public/. */
  cards: Array<{ title: string; subtitle: string; image: string; alt: string }>;
};

export type RulesContent = {
  eyebrow: string;
  title: string;
  lead: string;
  note: { title: string; text: string };
  help: { title: string; text: string; whatsappLabel: string; footnote: string };
  groups: Array<{
    title: string;
    badge?: string;
    /** Colour of the bullet and badge. Maps to a fixed palette in the component. */
    tone: 'positive' | 'negative' | 'neutral';
    items: string[];
  }>;
};

export type HighlightContent = {
  title: string;
  lead: string;
  items: Array<{ title: string; text: string }>;
  images: Array<{ src: string; alt: string; wide?: boolean }>;
};

/** Fields every anchored section shares. `id` doubles as the anchor target. */
type Anchored = {
  id: string;
  /** Omit to keep the section on the page but out of the menu. */
  navLabel?: string;
  enabled: boolean;
};

export type Section =
  | ({ type: 'hero'; enabled: boolean } & { data: HeroContent })
  | ({ type: 'features' } & Anchored & { data: FeaturesContent })
  | ({ type: 'hours' } & Anchored & { data: HoursContent })
  | ({ type: 'pricing' } & Anchored & { data: PricingContent })
  | ({ type: 'services' } & Anchored & { data: ServicesContent })
  | ({ type: 'rules' } & Anchored & { data: RulesContent })
  | ({ type: 'highlight' } & Anchored & { data: HighlightContent });

/**
 * Homepage `<head>` copy. The backend supplies the venue name and tagline;
 * these fill the gaps around them and cover the case where it supplies neither.
 */
export type HomeMeta = {
  /** Appended after the venue name, e.g. "Prenota ingresso e ombrellone". */
  titleSuffix: string;
  /** Used as the venue name when the backend returns neither name nor short_name. */
  siteNameFallback: string;
  /** Meta description when the backend has no tagline. `%s` is the venue name. */
  descriptionTemplate: string;
};

export type SiteContent = {
  meta: HomeMeta;
  sections: readonly Section[];
};

/** Sections to render, in declaration order. */
export function enabledSections(sections: readonly Section[]): Section[] {
  return sections.filter((section) => section.enabled);
}

/** Header/mobile menu entries: enabled, anchored sections that opted into a label. */
export function primaryNav(sections: readonly Section[]): NavEntry[] {
  return enabledSections(sections)
    .filter((section): section is Extract<Section, { id: string }> => 'id' in section)
    .filter((section) => Boolean(section.navLabel))
    .map((section) => ({ href: `/#${section.id}`, label: section.navLabel! }));
}

/**
 * Drop a cross-section link whose target is switched off.
 *
 * The "hours unavailable" state links to pricing and vice versa. Those anchors
 * are written in `site.content.ts` next to the copy, so nothing stops a deploy
 * from disabling the target section and leaving a link that scrolls nowhere.
 * Resolve every such link through here instead of trusting the config.
 */
export function resolveFallbackCta(
  cta: FallbackCta | undefined,
  sections: readonly Section[],
): FallbackCta | undefined {
  if (!cta) return undefined;
  const anchor = cta.href.startsWith('#') ? cta.href.slice(1) : null;
  if (!anchor) return cta;
  const target = enabledSections(sections).find(
    (section) => 'id' in section && section.id === anchor,
  );
  return target ? cta : undefined;
}
