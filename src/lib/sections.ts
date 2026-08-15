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
  /** Anchor button beside the booking CTA. Omit to show the CTA alone. */
  secondaryCta?: NavEntry;
  /**
   * The card beside the copy. Omit it and the hero is copy-only. Two shapes,
   * decided by the items: give every item an `icon` and it renders as a bullet
   * list (perks, "what to expect"); leave the icons out and it renders as
   * numbered steps joined by arrows (a real booking flow).
   */
  card?: {
    title: string;
    subtitle?: string;
    items: Array<{ icon?: string; title: string; text: string }>;
  };
};

export type FeaturesContent = {
  eyebrow: string;
  title: string;
  lead: string;
  items: IconItem[];
  stats: StatItem[];
};

/**
 * Where a data-driven section gets its payload. Omit to inherit the deploy
 * default (`dataSource` in site.config.ts): 'backend' fetches live from the
 * gestionale, 'static' serves the committed STATIC_DATA from site.content.ts.
 */
export type SectionDataSource = 'backend' | 'static';

export type HoursContent = {
  /** Overrides the deploy-level data source for this section only. */
  source?: SectionDataSource;
  eyebrow: string;
  title: string;
  /** Badge on the current weekday (e.g. "Oggi"). */
  todayLabel: string;
  /** Shown on days with no intervals (e.g. "Chiuso"). */
  closedLabel: string;
  /**
   * Labels for the season cards. The cards render only when BOTH these labels
   * and the payload's season dates exist — omit for year-round venues.
   */
  seasonLabels?: { start: string; end: string };
  /** Shown when the backend returns no schedule. */
  fallbackCta?: FallbackCta;
};

export type PricingContent = {
  /** Overrides the deploy-level data source for this section only. */
  source?: SectionDataSource;
  /** Iconify name shown beside the price-list title (e.g. "fa6-solid:ticket"). */
  icon: string;
  /** Label for rows flagged free by the backend (e.g. "Gratis"). */
  freeLabel: string;
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

/**
 * A menu of courses and dishes (ristorazione/bar). Prices are free-form
 * strings rendered verbatim ("€ 12", "12,50", "da 8"): the author owns
 * currency and formatting, so the component needs no locale machinery.
 */
export type MenuContent = {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Fine print under the courses (allergeni, coperto, ...). */
  footnote?: string;
  /** Link to the full menu elsewhere (PDF, external page). Omit for none. */
  externalCta?: { href: string; label: string };
  courses: Array<{
    label: string;
    /**
     * Groups courses under a tab ("Cucina" / "Cantina", "Caffetteria" /
     * "Cocktail"). Tabs appear in first-seen order and only when at least one
     * course declares one; without JS every panel stays visible.
     */
    tab?: string;
    dishes: Array<{ name: string; description?: string; price?: string }>;
  }>;
};

/** A photo-driven grid. Text is optional by design: images can carry it alone. */
export type GalleryContent = {
  eyebrow?: string;
  title?: string;
  lead?: string;
  images: Array<{ src: string; alt: string; caption?: string; wide?: boolean }>;
};

export type HighlightContent = {
  title: string;
  lead: string;
  items: Array<{ title: string; text: string }>;
  images: Array<{ src: string; alt: string; wide?: boolean }>;
};

export type FaqContent = {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Rendered as native <details>/<summary>: no script, one open at a time is not enforced. */
  items: Array<{ question: string; answer: string }>;
};

export type TestimonialsContent = {
  eyebrow: string;
  title: string;
  lead?: string;
  items: Array<{
    quote: string;
    author: string;
    /** Context under the name: date, room type, "cliente dal 2019"... */
    meta?: string;
    /** 1–5 stars; omit to show no rating. Copy-only: never emitted as schema.org Review. */
    rating?: 1 | 2 | 3 | 4 | 5;
  }>;
};

/**
 * "Come raggiungerci": the address and the Maps link come from the backend
 * (`site.address`); the content adds the practical items (transport, parking,
 * distances) and an optional photo or static map (a file under public/ — no
 * third-party iframe, the CSP stays tight).
 */
export type LocationContent = {
  eyebrow: string;
  title: string;
  lead?: string;
  items: IconItem[];
  /** Label of the button linking to Maps. */
  mapsLabel: string;
  image?: { src: string; alt: string };
};

/** A narrative split: photo beside a few paragraphs of prose. */
export type StoryContent = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: { src: string; alt: string };
  /** Which side the photo sits on desktop. Default 'left'. */
  imageSide?: 'left' | 'right';
};

