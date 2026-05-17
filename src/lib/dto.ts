/**
 * Public API contract consumed by this site template.
 *
 * Any backend that wants to drive this template MUST expose JSON endpoints
 * matching the shapes below, under the single absolute base URL provided via
 * the `API_BASE_URL` env var (read at build time by `src/lib/config.ts`).
 * The backend is a fully external service: this template does not host any
 * part of it and the only link is the value of `API_BASE_URL`.
 *
 * Endpoint mapping (relative to the configured base URL):
 *   GET /site                  → SitePayload
 *   GET /site/opening-hours    → OpeningHoursPayload
 *   GET /site/pricing          → PricingPayload
 *   GET /legal/{doc}           → LegalPayload   (doc ∈ LegalDocumentName)
 *   GET /transparency          → TransparencyPayload
 *   GET /seo/structured-data   → SeoPayload
 *
 * Responses MUST be `application/json`. On failure the server SHOULD
 * return an `ApiError` payload with an HTTP status >= 400; the template
 * surfaces such failures as build errors.
 *
 * Any drift between a backend response and the shapes below is a build-break
 * here, by design: a type mismatch is caught at the template repo's CI level
 * before a broken site ships.
 *
 * Convention: empty/unknown values SHOULD be returned as `null` rather than
 * omitted, so the template can safely render fallback UI without optional-chain
 * gymnastics.
 */

// ---------------------------------------------------------------------------
// Site (identity, contacts, address, GDPR, social, season)
// ---------------------------------------------------------------------------

/**
 * Identity and presentation data for the site this deploy serves.
 *
 * Returned by `GET /site`. Drives the public site header/footer, hero copy,
 * GDPR mentions, social links and season metadata.
 */
export type SitePayload = {
  /** Stable slug used to identify the site against the backend. MUST match the value of `siteSlug` in `site.config.ts`. */
  slug: string | null;

  /** Full commercial name (used as default page title fallback and OG site name). */
  name: string | null;

  /** Short/marketing name used in header logo and tight UI spots. */
  short_name: string | null;

  /** One-line claim used as default meta description fallback. */
  tagline: string | null;

  /** ISO-639-1 language codes the site declares support for (e.g. `["it", "en"]`). */
  languages: string[];

  /** Default ISO-639-1 locale, used for the `<html lang>` and for canonical hreflang. */
  default_locale: string;

  /** Whether the customer-facing booking flow on the companion app is currently enabled. */
  online_bookings_enabled: boolean;

  /** Whether the booking flow allows arbitrary weekdays (false = restricted weekend/special-day calendar). */
  customer_can_book_any_weekday: boolean;

  /** Direct contact endpoints surfaced in footer and contact CTAs. All fields optional. */
  contacts: {
    email?: string | null;
    phone?: string | null;
    /** E.164 phone (or local format) used to build a `https://wa.me/<digits>` URL — non-digit chars are stripped client-side. */
    whatsapp?: string | null;
    /** Marketing website distinct from this template, if any. */
    website?: string | null;
  };

  /** Postal address. Used by footer, transparency page and schema.org markup. */
  address: {
    street?: string | null;
    locality?: string | null;
    region?: string | null;
    postal_code?: string | null;
    /** ISO-3166-1 alpha-2 (`IT`, `FR`, ...). */
    country?: string | null;
    /** Optional canonical Maps URL; if missing the template builds one from locality+region. */
    google_maps_url?: string | null;
  };

  /** GDPR-relevant identity, surfaced verbatim on legal and transparency pages. */
  gdpr: {
    /** Legal name of the data controller ("Titolare del trattamento"). */
    titolare: string | null;
    /** Mailbox for art. 15–22 GDPR requests. */
    email_privacy: string | null;
    /** Mailbox for coordinated vulnerability disclosure. */
    email_security: string | null;
  };

  /** Public profile links rendered in the footer; missing/null entries hide their icon. */
  social: {
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
  };

  /** Coarse seasonal window (ISO-8601 dates) used by structured data and seasonal copy. */
  season: {
    start_date: string | null;
    end_date: string | null;
  };

  /** Human-formatted seasonal cards (e.g. `{ label: "Stagione estiva", value: "06/06 – 14/09" }`) rendered in the opening-hours block. Null hides the block. */
  season_dates: Array<{ label: string; value: string }> | null;

  /**
   * Contextual links surfaced in the UI. Each entry is a `{ label, url }` pair
   * or `null` to hide it. Labels are rendered verbatim — the backend owns the
   * copy, so multilingual deploys can swap them without touching the template.
   */
  links: {
    /** Primary booking CTA (header, hero, pricing tab, bar, regolamento). */
    booking: { label: string; url: string } | null;
    /** Customer login CTA (footer, sitemap). */
    login: { label: string; url: string } | null;
    /** Customer registration CTA (sitemap). */
    register: { label: string; url: string } | null;
    /** External link to the parent hotel or sister property (header + sitemap). */
    hotel: { label: string; url: string } | null;
  };
};

