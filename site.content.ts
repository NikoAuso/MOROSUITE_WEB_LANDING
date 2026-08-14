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

/** Dati demo del preset attivo (serviti da src/lib/api.ts con DEMO_MODE=true). */
export { DEMO_DATA } from './presets/piscina';
