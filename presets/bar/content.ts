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
        courses: [
          {
            label: 'Signature',
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
            dishes: [
              { name: 'Spritz', price: '€ 5' },
              { name: 'Negroni', price: '€ 8' },
              { name: 'Gin tonic', description: 'Gin a scelta dalla bottigliera', price: 'da € 8' },
            ],
          },
          {
            label: 'Analcolici',
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
        ],
      },
    },
  ],
};
