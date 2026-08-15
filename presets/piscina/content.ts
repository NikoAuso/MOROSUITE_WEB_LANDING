import type { SiteContent } from '@/lib/sections';

/**
 * Preset "piscina": la struttura completa della landing per uno stabilimento
 * balneare stagionale. Copy, sezioni, ordine e asset demo del verticale.
 * I deploy non lo modificano: gli override si fanno in site.content.ts.
 */
export const content: SiteContent = {
  meta: {
    titleSuffix: 'Prenota ingresso e ombrellone',
    siteNameFallback: 'Piscina',
    descriptionTemplate: 'Scopri %s e prenota la tua giornata di relax.',
  },

  sections: [
    {
      type: 'hero',
      enabled: true,
      data: {
        image: { src: '/presets/piscina/hero.jpg' },
        title: 'Prenota la tua postazione in piscina',
        highlight: 'in pochi semplici step',
        lead: "Scegli la data, indica i componenti e seleziona gli ombrelloni dalla mappa. Al termine ricevi il QR Code per l'accesso.",
        secondaryCta: { href: '#piscina', label: 'Scopri la piscina' },
        card: {
          title: 'Come funziona',
          subtitle: 'In 3 semplici passaggi.',
          items: [
            { title: 'Scegli data e componenti', text: 'Adulti, bambini e neonati.' },
            { title: 'Seleziona gli ombrelloni', text: 'Dalla mappa interattiva.' },
            { title: 'Conferma e ricevi il QR', text: 'Accesso rapido in struttura.' },
          ],
        },
      },
    },
    {
      type: 'features',
      id: 'piscina',
      navLabel: 'Piscina',
      enabled: true,
      data: {
        eyebrow: 'LA NOSTRA PISCINA',
        title: "Un'Oasi di Freschezza",
        lead: 'La nostra piscina offre spazio per nuoto, relax e divertimento: corsie dedicate, aree family e servizi pensati per rendere la tua giornata semplice e piacevole.',
        items: [
          {
            icon: 'fa6-solid:droplet',
            title: 'Acqua Cristallina',
            text: "Filtrazione e controllo costante per un'acqua sempre piacevole.",
          },
          {
            icon: 'fa6-solid:umbrella-beach',
            title: 'Solarium',
            text: 'Aree relax con ombrelloni, lettini e spazi ombreggiati.',
          },
          {
            icon: 'fa6-solid:users',
            title: 'Area Bambini',
            text: 'Spazi dedicati ai più piccoli per giocare e divertirsi in sicurezza.',
          },
          {
            icon: 'fa6-solid:shield-halved',
            title: 'Sicurezza',
            text: 'Personale qualificato e regole chiare per tutti gli ospiti.',
          },
        ],
        stats: [
          { target: '25', decimals: 0, suffix: 'm', label: 'LUNGHEZZA PISCINA' },
          { target: '1.5', decimals: 1, suffix: 'm', label: 'PROFONDITÀ MEDIA' },
          { target: '2000', decimals: 0, prefix: '+', suffix: 'm²', label: 'DI SOLARIUM' },
          { target: '1000', decimals: 0, prefix: '+', suffix: '', label: 'VISITATORI MENSILI' },
        ],
      },
    },
    {
      type: 'hours',
      id: 'orari',
      navLabel: 'Orari',
      enabled: true,
      data: {
        todayLabel: 'Oggi',
        closedLabel: 'Chiuso',
        seasonLabels: { start: 'Inizio stagione', end: 'Fine stagione' },
        eyebrow: 'QUANDO VISITARCI',
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
        icon: 'fa6-solid:ticket',
        freeLabel: 'Gratis',
        eyebrow: 'PREZZI ATTIVI',
        title: 'Tariffe aggiornate in tempo reale',
        lead: 'I prezzi variano in base a data, fascia oraria e tipologia di ingresso. Trovi sempre il listino attivo durante la prenotazione.',
        note: 'Tutti i prezzi si intendono a persona.',
        disclaimer:
          "Le persone con disabilità in possesso di certificazione INPS valida hanno diritto alla riduzione del 50% sul biglietto di ingresso individuale. L'agevolazione è riconosciuta al titolare previa presentazione della certificazione e di un documento di identità in cassa. Gli accompagnatori pagano il biglietto intero. La riduzione è non cumulabile con altre promozioni e non si applica ad abbonamenti o servizi aggiuntivi.",
        infoCtaLabel: 'Chiedi info',
        priceListSubtitle: 'Sempre allineato alle disponibilità.',
        entranceTabLabel: 'Ingressi',
        passTabLabel: 'Abbonamenti',
        ageColumnLabel: 'Fascia età',
        weekdayColumnLabel: 'Feriali',
        weekendColumnLabel: 'Festivi',
        priceColumnLabel: 'Prezzo',
        noUmbrellaNote: '(ombrellone non prenotabile)',
        emptyEntrances: 'Nessun ingresso disponibile al momento.',
        emptyPasses: 'Nessun abbonamento disponibile al momento.',
        fallbackCta: { href: '#regolamento', label: 'Vai al regolamento' },
      },
    },
    {
      type: 'services',
      id: 'servizi',
      navLabel: 'Servizi',
      enabled: true,
      data: {
        eyebrow: 'I NOSTRI SERVIZI',
        title: 'Tutto per il Tuo Comfort',
        lead: 'Una gamma completa di servizi per rendere la tua giornata in piscina comoda, semplice e indimenticabile.',
        items: [
          {
            icon: 'fa6-solid:martini-glass-citrus',
            title: 'Bar & Ristorante',
            text: 'Cocktail, snack e piatti leggeri serviti comodamente in terrazza.',
          },
          {
            icon: 'fa6-solid:shower',
            title: 'Spogliatoi',
            text: 'Spogliatoi con docce e armadietti.',
          },
          {
            icon: 'fa6-solid:wifi',
            title: 'Wi-Fi Gratuito',
            text: "Connessione disponibile in tutta l'area piscina.",
          },
          {
            icon: 'fa6-solid:square-parking',
            title: 'Parcheggio',
            text: 'Area interna (fino esaurimento) e indicazioni di accesso.',
          },
          {
            icon: 'fa6-solid:wheelchair',
            title: 'Accessibilità',
            text: 'Accessi dedicati e percorsi agevolati per tutti.',
          },
        ],
        cards: [
          {
            title: 'Happy Hour',
            subtitle: 'Ogni giorno 17:00 – 19:00',
            image: '/presets/piscina/image.svg',
            alt: 'Happy Hour in piscina',
          },
          {
            title: 'Menu Estivo',
            subtitle: 'Piatti freschi e leggeri',
            image: '/presets/piscina/image.svg',
            alt: 'Menu estivo',
          },
        ],
      },
    },
    {
      type: 'rules',
      id: 'regolamento',
      navLabel: 'Regolamento',
      enabled: true,
      data: {
        eyebrow: 'REGOLAMENTO',
        title: 'Regole principali',
        lead: "Per garantire sicurezza, igiene e un'esperienza piacevole a tutti gli ospiti, è richiesto il rispetto delle regole riportate di seguito.",
        note: {
          title: 'Nota importante',
          text: 'Il personale di servizio può allontanare chi arreca disturbo con comportamenti inadeguati. La direzione può chiedere di mostrare il biglietto in ogni momento.',
        },
        help: {
          title: 'Hai dubbi?',
          text: 'Scrivici su WhatsApp per assistenza rapida, oppure procedi direttamente con la prenotazione.',
          whatsappLabel: 'Scrivici su WhatsApp',
          footnote: 'Rispondiamo appena possibile durante gli orari di apertura.',
        },
        groups: [
          {
            title: 'Obbligatorio',
            badge: 'Da rispettare sempre',
            tone: 'positive',
            items: [
              'Farsi la doccia prima di entrare in acqua.',
              "L'uso della cuffia.",
              "L'uso delle ciabatte all'interno dell'area piscine.",
              'Accompagnare i bambini sotto i 12 anni.',
              'Gli utenti minori di 3 anni o fisiologicamente incontinenti devono indossare costumi contenitivi.',
              'Servirsi dei cestini per i rifiuti.',
            ],
          },
          {
            title: 'È vietato',
            badge: 'Non consentito',
            tone: 'negative',
            items: [
              'Tuffarsi.',
              "Portare bicchieri e bottiglie in vetro nell'area piscine.",
              "Portare e consumare cibo nell'area piscine e negli spogliatoi.",
              'Entrare in vasca alle persone che presentano ferite, abrasioni, lesioni, o alterazioni cutanee di sospetta natura infetta.',
              'Recare disturbo al prossimo.',
              'Rimanere nelle vasche con il maltempo.',
              'Accesso a animali di qualsiasi taglia.',
            ],
          },
          {
            title: 'Inoltre',
            tone: 'neutral',
            items: [
              'La direzione non risponde in alcun modo degli eventuali incidenti, infortuni o altro che possono accadere ai bagnanti per comportamenti a loro imputabili.',
              "La direzione non è responsabile di furti o smarrimenti di oggetti lasciati incustoditi all'interno della struttura e non assume alcuna responsabilità nemmeno per gli oggetti lasciati negli armadietti.",
              'Il personale di servizio può allontanare chi arreca disturbo con comportamenti inadeguati.',
              'La direzione può chiedere di mostrare il biglietto in ogni momento.',
              'Portare cibo e bevande da casa, da consumare esclusivamente nelle apposite aree esterne alla struttura.',
            ],
          },
        ],
      },
    },
    {
      type: 'highlight',
      id: 'bar',
      navLabel: 'Bar',
      enabled: true,
      data: {
        title: 'Bar in piscina',
        lead: 'Caffetteria, snack, pranzi leggeri e aperitivi: perfetto per una pausa durante la giornata.',
        items: [
          { title: 'Caffetteria', text: 'Caffè, cappuccini, cornetti, succhi, gelati.' },
          {
            title: 'Snack e pranzi',
            text: 'Panini, insalate, piatti del giorno e opzioni per bambini.',
          },
          {
            title: 'Drink e aperitivi',
            text: 'Cocktail, analcolici, birre e aperitivi al tramonto.',
          },
        ],
        images: [
          { src: '/presets/piscina/image.svg', alt: 'Drink al bar' },
          { src: '/presets/piscina/image.svg', alt: 'Snack' },
          { src: '/presets/piscina/image.svg', alt: 'Solarium terrazza', wide: true },
        ],
      },
    },
  ],
};
