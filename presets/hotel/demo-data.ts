import type { SitePayload, OpeningHoursPayload, PricingPayload } from '@/lib/dto';

/** Payload demo del preset "hotel" (DEMO_MODE=true). Tipizzati contro i DTO. */

const SITE: SitePayload = {
  slug: 'demo',
  name: 'Hotel Demo',
  short_name: 'Hotel',
  tagline: 'Camere silenziose, colazione fino a tardi e una terrazza con vista.',
  default_locale: 'it',
  online_bookings_enabled: true,
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
  season: { start_date: null, end_date: null },
  links: {
    booking: { label: 'Prenota un soggiorno', url: 'https://app.example.com/prenota' },
    login: { label: 'Accedi', url: 'https://app.example.com/login' },
    manager: { label: 'Area gestori', url: 'https://app.example.com/gestori/login' },
    hotel: null,
  },
};

const OPENING_HOURS: OpeningHoursPayload = {
  timezone: 'Europe/Rome',
  daily_hours: [
    {
      key: 'monday',
      label: 'Lunedì',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Reception', open: '00:00', close: '24:00' }],
    },
    {
      key: 'tuesday',
      label: 'Martedì',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Reception', open: '00:00', close: '24:00' }],
    },
    {
      key: 'wednesday',
      label: 'Mercoledì',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Reception', open: '00:00', close: '24:00' }],
    },
    {
      key: 'thursday',
      label: 'Giovedì',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Reception', open: '00:00', close: '24:00' }],
    },
    {
      key: 'friday',
      label: 'Venerdì',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Reception', open: '00:00', close: '24:00' }],
    },
    {
      key: 'saturday',
      label: 'Sabato',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Reception', open: '00:00', close: '24:00' }],
    },
    {
      key: 'sunday',
      label: 'Domenica',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Reception', open: '00:00', close: '24:00' }],
    },
  ],
};

// Nessuna sezione pricing in questo preset: il payload minimo esiste solo
// perché il contratto demo copre tutti gli endpoint (mai fetchato in pratica).
const PRICING: PricingPayload = {
  active_price_list_name: null,
  has_prices: false,
  entrance_count: 0,
  pass_count: 0,
  entrance_sections: [],
  pass_sections: [],
};

export const DEMO_DATA: Record<string, unknown> = {
  '/site': SITE,
  '/site/opening-hours': OPENING_HOURS,
  '/site/pricing': PRICING,
};
