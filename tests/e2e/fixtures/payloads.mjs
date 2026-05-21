export const SITE = {
  slug: 'demo',
  name: 'Piscina Demo',
  short_name: 'Demo',
  tagline: 'Sito di anteprima.',
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
  season_dates: [{ label: 'Stagione estiva', value: '01/06 – 15/09' }],
  links: {
    booking: { label: 'Prenota', url: 'https://app.example.com/prenota' },
    login: { label: 'Accedi', url: 'https://app.example.com/login' },
    register: { label: 'Registrati', url: 'https://app.example.com/register' },
    hotel: { label: 'Hotel', url: 'https://hotel.example.com' },
  },
};

export const HOURS = {
  timezone: 'Europe/Rome',
  daily_hours: [
    { key: 'monday', label: 'Lunedì', closed: false, intervals: [{ slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' }] },
    { key: 'tuesday', label: 'Martedì', closed: false, intervals: [{ slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' }] },
    { key: 'wednesday', label: 'Mercoledì', closed: false, intervals: [{ slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' }] },
    { key: 'thursday', label: 'Giovedì', closed: false, intervals: [{ slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' }] },
    { key: 'friday', label: 'Venerdì', closed: false, intervals: [{ slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' }] },
    { key: 'saturday', label: 'Sabato', closed: false, intervals: [{ slot: 'morning', label: 'Mattina', open: '09:00', close: '13:00' }] },
    { key: 'sunday', label: 'Domenica', closed: true, intervals: [] },
  ],
};

export const PRICING = {
  active_price_list_name: 'Listino test',
  has_prices: true,
  entrance_count: 2,
  pass_count: 1,
  entrance_sections: [{
    label: 'Adulti',
    rows: [
      { label: 'Intero', range: 'dai 14 anni', weekday_value: 12, weekend_value: 15, weekday_is_free: false, weekend_is_free: false },
      { label: 'Pomeridiano', range: 'dalle 15:00', weekday_value: 8, weekend_value: 10, weekday_is_free: false, weekend_is_free: false },
    ],
  }],
  pass_sections: [{
    label: 'Abbonamenti',
    allows_umbrella_booking: true,
    rows: [{ label: 'Adulto', range: 'dai 14 anni', value: 280, is_free: false }],
  }],
};

export const LEGAL_POLICY = {
  doc: 'policy',
  version: '1.0',
  effective_date: '2026-01-01',
  format: 'markdown',
  title: 'Privacy policy',
  body: '## Privacy policy\n\nTesto della policy.',
};

export const LEGAL_COOKIE = {
  doc: 'cookie',
  version: '1.0',
  effective_date: '2026-01-01',
  format: 'markdown',
  title: 'Cookie policy',
  body: '## Cookie policy\n\nTesto cookie.',
};
