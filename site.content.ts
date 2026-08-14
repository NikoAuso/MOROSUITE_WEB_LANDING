import { content as presetContent } from './presets/piscina';

/**
 * Il file del DEPLOY: sceglie il preset e applica gli override.
 *
 * La selezione del preset sono DUE import, che devono puntare allo stesso
 * verticale:
 *   1. quello qui sopra (struttura, copy e dati demo);
 *   2. l'@import del tema in src/styles/tokens.css (palette, al build).
 * Non esiste un campo `preset` in site.config.ts di proposito: sarebbe una
 * terza dichiarazione che può divergere dalle due che fanno davvero fede.
 *
 * Override: parti dal contenuto del preset e sostituisci per sezione —
 * il merge è una sostituzione esplicita, non un deep-merge.
 *
 *   export const siteContent: SiteContent = {
 *     ...presetContent,
 *     meta: { ...presetContent.meta, titleSuffix: 'Il tuo claim' },
 *     sections: presetContent.sections.map((s) =>
 *       s.type === 'hero' ? { ...s, data: { ...s.data, title: 'Titolo del cliente' } } : s,
 *     ),
 *   };
 */
export const siteContent = presetContent;

/**
 * I payload serviti quando una sezione (o l'intero deploy) è in modalità
 * statica, e in DEMO_MODE. Il default sono i dati demo del preset; un deploy
 * statico li sostituisce con i propri dati reali, ad esempio:
 *
 *   import type { OpeningHoursPayload } from '@/lib/dto';
 *   import { DEMO_DATA } from './presets/piscina';
 *   const REAL_HOURS: OpeningHoursPayload = { timezone: 'Europe/Rome', daily_hours: [...] };
 *   export const STATIC_DATA = { ...DEMO_DATA, '/site/opening-hours': REAL_HOURS };
 */
export { DEMO_DATA as STATIC_DATA } from './presets/piscina';
