import type { SiteContent } from '@/lib/sections';

/**
 * Preset "ristorazione": la landing per un ristorante/trattoria con
 * prenotazione tavoli. Sezioni: hero con passi di prenotazione, cucina,
 * orari di servizio, menu con prezzi, galleria, servizi.
 * I deploy non lo modificano: gli override si fanno in site.content.ts.
 */
export const content: SiteContent = {
  meta: {
    titleSuffix: 'Prenota il tuo tavolo',
    siteNameFallback: 'Ristorante',
    descriptionTemplate: 'Scopri %s e prenota il tuo tavolo online.',
  },

  sections: [
    {
      type: 'hero',
      enabled: true,
      data: {
        image: { src: '/presets/ristorazione/hero.jpg' },
        title: 'La cucina della tradizione',
        highlight: 'a due passi dal centro',
        lead: 'Materie prime del territorio, pasta fresca ogni giorno e una carta dei vini curata. Prenota il tavolo online in un minuto.',
        secondaryCta: { href: '#menu', label: 'Guarda il menu' },
        card: {
          title: 'Prenotare un tavolo',
          subtitle: 'Come preferisci.',
          items: [
            {
              icon: 'fa6-solid:laptop',
              title: 'Online in un minuto',
              text: 'Scegli data, ora e coperti.',
            },
            {
              icon: 'fa6-solid:phone',
              title: 'Gruppi e cerimonie',
              text: 'Chiamaci per più di 8 coperti.',
            },
            {
              icon: 'fa6-solid:wheat-awn',
              title: 'Intolleranze e allergie',
              text: 'Segnalale in prenotazione: la cucina si organizza.',
            },
          ],
        },
      },
    },
    {
      type: 'features',
      id: 'cucina',
      navLabel: 'La cucina',
      enabled: true,
      data: {
        eyebrow: 'LA NOSTRA CUCINA',
        title: 'Tradizione e stagionalità',
        lead: 'Un menu che cambia con le stagioni, costruito su fornitori locali e ricette di famiglia.',
        items: [
          {
            icon: 'fa6-solid:wheat-awn',
            title: 'Pasta fresca',
            text: 'Tirata a mano ogni mattina.',
          },
          {
            icon: 'fa6-solid:seedling',
            title: 'Orto proprio',
            text: 'Verdure di stagione a chilometro zero.',
          },
          {
            icon: 'fa6-solid:wine-glass',
            title: 'Carta dei vini',
            text: 'Oltre 120 etichette, con verticali del territorio.',
          },
          {
            icon: 'fa6-solid:fire-burner',
            title: 'Griglia a legna',
            text: 'Carni frollate e pesce del giorno.',
          },
        ],
        stats: [
          { target: '45', decimals: 0, suffix: '', label: 'COPERTI IN SALA' },
          { target: '120', decimals: 0, prefix: '+', suffix: '', label: 'ETICHETTE IN CARTA' },
          { target: '4.8', decimals: 1, suffix: '/5', label: 'VALUTAZIONE MEDIA' },
          { target: '30', decimals: 0, suffix: ' anni', label: 'DI GESTIONE FAMILIARE' },
        ],
      },
    },
    {
      type: 'story',
      id: 'storia',
      navLabel: 'La storia',
      enabled: true,
      data: {
        eyebrow: 'LA NOSTRA STORIA',
        title: 'Tre generazioni ai fornelli',
        image: { src: '/presets/ristorazione/image.svg', alt: 'La sala negli anni Sessanta' },
        imageSide: 'left',
        paragraphs: [
          'Nel 1962 nonna Ida apriva la trattoria con quattro tavoli e un forno a legna. La pasta la tirava a mano ogni mattina: lo facciamo ancora, allo stesso banco di marmo.',
          'Oggi in cucina c’è la terza generazione, con lo stesso patto di allora: fornitori a chilometro zero, menu che segue le stagioni e nessun piatto che non sapremmo raccontare per ingredienti.',
          'La sala è cresciuta, la veranda anche; il rito è rimasto quello: si mangia bene, si sta a lungo, si torna.',
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
        eyebrow: 'QUANDO TROVARCI',
        title: 'Orari di servizio',
        fallbackCta: { href: '#menu', label: 'Vai al menu' },
      },
    },
    {
      type: 'menu',
      id: 'menu',
      navLabel: 'Menu',
      enabled: true,
      data: {
        eyebrow: 'IL MENU',
        title: 'La carta',
        lead: 'Una selezione della carta: cambia con le stagioni e con il mercato del giorno.',
        footnote:
          'Coperto € 2,50. Per allergeni e intolleranze chiedete in sala: ogni piatto può essere raccontato per ingredienti.',
        externalCta: {
          href: '/presets/ristorazione/image.svg',
          label: 'Scarica la carta completa (PDF)',
        },
        courses: [
          {
            label: 'Antipasti',
            tab: 'Cucina',
            dishes: [
              {
                name: 'Tagliere del contadino',
                description: 'Salumi e formaggi del territorio, giardiniera di casa',
                price: '€ 14',
              },
              {
                name: 'Verdure di stagione in pastella',
                description: "Con salsa all'aglio dolce",
                price: '€ 8',
              },
            ],
          },
          {
            label: 'Primi',
            tab: 'Cucina',
            dishes: [
              {
                name: 'Tagliatelle al ragù',
                description: 'Pasta fresca tirata a mano, cottura lenta di 6 ore',
                price: '€ 12',
              },
              {
                name: 'Risotto ai porcini',
                description: 'Mantecato al burro di malga',
                price: '€ 14',
              },
              { name: 'Zuppa del giorno', description: 'Secondo il mercato', price: '€ 9' },
            ],
          },
          {
            label: 'Secondi',
            tab: 'Cucina',
            dishes: [
              {
                name: 'Tagliata alla griglia',
                description: 'Frollatura 30 giorni, sale di Cervia',
                price: '€ 22',
              },
              {
                name: 'Pescato del giorno',
                description: 'Alla griglia o al sale',
                price: 'da € 18',
              },
            ],
          },
          {
            label: 'Dolci',
            tab: 'Dolci e vini',
            dishes: [
              { name: 'Tiramisù della casa', price: '€ 6' },
              { name: 'Crostata di stagione', price: '€ 6' },
            ],
          },
        ],
      },
    },
    {
      type: 'gallery',
      id: 'galleria',
      navLabel: 'Galleria',
      enabled: true,
      data: {
        eyebrow: 'LA SALA E LA CUCINA',
        title: 'Uno sguardo dentro',
        images: [
          { src: '/presets/ristorazione/image.svg', alt: 'La sala principale' },
          { src: '/presets/ristorazione/image.svg', alt: 'Pasta fresca in preparazione' },
          {
            src: '/presets/ristorazione/image.svg',
            alt: 'La veranda estiva',
            caption: 'La veranda, aperta da maggio a settembre',
            wide: true,
          },
          { src: '/presets/ristorazione/image.svg', alt: 'La cantina, oltre 120 etichette' },
          { src: '/presets/ristorazione/image.svg', alt: 'Il forno a legna, acceso dal 1962' },
        ],
      },
    },
    {
      type: 'testimonials',
      id: 'recensioni',
      enabled: true,
      data: {
        eyebrow: 'DICONO DI NOI',
        title: 'Dicono di noi',
        lead: 'Qualche voce dal libro degli ospiti e dalle recensioni online.',
        items: [
          {
            quote:
              'Le tagliatelle al ragù sono quelle di casa mia, ma migliori. Ci portiamo gli amici da fuori città apposta.',
            author: 'Chiara T.',
            meta: 'Cena del sabato',
            rating: 5,
          },
          {
            quote:
              'Prenotato online alle 11, tavolo in veranda alle 13. Servizio veloce e carta dei vini che vale il viaggio.',
            author: 'Marco R.',
            meta: 'Pranzo di lavoro',
            rating: 5,
          },
          {
            quote:
              'Hanno gestito una cena da 30 persone con menu senza glutine per due ospiti senza un intoppo.',
            author: 'Elena B.',
            meta: 'Compleanno in sala privata',
            rating: 4,
          },
        ],
      },
    },
    {
      type: 'services',
      id: 'servizi',
      navLabel: 'Servizi',
      enabled: true,
      data: {
        eyebrow: 'I NOSTRI SERVIZI',
        title: 'Oltre la tavola',
        lead: 'Tutto quello che serve per una serata senza pensieri.',
        items: [
          {
            icon: 'fa6-solid:cake-candles',
            title: 'Eventi privati',
            text: 'Sala riservabile per compleanni e cerimonie fino a 45 coperti.',
          },
          {
            icon: 'fa6-solid:leaf',
            title: 'Opzioni vegetariane',
            text: 'Percorso vegetariano completo, su richiesta vegano.',
          },
          {
            icon: 'fa6-solid:square-parking',
            title: 'Parcheggio convenzionato',
            text: 'A 50 metri, gratuito per i clienti la sera.',
          },
          {
            icon: 'fa6-solid:dog',
            title: 'Animali benvenuti',
            text: 'In veranda e ai tavoli esterni.',
          },
        ],
        cards: [
          {
            title: 'Aperitivo in veranda',
            subtitle: 'Dal giovedì al sabato, 18:00 – 20:00',
            image: '/presets/ristorazione/image.svg',
            alt: 'Aperitivo in veranda',
          },
          {
            title: 'La cantina',
            subtitle: 'Visite e degustazioni su prenotazione',
            image: '/presets/ristorazione/image.svg',
            alt: 'La cantina',
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
        lead: 'Quello che ci chiedono più spesso al telefono.',
        items: [
          {
            question: 'Serve prenotare?',
            answer:
              'Nei giorni feriali di solito no; venerdì sera e nel weekend è consigliato, la veranda si riempie presto.',
          },
          {
            question: 'Avete opzioni vegetariane o senza glutine?',
            answer:
              'Sempre almeno un primo e un secondo vegetariani; pasta senza glutine su richiesta al momento della prenotazione.',
          },
          {
            question: 'I cani sono ammessi?',
            answer: 'Sì, in veranda e nel dehors, con la ciotola che portiamo noi.',
          },
          {
            question: 'Fate menu per gruppi e cerimonie?',
            answer:
              'Sì, da 12 a 45 coperti in sala privata: chiamaci e costruiamo il menu insieme.',
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
        lead: 'In centro storico, a due passi dalla piazza: arrivare è facile anche senza auto.',
        mapsLabel: 'Apri in Google Maps',
        image: { src: '/presets/ristorazione/image.svg', alt: 'Mappa della zona' },
        items: [
          {
            icon: 'fa6-solid:train',
            title: 'Dalla stazione',
            text: 'Dieci minuti a piedi lungo il corso, o due fermate di tram (linea 3).',
          },
          {
            icon: 'fa6-solid:square-parking',
            title: 'Parcheggio convenzionato',
            text: 'Garage Centro a 50 metri: tariffa ridotta mostrando lo scontrino.',
          },
          {
            icon: 'fa6-solid:wheelchair',
            title: 'Accessibilità',
            text: 'Ingresso a raso dalla veranda, bagno attrezzato al piano terra.',
          },
        ],
      },
    },
  ],
};
