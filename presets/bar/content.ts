import type { SiteContent } from '@/lib/sections';

/**
 * Preset "bar": la landing per un bar/caffetteria con lista drink.
 * Hero copy-only (niente card passi: qui non si prenota un flusso, si passa),
 * caffetteria, orari, drink list, eventi in evidenza, galleria.
 * I deploy non lo modificano: gli override si fanno in site.content.ts.
 */
export const content: SiteContent = {
  meta: {
    titleSuffix: 'Caffè, aperitivi e cocktail',
    siteNameFallback: 'Bar',
    descriptionTemplate: 'Scopri %s: colazioni, aperitivi e cocktail dal vivo.',
  },

  sections: [
    {
      type: 'hero',
      enabled: true,
      data: {
        image: { src: '/presets/bar/hero.jpg' },
        title: 'Dal caffè del mattino',
        highlight: "all'ultimo cocktail della sera",
        lead: 'Torrefazione locale, aperitivi con cucina e una drink list che cambia ogni stagione. Senza prenotazione: arriva e siediti.',
        secondaryCta: { href: '#drink', label: 'La drink list' },
        card: {
          title: 'Oggi al banco',
          subtitle: 'Dal mattino a mezzanotte.',
          items: [
            {
              icon: 'fa6-solid:mug-hot',
              title: 'Colazione dalle 6',
              text: 'Caffè, lievitati e spremute.',
            },
            {
              icon: 'fa6-solid:martini-glass-citrus',
              title: 'Aperitivo dalle 17',
              text: 'Con cucina, in dehors.',
            },
            {
              icon: 'fa6-solid:music',
              title: 'Serate a tema',
              text: 'Vinile, live e brunch domenicale.',
            },
          ],
        },
      },
    },
    {
      type: 'features',
      id: 'caffetteria',
      navLabel: 'Caffetteria',
      enabled: true,
      data: {
        eyebrow: 'IL BANCO',
        title: 'Colazioni fatte bene',
        lead: 'Caffè di torrefazione artigianale, lievitati del nostro forno di fiducia e spremute al momento.',
        items: [
          {
            icon: 'fa6-solid:mug-hot',
            title: 'Specialty coffee',
            text: 'Monorigine a rotazione, espresso e filtro.',
          },
          {
            icon: 'fa6-solid:bread-slice',
            title: 'Lievitati freschi',
            text: 'Cornetti e brioche consegnati ogni mattina alle 6.',
          },
          {
            icon: 'fa6-solid:blender',
            title: 'Spremute ed estratti',
            text: 'Frutta e verdura di stagione, al momento.',
          },
          {
            icon: 'fa6-solid:martini-glass',
            title: 'Cocktail bar',
            text: 'Classici e signature, dal tramonto in poi.',
          },
        ],
        stats: [
          { target: '6', decimals: 0, suffix: ':00', label: 'APERTI DALLE' },
          { target: '18', decimals: 0, suffix: '', label: 'COCKTAIL IN LISTA' },
          { target: '4', decimals: 0, suffix: '', label: 'MONORIGINE A ROTAZIONE' },
          { target: '40', decimals: 0, suffix: ' posti', label: 'IN DEHORS' },
        ],
      },
    },
    {
      type: 'story',
      id: 'storia',
      navLabel: 'Chi siamo',
      enabled: true,
      data: {
        eyebrow: 'IL PROGETTO',
        title: 'Un banco, dal 1998',
        image: { src: '/presets/bar/image.svg', alt: 'Il banco del bar negli anni Novanta' },
        imageSide: 'right',
        paragraphs: [
          'Siamo nati come torrefazione di quartiere: due miscele, un banco di legno e la radio accesa. Il caffè lo tostiamo ancora noi, ogni settimana.',
          'Con gli anni il banco si è allungato fino a sera: prima l’aperitivo con la cucina, poi la drink list e le serate in dehors. Il quartiere è cambiato, il banco è rimasto lo stesso.',
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
        eyebrow: 'QUANDO PASSARE',
        title: 'Orari di apertura',
        fallbackCta: { href: '#drink', label: 'Vai alla drink list' },
      },
    },
    {
      type: 'menu',
      id: 'drink',
      navLabel: 'Drink list',
      enabled: true,
      data: {
        eyebrow: 'LA LISTA',
        title: 'Drink & aperitivi',
        lead: 'I signature cambiano ogni stagione; i classici non si toccano.',
        footnote: "All'aperitivo, ogni drink arriva con un assaggio della cucina.",
        externalCta: { href: '/presets/bar/image.svg', label: 'La lista completa (PDF)' },
        courses: [
          {
            label: 'Signature',
            tab: 'Cocktail',
            dishes: [
              {
                name: 'Vermutino della casa',
                description: 'Vermut locale, soda al rosmarino, oliva',
                price: '€ 7',
              },
              {
                name: 'Amaro in spalla',
                description: 'Amaro artigianale, limone bruciato, ginger',
                price: '€ 8',
              },
            ],
          },
          {
            label: 'Classici',
            tab: 'Cocktail',
            dishes: [
              { name: 'Spritz', price: '€ 5' },
              { name: 'Negroni', price: '€ 8' },
              { name: 'Gin tonic', description: 'Gin a scelta dalla bottigliera', price: 'da € 8' },
            ],
          },
          {
            label: 'Analcolici',
            tab: 'Analcolici',
            dishes: [
              { name: 'Spremuta del giorno', price: '€ 4' },
              { name: 'Cold brew tonic', price: '€ 5' },
            ],
          },
        ],
      },
    },
    {
      type: 'highlight',
      id: 'eventi',
      navLabel: 'Eventi',
      enabled: true,
      data: {
        title: 'Le serate',
        lead: 'Musica dal vivo, degustazioni e serate a tema: il calendario cambia ogni mese.',
        items: [
          { title: 'Giovedì vinile', text: 'Dj set in vinile dalle 19, aperitivo lungo.' },
          { title: 'Venerdì live', text: 'Concerti acustici in dehors, ingresso libero.' },
          {
            title: 'Domenica brunch',
            text: 'Dalle 11 alle 15, dolce e salato, anche da asporto.',
          },
        ],
        images: [
          { src: '/presets/bar/image.svg', alt: 'Serata live in dehors' },
          { src: '/presets/bar/image.svg', alt: 'Il banco del bar' },
          { src: '/presets/bar/image.svg', alt: 'Il dehors al tramonto', wide: true },
        ],
      },
    },
    {
      type: 'gallery',
      id: 'galleria',
      navLabel: 'Galleria',
      enabled: true,
      data: {
        images: [
          { src: '/presets/bar/image.svg', alt: 'Colazione al banco' },
          {
            src: '/presets/bar/image.svg',
            alt: 'Cocktail signature',
            caption: 'I signature di stagione',
          },
          { src: '/presets/bar/image.svg', alt: 'Il dehors', wide: true },
          { src: '/presets/bar/image.svg', alt: 'Il dehors al tramonto' },
          { src: '/presets/bar/image.svg', alt: 'La torrefazione, ogni settimana' },
        ],
      },
    },
    {
      type: 'testimonials',
      id: 'recensioni',
      enabled: true,
      data: {
        eyebrow: 'DICONO DI NOI',
        title: 'Dal banco',
        lead: 'Tre voci fra i clienti abituali.',
        items: [
          {
            quote:
              'Il miglior espresso della zona, e lo dico da romano trapiantato. Il cornetto alle 7 è un rito.',
            author: 'Giulia S.',
            meta: 'Cliente del mattino',
            rating: 5,
          },
          {
            quote: 'Aperitivo con cucina vera, non le patatine. Vermut della casa da provare.',
            author: 'Davide L.',
            meta: 'Aperitivo del giovedì',
            rating: 5,
          },
          {
            quote:
              'Il dj set del giovedì vinile è la cosa più bella che sia capitata al quartiere.',
            author: 'Nadia F.',
            meta: 'Serata vinile',
            rating: 4,
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
        lead: 'Le risposte veloci, come al banco.',
        items: [
          {
            question: 'Si può prenotare un tavolo per l’aperitivo?',
            answer:
              'Per gruppi da 6 in su sì, dal pulsante «Ordina al tavolo» o al telefono; sotto i 6 si viene e ci si siede.',
          },
          {
            question: 'Organizzate feste private?',
            answer:
              'Sì: la sala interna ospita fino a 40 persone, con drink list dedicata e dj a richiesta.',
          },
          {
            question: 'Avete latte vegetale e opzioni senza glutine?',
            answer:
              'Avena e soia sempre; per il senza glutine chiedete al banco, i lievitati cambiano ogni giorno.',
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
        lead: 'Nel cuore del quartiere, dove passano tutti almeno una volta al giorno.',
        mapsLabel: 'Apri in Google Maps',
        image: { src: '/presets/bar/image.svg', alt: 'Mappa della zona' },
        items: [
          {
            icon: 'fa6-solid:train-subway',
            title: 'Metro',
            text: 'Fermata «Porta Nuova» a 3 minuti a piedi, uscita lato giardini.',
          },
          {
            icon: 'fa6-solid:person-biking',
            title: 'In bici',
            text: 'Rastrelliere davanti al dehors; stazione bike sharing all’angolo.',
          },
          {
            icon: 'fa6-solid:moon',
            title: 'Di sera',
            text: 'Zona a traffico limitato dalle 20: parcheggio nel garage di via Roma, 200 metri.',
          },
        ],
      },
    },
  ],
};
