export const PRIMARY_NAV = [
  { href: '/#piscina', label: 'Piscina' },
  { href: '/#orari', label: 'Orari' },
  { href: '/#prezzi', label: 'Prezzi' },
  { href: '/#servizi', label: 'Servizi' },
  { href: '/#regolamento', label: 'Regolamento' },
  { href: '/#bar', label: 'Bar' },
] as const;

export const FOOTER_NAV = [
  { href: '/terms', label: 'Termini' },
  { href: '/policy', label: 'Privacy' },
  { href: '/cookie', label: 'Cookie' },
  { href: '/regolamento', label: 'Regolamento' },
  { href: '/trasparenza', label: 'Trasparenza' },
  { href: '/mappa-del-sito', label: 'Mappa del sito' },
] as const;

export type NavEntry = (typeof PRIMARY_NAV)[number] | (typeof FOOTER_NAV)[number];