// ---------------------------------------------------------------------------
// Opening hours
// ---------------------------------------------------------------------------

/**
 * Weekly opening schedule plus the timezone the schedule is expressed in.
 *
 * Returned by `GET /site/opening-hours`. The template uses `timezone` to
 * compute the "today" highlight client-side, so callers SHOULD return a valid
 * IANA zone (e.g. `Europe/Rome`).
 */
export type OpeningHoursPayload = {
  /**
   * Array of 7 entries (one per weekday). MAY be `null` when no schedule is
   * configured yet — in that case the opening-hours block is hidden.
   */
  daily_hours: Array<{
    /** Weekday key (lowercase English). Used to match against `Date#toLocaleDateString(weekday: 'long')`. */
    key: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    /** Localised label (e.g. "Lunedì"). */
    label: string;
    /** Time slots open on this day. Empty array iff `closed: true`. */
    intervals: Array<{
      /** Slot category — drives copy ("Mattina"/"Pomeriggio"/"Sera"). */
      slot: 'morning' | 'afternoon' | 'evening';
      /** Localised slot label. */
      label: string;
      /** Opening time in `HH:mm` (24h) format. */
      open: string;
      /** Closing time in `HH:mm` (24h) format. */
      close: string;
    }>;
    /** Whether the site is closed all day. When true, `intervals` SHOULD be empty. */
    closed: boolean;
  }> | null;

  /** IANA timezone identifier the schedule is expressed in (e.g. `Europe/Rome`). */
  timezone: string;
};

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

/**
 * Active price list. Returned by `GET /site/pricing`.
 *
 * The template renders two tabs: single-entrance prices and passes/season tickets.
 * Sections allow grouping rows under a common label (e.g. "Adulti", "Bambini").
 */
export type PricingPayload = {
  /** Display name of the active price list (e.g. "Listino 2026"). Null = no active list. */
  active_price_list_name: string | null;

  /** True when the list contains at least one entrance or pass row. When false, the template renders a "not available yet" placeholder. */
  has_prices: boolean;

  /** Count of single-entrance rows across all sections (drives the tab badge). */
  entrance_count: number;

  /** Count of pass rows across all sections (drives the tab badge). */
  pass_count: number;

  /** Single-entrance prices, grouped by section. */
  entrance_sections: Array<{
    /** Section heading (e.g. "Adulti"). */
    label: string;
    rows: Array<{
      /** Row label (e.g. "Intero", "Ridotto"). */
      label: string;
      /** Optional age range or qualifier shown under the label (e.g. "0–3 anni"). */
      range: string | null;
      /** Weekday price in the currency major unit (e.g. euros). `null` renders as em-dash. */
      weekday_value: number | null;
      /** Weekend price in the currency major unit. `null` renders as em-dash. */
      weekend_value: number | null;
      /** Marks the weekday price as "Gratis" regardless of `weekday_value`. */
      weekday_is_free: boolean;
      /** Marks the weekend price as "Gratis" regardless of `weekend_value`. */
      weekend_is_free: boolean;
    }>;
  }>;

  /** Passes/season tickets, grouped by section. */
  pass_sections: Array<{
    label: string;
    /** Whether this pass type allows umbrella booking on the companion app. Drives a fine-print note in the UI. */
    allows_umbrella_booking: boolean;
    rows: Array<{
      label: string;
      range: string | null;
      /** Pass price in the currency major unit. `null` renders as em-dash. */
      value: number | null;
      /** Marks the pass as "Gratis" regardless of `value`. */
      is_free: boolean;
    }>;
  }>;
};

// ---------------------------------------------------------------------------
// Legal documents (terms, privacy, cookie, internal regulations)
// ---------------------------------------------------------------------------

