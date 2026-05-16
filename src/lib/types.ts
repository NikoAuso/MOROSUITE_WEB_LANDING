// Mirror of /api/public/v1/* JSON shapes. Keep keys exactly in sync with
// the core's controllers: a type mismatch is a build-break that catches
// API drift at the template repo's CI level.

export type FacilityPayload = {
  slug: string | null;
  name: string | null;
  short_name: string | null;
  tagline: string | null;
  languages: string[];
  default_locale: string;
  online_bookings_enabled: boolean;
  customer_can_book_any_weekday: boolean;
  contacts: {
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    website?: string | null;
  };
  address: {
    street?: string | null;
    locality?: string | null;
    region?: string | null;
    postal_code?: string | null;
    country?: string | null;
    google_maps_url?: string | null;
  };
  gdpr: {
    titolare: string | null;
    email_privacy: string | null;
    email_security: string | null;
  };
  social: {
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
  };
  season: {
    start_date: string | null;
    end_date: string | null;
  };
  season_dates: Array<{ label: string; value: string }> | null;
  external_links: { hotel?: string | null };
  core_app_url: string | null;
};

export type OpeningHoursPayload = {
  daily_hours: Array<{
    key: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    label: string;
    intervals: Array<{
      slot: 'morning' | 'afternoon' | 'evening';
      label: string;
      open: string;
      close: string;
    }>;
    closed: boolean;
  }> | null;
  timezone: string;
};

export type PricingPayload = {
  active_price_list_name: string | null;
  has_prices: boolean;
  entrance_count: number;
  pass_count: number;
  entrance_sections: Array<{
    label: string;
    rows: Array<{
      label: string;
      range: string | null;
      weekday_value: number | null;
      weekend_value: number | null;
      weekday_is_free: boolean;
      weekend_is_free: boolean;
    }>;
  }>;
  pass_sections: Array<{
    label: string;
    allows_umbrella_booking: boolean;
    rows: Array<{
      label: string;
      range: string | null;
      value: number | null;
      is_free: boolean;
    }>;
  }>;
};

export type LegalDocumentName = 'terms' | 'policy' | 'cookie' | 'regolamento';

export type LegalPayload = {
  doc: LegalDocumentName;
  version: string;
  effective_date: string | null;
  format: 'markdown';
  title: string;
  body: string;
};

export type TransparencyPayload = {
  titolare: string | null;
  contacts: { info?: string | null; privacy?: string | null; security?: string | null };
  hosting: Record<string, Record<string, string>>;
  rights: string[];
  legal_documents: Array<{ doc: LegalDocumentName; version: string; url: string }>;
};

export type SeoPayload = {
  '@context': 'https://schema.org';
  '@type': 'SwimmingPool';
  name: string | null;
  url: string;
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
  areaServed: string;
  availableLanguage: string[];
};

export type ApiError = {
  error: { code: string; message: string };
};
