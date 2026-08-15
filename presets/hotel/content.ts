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
      type: 'rooms',
      id: 'camere',
      navLabel: 'Camere',
      enabled: true,
      data: {
        eyebrow: 'LE CAMERE',
        title: 'Camere e tariffe',
        lead: 'Quattro tagli, tutti con colazione inclusa. Il prezzo definitivo dipende da stagione e disponibilità: lo vedi nel motore di prenotazione.',
        footnote:
          'Tariffe indicative per camera a notte, tasse incluse; tassa di soggiorno esclusa. Culla gratuita su richiesta.',
        items: [
          {
            name: 'Singola',
            description: 'Letto alla francese e scrivania: la base giusta per una notte di lavoro.',
            price: 'da € 70',
            facts: ['16 m²', '1 ospite', 'Vista cortile'],
            image: { src: '/presets/hotel/image.svg', alt: 'Camera singola' },
          },
          {
            name: 'Doppia Comfort',
            description:
              'Matrimoniale o twin, con poltrona e angolo lettura. La camera che scelgono quasi tutti.',
            price: 'da € 95',
            facts: ['22 m²', '2 ospiti', 'Insonorizzata'],
            image: { src: '/presets/hotel/image.svg', alt: 'Camera doppia comfort' },
          },
          {
            name: 'Doppia Superior',
            description: 'Balcone privato, macchina espresso e doccia walk-in. Ai piani alti.',
            price: 'da € 125',
            facts: ['28 m²', '2 ospiti', 'Balcone'],
            image: { src: '/presets/hotel/image.svg', alt: 'Camera doppia superior con balcone' },
          },
          {
            name: 'Junior Suite',
            description:
              'Zona living separata, vasca e vista sulla terrazza. Per chi resta più di una notte.',
            price: 'da € 180',
            facts: ['40 m²', '3 ospiti', 'Vasca', 'Vista terrazza'],
            image: { src: '/presets/hotel/image.svg', alt: 'Junior suite' },
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
      type: 'story',
      id: 'storia',
      navLabel: 'La casa',
      enabled: true,
      data: {
        eyebrow: 'LA CASA',
        title: 'Una casa di famiglia, aperta a tutti',
        image: { src: '/presets/hotel/image.svg', alt: 'La facciata del palazzo' },
        imageSide: 'right',
        paragraphs: [
          'Il palazzo è del 1911 e per settant’anni è stato la casa dei nonni. Nel 2004 lo abbiamo aperto agli ospiti, una stanza alla volta, tenendo i pavimenti in graniglia e le porte originali.',
          'Sedici camere, una terrazza e una sala colazioni che era il salotto buono. Il resto è quello che ci piace trovare quando viaggiamo noi: silenzio, luce, un buon caffè, nessuna sorpresa in fattura.',
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
    {
      type: 'testimonials',
      id: 'recensioni',
      enabled: true,
      data: {
        eyebrow: 'RECENSIONI',
        title: 'Gli ospiti raccontano',
        lead: 'Recensioni verificate degli ultimi mesi.',
        items: [
          {
            quote:
              'Camera silenziosa in pieno centro, colazione fino a tardi e la terrazza al tramonto: torneremo.',
            author: 'Anna e Paolo',
            meta: 'Doppia Superior, 3 notti',
            rating: 5,
          },
          {
            quote:
              'Check-in online, chiave sul telefono e reception sempre disponibile: viaggio per lavoro e ho apprezzato ogni dettaglio.',
            author: 'Roberto G.',
            meta: 'Singola, 1 notte',
            rating: 5,
          },
          {
            quote:
              'Prenotato diretto e ho avuto la tariffa migliore: rispetto ai portali colazione inclusa e cancellazione gratuita.',
            author: 'Sophie L.',
            meta: 'Junior Suite, 4 notti',
            rating: 5,
          },
        ],
      },
    },
    {
      type: 'faq',
      id: 'faq',
      navLabel: 'FAQ',
      enabled: true,
      data: {
        eyebrow: 'DOMANDE FREQUENTI',
        title: 'Domande frequenti',
        lead: 'Tutto quello che serve sapere prima di arrivare.',
        items: [
          {
            question: 'A che ora sono check-in e check-out?',
            answer:
              'Check-in dalle 14:00, check-out entro le 11:00. Deposito bagagli gratuito prima e dopo.',
          },
          {
            question: 'La colazione è inclusa?',
            answer:
              'Sì, in tutte le tariffe: buffet dolce e salato dalle 7:00 alle 10:30, in sala o in terrazza.',
          },
          {
            question: 'Posso cancellare la prenotazione?',
            answer:
              'Gratuitamente fino a 48 ore prima dell’arrivo con la tariffa flessibile; le tariffe non rimborsabili sono indicate come tali.',
          },
          {
            question: 'Avete parcheggio?',
            answer:
              'Garage convenzionato a 200 metri, con riconsegna auto: prenotalo insieme alla camera.',
          },
          {
            question: 'Gli animali sono ammessi?',
            answer: 'Sì, nelle camere dedicate al piano terra, senza supplemento fino a 10 kg.',
          },
        ],
      },
    },
    {
      type: 'location',
      id: 'dove-siamo',
      navLabel: 'Dove siamo',
      enabled: true,
      data: {
        eyebrow: 'DOVE SIAMO',
        title: 'Come raggiungerci',
        lead: 'In centro storico, a due passi dal Duomo e a sette minuti a piedi dalla stazione.',
        mapsLabel: 'Apri in Google Maps',
        image: { src: '/presets/hotel/image.svg', alt: 'Mappa della zona' },
        items: [
          {
            icon: 'fa6-solid:train',
            title: 'Dalla stazione centrale',
            text: 'Sette minuti a piedi, o una fermata di metro (linea M2, uscita Duomo).',
          },
          {
            icon: 'fa6-solid:plane',
            title: 'Dall’aeroporto',
            text: 'Navetta ogni 20 minuti fino alla stazione, poi come sopra: 50 minuti in tutto.',
          },
          {
            icon: 'fa6-solid:square-parking',
            title: 'In auto',
            text: 'Zona a traffico limitato: comunicaci la targa e ti registriamo; garage convenzionato a 200 metri.',
          },
        ],
      },
    },
  ],
};