/** Room-type cards (hotel): photo, size, amenities, "da €" and the booking CTA. */
export type RoomsContent = {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Fine print under the cards (tasse, tassa di soggiorno, ...). */
  footnote?: string;
  items: Array<{
    name: string;
    description: string;
    /** Free-form, author-owned: "da € 95", "€ 120 / notte". */
    price?: string;
    /** Short facts shown as chips: "22 m²", "2 ospiti", "Balcone". */
    facts: string[];
    image: { src: string; alt: string };
  }>;
};

/** Fields every anchored section shares. `id` doubles as the anchor target. */
type Anchored = {
  id: string;
  /** Omit to keep the section on the page but out of the menu. */
  navLabel?: string;
};

/**
 * A section that renders. `data` is required here and only here: the renderer
 * receives `EnabledSection`, so every component gets its content guaranteed.
 */
export type EnabledSection = { enabled: true } & (
  | { type: 'hero'; data: HeroContent }
  | ({ type: 'features' } & Anchored & { data: FeaturesContent })
  | ({ type: 'hours' } & Anchored & { data: HoursContent })
  | ({ type: 'pricing' } & Anchored & { data: PricingContent })
  | ({ type: 'services' } & Anchored & { data: ServicesContent })
  | ({ type: 'rules' } & Anchored & { data: RulesContent })
  | ({ type: 'highlight' } & Anchored & { data: HighlightContent })
  | ({ type: 'menu' } & Anchored & { data: MenuContent })
  | ({ type: 'gallery' } & Anchored & { data: GalleryContent })
  | ({ type: 'faq' } & Anchored & { data: FaqContent })
  | ({ type: 'testimonials' } & Anchored & { data: TestimonialsContent })
  | ({ type: 'location' } & Anchored & { data: LocationContent })
  | ({ type: 'story' } & Anchored & { data: StoryContent })
  | ({ type: 'rooms' } & Anchored & { data: RoomsContent })
);

/**
 * A switched-off section: everything but `type` is optional, so disabling a
 * section never requires a dummy `data` object — flip `enabled` and delete
 * the rest, or keep it around for a later re-enable.
 */
export type DisabledSection = {
  type: EnabledSection['type'];
  enabled: false;
  id?: string;
  navLabel?: string;
  data?: unknown;
};

export type Section = EnabledSection | DisabledSection;

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
export function enabledSections(sections: readonly Section[]): EnabledSection[] {
  return sections.filter((section): section is EnabledSection => section.enabled);
}

/**
 * Header/mobile menu entries: enabled, anchored sections that opted into a label.
 * `basePath` is the page hosting the anchors — `/` for the deploy homepage,
 * `/demo/<preset>` for the preset showcase.
 */
export function primaryNav(sections: readonly Section[], basePath = '/'): NavEntry[] {
  return enabledSections(sections)
    .filter((section): section is Extract<EnabledSection, { id: string }> => 'id' in section)
    .filter((section) => Boolean(section.navLabel))
    .map((section) => ({ href: `${basePath}#${section.id}`, label: section.navLabel! }));
}

/**
 * Group a menu's courses under their tabs, in first-seen order. Courses that
 * declare no tab fall into the first group, so a partially tagged menu still
 * renders whole; with no tabs at all the result is one untabbed group.
 */
export function menuGroups(
  courses: MenuContent['courses'],
): Array<{ tab: string | null; courses: MenuContent['courses'] }> {
  const tabs = [...new Set(courses.map((course) => course.tab).filter(Boolean))] as string[];
  if (tabs.length === 0) return [{ tab: null, courses }];
  return tabs.map((tab) => ({
    tab,
    courses: courses.filter((course) => (course.tab ?? tabs[0]) === tab),
  }));
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
