export const SITE = {
  slug: 'test-facility',
  name: 'Piscina Demo',
  short_name: 'Demo',
  tagline: 'Sito di anteprima.',
  default_locale: 'en',
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
  season: { start_date: '2026-06-01', end_date: '2026-09-15' },
  links: {
    booking: { label: 'Prenota', url: 'https://app.example.com/prenota' },
    login: { label: 'Accedi', url: 'https://app.example.com/login' },
    manager: { label: 'Area gestori', url: 'https://app.example.com/gestori/login' },
    hotel: { label: 'Hotel', url: 'https://hotel.example.com' },
  },
};

export const HOURS = {
  timezone: 'Europe/Rome',
  daily_hours: [
    {
      key: 'monday',
      label: 'Lunedì',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' }],
    },
    {
      key: 'tuesday',
      label: 'Martedì',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' }],
    },
    {
      key: 'wednesday',
      label: 'Mercoledì',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' }],
    },
    {
      key: 'thursday',
      label: 'Giovedì',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' }],
    },
    {
      key: 'friday',
      label: 'Venerdì',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Mattina', open: '10:00', close: '13:00' }],
    },
    {
      key: 'saturday',
      label: 'Sabato',
      closed: false,
      intervals: [{ slot: 'morning', label: 'Mattina', open: '09:00', close: '13:00' }],
    },
    { key: 'sunday', label: 'Domenica', closed: true, intervals: [] },
  ],
};

export const PRICING = {
  active_price_list_name: 'Listino test',
  has_prices: true,
  entrance_count: 2,
  pass_count: 1,
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
  ],
  pass_sections: [
    {
      label: 'Abbonamenti',
      allows_umbrella_booking: true,
      rows: [{ label: 'Adulto', range: 'dai 14 anni', value: 280, is_free: false }],
    },
  ],
};

// Backend-driven page structure (GET /site/content). Deliberately DIFFERENT
// from the committed site.content.ts — the hero title and the extra nav
// ordering prove the page is rendering the backend's structure, not the
// fallback. Kept minimal: hours + pricing sections must exist because the
// homepage specs assert on #orari / #prezzi.
export const CONTENT = {
  meta: {
    titleSuffix: 'Prenota ora',
    siteNameFallback: 'Struttura',
    descriptionTemplate: 'Scopri %s.',
  },
  sections: [
    {
      type: 'hero',
      enabled: true,
      data: {
        title: 'Titolo dal backend',
        highlight: 'struttura remota',
        lead: 'Questa pagina è composta dal payload di /site/content.',
        secondaryCta: { href: '#orari', label: 'Vai agli orari' },
        howItWorks: {
          title: 'Come funziona',
          subtitle: 'Tre passaggi.',
          steps: [
            { title: 'Uno', text: 'Primo.' },
            { title: 'Due', text: 'Secondo.' },
            { title: 'Tre', text: 'Terzo.' },
          ],
        },
      },
    },
    {
      type: 'hours',
      id: 'orari',
      navLabel: 'Orari',
      enabled: true,
      data: {
        eyebrow: 'ORARI DAL BACKEND',
        title: 'Orari di apertura',
        fallbackCta: { href: '#prezzi', label: 'Vai ai prezzi' },
      },
    },
    {
      type: 'pricing',
      id: 'prezzi',
      navLabel: 'Prezzi',
      enabled: true,
      data: {
        eyebrow: 'PREZZI',
        title: 'Listino',
        lead: 'Listino attivo.',
        infoCtaLabel: 'Chiedi info',
        priceListSubtitle: 'Aggiornato.',
        entranceTabLabel: 'Ingressi',
        passTabLabel: 'Abbonamenti',
        ageColumnLabel: 'Fascia età',
        weekdayColumnLabel: 'Feriali',
        weekendColumnLabel: 'Festivi',
        priceColumnLabel: 'Prezzo',
        noUmbrellaNote: '(non prenotabile)',
        emptyEntrances: 'Nessun ingresso.',
        emptyPasses: 'Nessun abbonamento.',
      },
    },
  ],
};