/** Closed set of legal documents the template knows how to render. */
export type LegalDocumentName = 'terms' | 'policy' | 'cookie' | 'regolamento';

/**
 * A single versioned legal document. Returned by `GET /legal/{doc}`.
 *
 * **Trust boundary**: `body` is rendered through `marked` and inserted via
 * `set:html` WITHOUT sanitization. Only serve bodies authored by trusted
 * internal authors, or add a sanitizer before changing this contract.
 */
export type LegalPayload = {
  /** Echo of the requested document slug. */
  doc: LegalDocumentName;

  /** Free-form version string (e.g. `1.3.0`, `2026-01`). Shown verbatim. */
  version: string;

  /** ISO-8601 date the version became effective. `null` hides the date badge. */
  effective_date: string | null;

  /** Body format. Currently only `markdown` is supported. */
  format: 'markdown';

  /** Page title (h1) and OG title. */
  title: string;

  /** Document body in the format declared by `format`. Trust boundary, see above. */
  body: string;
};

// ---------------------------------------------------------------------------
// Transparency page
// ---------------------------------------------------------------------------

/**
 * Aggregated payload for the `/trasparenza` page. Returned by `GET /transparency`.
 *
 * Most fields override the corresponding `SitePayload.gdpr` / `SitePayload.contacts`
 * values, so a backend can decouple "who is the data controller for GDPR purposes"
 * from "what does the homepage display" if needed.
 */
export type TransparencyPayload = {
  /** Overrides `SitePayload.gdpr.titolare` on the transparency page. */
  titolare: string | null;

  /** Three contact channels the transparency page surfaces as separate cards. */
  contacts: {
    /** General-purpose mailbox (commercial, info). */
    info?: string | null;
    /** GDPR requests mailbox — overrides `SitePayload.gdpr.email_privacy`. */
    privacy?: string | null;
    /** Coordinated disclosure mailbox — overrides `SitePayload.gdpr.email_security`. */
    security?: string | null;
  };

  /**
   * Nested hosting-providers map. Top-level keys are categories (e.g. `application`,
   * `analytics`); inner keys are arbitrary field labels (e.g. `provider`, `region`,
   * `transfer_basis`). Currently not rendered by the default UI but kept for clients
   * that want a more detailed hosting section.
   */
  hosting: Record<string, Record<string, string>>;

  /** Free-form list of GDPR rights the transparency page may surface (currently unused by default UI). */
  rights: string[];

  /** Pointers to the legal documents (terms/policy/cookie/regolamento) including a public URL for download. */
  legal_documents: Array<{ doc: LegalDocumentName; version: string; url: string }>;
};

// ---------------------------------------------------------------------------
// SEO / schema.org structured data
// ---------------------------------------------------------------------------

/**
 * Pre-built JSON-LD payload injected into every page's `<head>`.
 *
 * Returned by `GET /seo/structured-data`. The template overrides `url` and
 * `image` at render time with the canonical site URL and OG image (see
 * `src/lib/seo.ts`).
 *
 * Currently typed for a `SwimmingPool` entity since this template targets
 * pool facilities; future verticals MAY widen `@type`.
 */
export type SeoPayload = {
  '@context': 'https://schema.org';
  '@type': 'SwimmingPool';
  name: string | null;
  /** Placeholder URL — replaced at render time. */
  url: string;
  /** Placeholder image list — replaced at render time. */
  image: string[];
  address: {
    '@type': 'PostalAddress';
    streetAddress: string | null;
    addressLocality: string | null;
    addressRegion: string | null;
    postalCode: string | null;
    addressCountry: string | null;
  };
  telephone: string | null;
  /** Service area (e.g. country name or region). */
  areaServed: string;
  /** ISO-639-1 codes mirroring `SitePayload.languages`. */
  availableLanguage: string[];
};

// ---------------------------------------------------------------------------
// Error shape
// ---------------------------------------------------------------------------

/**
 * Standard error envelope. Returned by the backend with an HTTP status >= 400.
 *
 * The template tolerates fetch failures: instead of aborting the build, the
 * affected wrappers in `src/lib/api.ts` return a placeholder payload from
 * `src/lib/placeholders.ts` so the page still renders with dummy content.
 */
export type ApiError = {
  error: { code: string; message: string };
};
