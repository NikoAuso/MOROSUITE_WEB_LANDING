/**
 * Offline placeholders served by `src/lib/api.ts` when the backend is
 * unreachable (network down, fetch failure, non-2xx response).
 *
 * These are **the single source of truth for fallback/demo content**: edit
 * the strings below to change what the site shows when there is no live data
 * (e.g. during local dev without a backend, or if a production build runs
 * while the API is temporarily offline).
 *
 * The shapes mirror the DTOs in `./dto.ts`. Keep them in sync if you change
 * the contract.
 */

import { config } from './config';
import type {
  SitePayload,
  OpeningHoursPayload,
  PricingPayload,
  LegalPayload,
  LegalDocumentName,
  SeoPayload,
} from './dto';

// ---------------------------------------------------------------------------
// Site identity (header logo name, footer, hero copy, GDPR mentions)
// ---------------------------------------------------------------------------

export const PLACEHOLDER_SITE: SitePayload = {
  slug: 'demo',
  name: 'Piscina Demo',
  short_name: 'Demo',
  tagline: 'Sito di anteprima — dati di esempio mostrati offline.',
  languages: ['it', 'en'],
  default_locale: 'it',
  online_bookings_enabled: true,
  customer_can_book_any_weekday: true,
  contacts: {
    email: 'info@example.com',
    phone: '+39 000 000 0000',
    whatsapp: '+390000000000',
    website: 'https://www.example.com',
  },
  address: {
    street: 'Via di Esempio, 1',
    locality: 'Milano',
    region: 'MI',
    postal_code: '20100',
    country: 'IT',
    google_maps_url: null,
  },
  gdpr: {
    titolare: 'Azienda Demo S.r.l.',
    email_privacy: 'privacy@example.com',
    email_security: 'security@example.com',
  },
  social: {
    instagram: 'https://instagram.com/example',
    facebook: 'https://facebook.com/example',
    tiktok: null,
  },
  season: {
    start_date: '2026-06-01',
    end_date: '2026-09-15',
  },
  season_dates: [
    { label: 'Stagione estiva', value: '01/06 – 15/09' },
    { label: 'Eventi serali', value: 'Venerdì e sabato' },
  ],
  links: {
    booking: { label: 'Prenota ora', url: `${config.appBaseUrl}/prenota` },
    login: { label: 'Accedi', url: `${config.appBaseUrl}/login` },
    register: { label: 'Registrati', url: `${config.appBaseUrl}/register` },
    hotel: { label: 'Altro sito', url: 'https://www.example.com' },
  },
};

// ---------------------------------------------------------------------------
// Opening hours (today's highlight + weekly grid)
// ---------------------------------------------------------------------------

