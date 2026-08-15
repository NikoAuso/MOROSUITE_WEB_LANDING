import type { SiteContent } from '@/lib/sections';

/**
 * Preset "hotel": la landing per una struttura ricettiva con prenotazione
 * soggiorni. Hero con passi, camere in evidenza, galleria, servizi.
 * Niente sezione orari (la reception è h24) e niente pricing: le tariffe
 * vivono nel motore di prenotazione, non in una tabella statica.
 * I deploy non lo modificano: gli override si fanno in site.content.ts.
 */
export const content: SiteContent = {
  meta: {
    titleSuffix: 'Prenota il tuo soggiorno',
    siteNameFallback: 'Hotel',
    descriptionTemplate: 'Scopri %s e prenota il tuo soggiorno.',
  },

  sections: [
    {
      type: 'hero',
      enabled: true,
      data: {
        image: { src: '/presets/hotel/hero.jpg' },
        title: 'Il tuo rifugio in città',
        highlight: 'aperto tutto l’anno',
        lead: 'Camere silenziose, colazione fino a tardi e una terrazza con vista. Prenoti online, senza intermediari: il miglior prezzo è sempre qui.',
        secondaryCta: { href: '#camere', label: 'Scopri le camere' },
        card: {
          title: 'Prenotare diretto conviene',
          subtitle: 'Senza intermediari.',
          items: [
            {
              icon: 'fa6-solid:tag',
              title: 'Miglior prezzo garantito',
              text: 'Se lo trovi più basso, lo pareggiamo.',
            },
            {
              icon: 'fa6-solid:calendar-check',
              title: 'Cancellazione gratuita',
              text: 'Fino a 48 ore prima dell’arrivo.',
            },
            {
              icon: 'fa6-solid:mug-saucer',
              title: 'Colazione inclusa',
              text: 'Buffet dolce e salato, fino alle 10:30.',
            },
          ],
        },
      },
    },
    {
      type: 'menu',
      id: 'camere',
      navLabel: 'Camere',
      enabled: true,
      data: {
        eyebrow: 'LE CAMERE',
        title: 'Camere e tariffe',
        lead: 'Quattro tagli, tutti con colazione inclusa. Il prezzo definitivo dipende da stagione e disponibilità: lo vedi nel motore di prenotazione.',
        footnote:
          'Tariffe indicative per camera a notte, tasse incluse; tassa di soggiorno esclusa. Culla gratuita su richiesta.',
        courses: [
          {
            label: 'Camere',
            dishes: [
              {
                name: 'Singola',
                description: '16 m², letto alla francese, vista cortile.',
                price: 'da € 70',
              },
              {
                name: 'Doppia Comfort',
                description: '22 m², matrimoniale o twin, scrivania.',
                price: 'da € 95',
              },
              {
                name: 'Doppia Superior',
                description: '28 m², balcone, macchina espresso.',
                price: 'da € 125',
              },
              {
                name: 'Junior Suite',
                description: '40 m², zona living, vasca, vista terrazza.',
                price: 'da € 180',
              },
            ],
          },
          {
            label: 'Extra',
            dishes: [
              { name: 'Letto aggiunto', price: '€ 25 / notte' },
              {
                name: 'Garage convenzionato',
                description: 'A 200 metri, con riconsegna auto.',
                price: '€ 15 / notte',
              },
              {
                name: 'Late check-out',
                description: 'Fino alle 14, su disponibilità.',
                price: '€ 25',
              },
            ],
          },
        ],
      },
    },
    {
      type: 'features',
      id: 'soggiorno',
      navLabel: 'Il soggiorno',
      enabled: true,
      data: {
        eyebrow: 'IL SOGGIORNO',
        title: 'Riposare bene, davvero',
        lead: 'Sedici camere, quattro tagli, un solo standard: silenzio, luce e materassi che ricorderete.',
        items: [
          {
            icon: 'fa6-solid:bed',
            title: 'Materassi premium',
            text: 'Memory o molle insacchettate, a scelta al check-in.',
          },
          {
            icon: 'fa6-solid:volume-xmark',
            title: 'Insonorizzazione',
            text: 'Infissi a doppia camera su tutte le stanze.',
          },
          {
            icon: 'fa6-solid:wifi',
            title: 'Wi-Fi in fibra',
            text: 'Gratuito, anche in terrazza e nelle aree comuni.',
          },
          {
            icon: 'fa6-solid:snowflake',
            title: 'Clima indipendente',
            text: 'Regolabile camera per camera, tutto l’anno.',
          },
        ],
        stats: [
          { target: '16', decimals: 0, suffix: '', label: 'CAMERE' },
          { target: '9.2', decimals: 1, suffix: '/10', label: 'PUNTEGGIO RECENSIONI' },
          { target: '24', decimals: 0, suffix: 'h', label: 'RECEPTION' },
          { target: '10', decimals: 0, suffix: ':30', label: 'COLAZIONE FINO ALLE' },
        ],
      },
    },
    {
      type: 'gallery',
      id: 'galleria',
      navLabel: 'Galleria',
      enabled: true,
      data: {
        eyebrow: 'GLI SPAZI',
        title: 'Camere e aree comuni',
        images: [
          { src: '/presets/hotel/image.svg', alt: 'Camera matrimoniale superior' },
          { src: '/presets/hotel/image.svg', alt: 'La sala colazioni' },
          {
            src: '/presets/hotel/image.svg',
            alt: 'La terrazza panoramica',
            caption: 'La terrazza, aperta agli ospiti da aprile a ottobre',
            wide: true,
          },
          { src: '/presets/hotel/image.svg', alt: 'La hall' },
          { src: '/presets/hotel/image.svg', alt: 'Bagno in camera deluxe' },
        ],
      },
    },
    {
      type: 'services',
      id: 'servizi',
      navLabel: 'Servizi',
      enabled: true,
      data: {
        eyebrow: 'I SERVIZI',
        title: 'Pensato per chi viaggia',
        lead: 'Dal check-in online al deposito bagagli: i dettagli che rendono semplice il soggiorno.',
        items: [
          {
            icon: 'fa6-solid:mobile-screen',
            title: 'Check-in online',
            text: 'Documenti da casa, chiavi digitali all’arrivo.',
          },
          {
            icon: 'fa6-solid:suitcase-rolling',
            title: 'Deposito bagagli',
            text: 'Gratuito, prima del check-in e dopo il check-out.',
          },
          {
            icon: 'fa6-solid:bicycle',
            title: 'Bici in prestito',
            text: 'Sei city bike per gli ospiti, su prenotazione.',
          },
          {
            icon: 'fa6-solid:square-parking',
            title: 'Garage convenzionato',
            text: 'A 200 metri, tariffa ospiti con riconsegna auto.',
          },
          {
            icon: 'fa6-solid:paw',
            title: 'Pet friendly',
            text: 'Animali benvenuti in camere dedicate.',
          },
        ],
        cards: [
          {
            title: 'La colazione',
            subtitle: 'Buffet dolce e salato, fino alle 10:30',
            image: '/presets/hotel/image.svg',
            alt: 'Il buffet della colazione',
          },
          {
            title: 'La terrazza',
            subtitle: 'Aperitivo per gli ospiti al tramonto',
            image: '/presets/hotel/image.svg',
            alt: 'La terrazza al tramonto',
          },
        ],
      },
    },
  ],
};
