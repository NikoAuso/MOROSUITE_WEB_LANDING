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
        howItWorks: {
          title: 'Prenotare è semplice',
          subtitle: 'In 3 passaggi.',
          steps: [
            { title: 'Scegli data e ora', text: 'Pranzo o cena.' },
            { title: 'Indica i coperti', text: 'E eventuali intolleranze.' },
            { title: 'Ricevi la conferma', text: 'Via email, subito.' },
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
        courses: [
          {
            label: 'Antipasti',
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
  ],
};