export const PLACEHOLDER_OPENING_HOURS: OpeningHoursPayload = {
  timezone: 'Europe/Rome',
  daily_hours: [
    {
      key: 'monday',
      label: 'Lunedì',
      closed: false,
      intervals: [
        { slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' },
        { slot: 'afternoon', label: 'Pomeriggio', open: '15:00', close: '19:00' },
      ],
    },
    {
      key: 'tuesday',
      label: 'Martedì',
      closed: false,
      intervals: [
        { slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' },
        { slot: 'afternoon', label: 'Pomeriggio', open: '15:00', close: '19:00' },
      ],
    },
    {
      key: 'wednesday',
      label: 'Mercoledì',
      closed: false,
      intervals: [
        { slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' },
        { slot: 'afternoon', label: 'Pomeriggio', open: '15:00', close: '19:00' },
      ],
    },
    {
      key: 'thursday',
      label: 'Giovedì',
      closed: false,
      intervals: [
        { slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' },
        { slot: 'afternoon', label: 'Pomeriggio', open: '15:00', close: '19:00' },
      ],
    },
    {
      key: 'friday',
      label: 'Venerdì',
      closed: false,
      intervals: [
        { slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' },
        { slot: 'afternoon', label: 'Pomeriggio', open: '15:00', close: '19:00' },
        { slot: 'evening', label: 'Sera', open: '20:00', close: '23:00' },
      ],
    },
    {
      key: 'saturday',
      label: 'Sabato',
      closed: false,
      intervals: [
        { slot: 'morning', label: 'Mattina', open: '09:00', close: '13:00' },
        { slot: 'afternoon', label: 'Pomeriggio', open: '14:30', close: '19:30' },
        { slot: 'evening', label: 'Sera', open: '20:00', close: '23:00' },
      ],
    },
    {
      key: 'sunday',
      label: 'Domenica',
      closed: false,
      intervals: [
        { slot: 'morning', label: 'Mattina', open: '09:00', close: '13:00' },
        { slot: 'afternoon', label: 'Pomeriggio', open: '14:30', close: '19:30' },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Pricing (entrance + pass tabs)
// ---------------------------------------------------------------------------

export const PLACEHOLDER_PRICING: PricingPayload = {
  active_price_list_name: 'Listino demo 2026',
  has_prices: true,
  entrance_count: 4,
  pass_count: 3,
  entrance_sections: [
    {
      label: 'Adulti',
      rows: [
        {
          label: 'Intero',
          range: 'dai 14 anni',
          weekday_value: 12,
          weekend_value: 15,
          weekday_is_free: false,
          weekend_is_free: false,
        },
        {
          label: 'Pomeridiano',
          range: 'dalle 15:00',
          weekday_value: 8,
          weekend_value: 10,
          weekday_is_free: false,
          weekend_is_free: false,
        },
      ],
    },
    {
      label: 'Bambini e ragazzi',
      rows: [
        {
          label: 'Ridotto',
          range: '3–13 anni',
          weekday_value: 7,
          weekend_value: 9,
          weekday_is_free: false,
          weekend_is_free: false,
        },
        {
          label: 'Gratis',
          range: '0–2 anni',
          weekday_value: 0,
          weekend_value: 0,
          weekday_is_free: true,
          weekend_is_free: true,
        },
      ],
    },
  ],
  pass_sections: [
    {
      label: 'Abbonamenti stagionali',
      allows_umbrella_booking: true,
      rows: [
        { label: 'Adulto', range: 'dai 14 anni', value: 280, is_free: false },
        { label: 'Junior', range: '3–13 anni', value: 180, is_free: false },
      ],
    },
    {
      label: 'Carnet 10 ingressi',
      allows_umbrella_booking: false,
      rows: [{ label: 'Adulto', range: null, value: 100, is_free: false }],
    },
  ],
};

// ---------------------------------------------------------------------------
// SEO / schema.org structured data
// ---------------------------------------------------------------------------

export const PLACEHOLDER_SEO: SeoPayload = {
  '@context': 'https://schema.org',
  '@type': 'SwimmingPool',
  name: 'Piscina Demo',
  url: 'https://www.example.com',
  image: ['https://www.example.com/og.jpg'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via di Esempio, 1',
    addressLocality: 'Milano',
    addressRegion: 'MI',
    postalCode: '20100',
    addressCountry: 'IT',
  },
  telephone: '+39 000 000 0000',
  areaServed: 'Italia',
  availableLanguage: ['it', 'en'],
};

// ---------------------------------------------------------------------------
// Legal documents (terms / policy / cookie / regolamento)
//
// Keyed by `LegalDocumentName`. Body is markdown — rendered via `marked` and
// inserted with `set:html` (same trust boundary as live content).
// ---------------------------------------------------------------------------

const DEMO_BODY = `
## Sezione di esempio

Questo è un documento legale di esempio mostrato perché il backend non è raggiungibile. Sostituiscilo a runtime con il contenuto reale fornito dall'endpoint \`/legal/{doc}\`.

### Sottotitolo

- Punto elenco di esempio
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Pellentesque habitant morbi tristique senectus.

> Nota: tutti i dati visibili sono fittizi.
`;

export const PLACEHOLDER_LEGAL: Record<LegalDocumentName, LegalPayload> = {
  policy: {
    doc: 'policy',
    version: 'demo',
    effective_date: '2026-01-01',
    format: 'markdown',
    title: 'Privacy policy (anteprima)',
    body: DEMO_BODY,
  },
  cookie: {
    doc: 'cookie',
    version: 'demo',
    effective_date: '2026-01-01',
    format: 'markdown',
    title: 'Cookie policy (anteprima)',
    body: DEMO_BODY,
  },
};
