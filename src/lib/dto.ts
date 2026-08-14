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
 *
 * Responses MUST be `application/json`. On failure the server SHOULD
 * return an `ApiError` payload with an HTTP status >= 400; the template
 * tolerates such failures at runtime — `src/lib/api.ts` returns `null` and the
 * affected section renders an explicit "non disponibile" fallback (the home
 * responds 503 only when `/site` itself is null).
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
  /**
   * Stable slug identifying the site. MUST match the `FACILITY_SLUG` the deploy
   * is configured with (the same value composed into the request URL) — the
   * template logs a warning on mismatch, since it means the deploy is pointed
   * at the wrong backend or slug.
   */
  slug: string | null;

  /** Full commercial name (used as default page title fallback and OG site name). */
  name: string | null;

  /** Short/marketing name used in header logo and tight UI spots. */
  short_name: string | null;

  /** One-line claim used as default meta description fallback. */
  tagline: string | null;

  /** ISO-639-1 locale rendered as the page `<html lang>`; falls back to `defaultLocale` in `site.config.ts` when null/empty. */
  default_locale: string | null;

  /**
   * Kill switch for the booking flow. When false the template nulls
   * `links.booking` during normalization, so every booking CTA renders in its
   * disabled state regardless of the link the backend sends.
   */
  online_bookings_enabled: boolean;

  /** Direct contact endpoints surfaced in footer and contact CTAs. All fields optional. */
  contacts: {
    email?: string | null;
    phone?: string | null;
    /** E.164 phone (or local format) used to build a `https://wa.me/<digits>` URL — non-digit chars are stripped client-side. */
    whatsapp?: string | null;
    /** Marketing website distinct from this template, if any. */
    website?: string | null;
  };

  /** Postal address. Used by the footer and the schema.org markup. */
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

  /** GDPR-relevant identity, surfaced verbatim in the footer and on the legal pages. */
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

  /**
   * Coarse seasonal window (ISO-8601 dates). `null` for year-round venues —
   * unlike address/gdpr, a missing season never fails the page: the season
   * cards simply do not render.
   */
  season: {
    start_date: string | null;
    end_date: string | null;
  } | null;

  /**
   * Contextual links surfaced in the UI. Each entry is a `{ label, url }` pair
   * or `null` to hide it. Labels are rendered verbatim — the backend owns the
   * copy, so multilingual deploys can swap them without touching the template.
   */
  links: {
    /** Primary booking CTA (header, hero, pricing tab, bar, regolamento). */
    booking: { label: string; url: string } | null;
    /** Customer login CTA (header). */
    login: { label: string; url: string } | null;
    /** Manager/back-office login CTA (footer). Separate destination from `login`. */
    manager: { label: string; url: string } | null;
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
    /**
     * Whether this pass type allows umbrella booking on the companion app.
     * OPTIONAL and pool-specific: the fine-print note renders only on an
     * explicit `false`, so backends of other verticals just omit it.
     */
    allows_umbrella_booking?: boolean;
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
// Error shape
// ---------------------------------------------------------------------------

/**
 * Standard error envelope. Returned by the backend with an HTTP status >= 400.
 *
 * The template tolerates fetch failures: the wrappers in `src/lib/api.ts`
 * return `null` instead of throwing, and the consumers (pages and components)
 * render an explicit "non disponibile" state for that endpoint. A response
 * that is technically 200 but "empty in a significant way" — e.g. `daily_hours:
 * null` for opening hours, `has_prices: false` for pricing — is normalized to
 * `null` by the same wrappers and treated the same way. `/site === null`
 * short-circuits the whole page to HTTP 503.
 */
export type ApiError = {
  error: { code: string; message: string };
};
