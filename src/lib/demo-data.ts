import type { SitePayload, OpeningHoursPayload, PricingPayload } from './dto';

/**
 * Bundled demo payloads served when DEMO_MODE is enabled (see src/lib/config.ts
 * and the guard in src/lib/api.ts). Each constant is explicitly typed against
 * its DTO so this file doubles as a compiled, drift-proof example of the
 * contract a real backend must satisfy.
 */

const SITE: SitePayload = {
  slug: 'demo',
  name: 'Struttura Demo',
  short_name: 'Demo',
  tagline: 'Sito di anteprima generato in demo mode.',
  languages: ['it'],
  default_locale: 'it',
  online_bookings_enabled: true,
  customer_can_book_any_weekday: true,
  contacts: {
    email: 'info@example.com',
    phone: '+39 000 000 0000',
    whatsapp: '+390000000000',
    website: 'https://example.com',
  },
  address: {
    street: 'Via Test 1',
    locality: 'Milano',
    region: 'MI',
    postal_code: '20100',
    country: 'IT',
    google_maps_url: null,
  },
  gdpr: {
    titolare: 'Demo S.r.l.',
    email_privacy: 'privacy@example.com',
    email_security: 'security@example.com',
  },
  social: { instagram: 'https://instagram.com/demo', facebook: null, tiktok: null },
  season: { start_date: '2026-06-01', end_date: '2026-09-15' },
  season_dates: null,
  links: {
    booking: { label: 'Prenota', url: 'https://app.example.com/prenota' },
    login: { label: 'Area gestori', url: 'https://app.example.com/login' },
    register: { label: 'Registrati', url: 'https://app.example.com/register' },
    hotel: { label: 'Sito hotel', url: 'https://hotel.example.com' },
  },
};

const OPENING_HOURS: OpeningHoursPayload = {
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
      ],
    },
    {
      key: 'saturday',
      label: 'Sabato',
      closed: false,
      intervals: [
        { slot: 'morning', label: 'Mattina', open: '09:00', close: '13:00' },
        { slot: 'afternoon', label: 'Pomeriggio', open: '15:00', close: '19:00' },
      ],
    },
    { key: 'sunday', label: 'Domenica', closed: true, intervals: [] },
  ],
};

const PRICING: PricingPayload = {
  active_price_list_name: 'Listino demo',
  has_prices: true,
  entrance_count: 6,
  pass_count: 1,
  entrance_sections: [
    {
      label: 'Intero',
      rows: [
        {
          label: 'Adulto',
          range: 'dai 14 anni',
          weekday_value: 10,
          weekend_value: 15,
          weekday_is_free: false,
          weekend_is_free: false,
        },
        {
          label: 'Bambino',
          range: '3–13 anni',
          weekday_value: 7,
          weekend_value: 10,
          weekday_is_free: false,
          weekend_is_free: false,
        },
        {
          label: 'Under 3',
          range: '0–2 anni',
          weekday_value: 0,
          weekend_value: 0,
          weekday_is_free: true,
          weekend_is_free: true,
        },
      ],
    },
    {
      label: 'Pomeridiano',
      rows: [
        {
          label: 'Adulto',
          range: 'dalle 15:00',
          weekday_value: 8,
          weekend_value: 10,
          weekday_is_free: false,
          weekend_is_free: false,
        },
        {
          label: 'Bambino',
          range: '3–13 anni',
          weekday_value: 5,
          weekend_value: 7,
          weekday_is_free: false,
          weekend_is_free: false,
        },
        {
          label: 'Under 3',
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
      label: 'Abbonamenti',
      allows_umbrella_booking: true,
      rows: [{ label: 'Adulto', range: 'dai 14 anni', value: 280, is_free: false }],
    },
  ],
};

/** Path-keyed demo payloads. Keys match the `path` passed to `fetchJson`. */
export const DEMO_DATA: Record<string, unknown> = {
  '/site': SITE,
  '/site/opening-hours': OPENING_HOURS,
  '/site/pricing': PRICING,
};
