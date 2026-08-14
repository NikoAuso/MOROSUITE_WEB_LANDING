# Site Landing Template

> **Documentazione congelata durante il refactor** (agosto 2026). I documenti estesi (contratto
> backend leggibile, contributing, security policy, template issue/PR) sono stati rimossi e verranno
> ricreati a refactor concluso. Il piano completo è in `docs/VISIONE.md` (locale, non tracciato).

Template Astro 7 SSR white-label: un codebase, N deploy, contenuti e struttura della pagina
pilotati via HTTP dal backend del deploy. Licenza [MIT](./LICENSE).

**Il contratto è il codice**: [`src/lib/dto.ts`](src/lib/dto.ts) (endpoint e payload, JSDoc per
campo) + [`src/lib/sections.ts`](src/lib/sections.ts) (shape di `GET /site/content` e catalogo
sezioni). Ogni drift fra backend e questi tipi è un errore di build, by design.

## Quickstart (demo, zero backend)

```bash
npm install
cp .env.example .env   # contiene DEMO_MODE=true
npm run dev            # http://localhost:4321
```

## Comandi

| Comando                     | Scopo                                              |
| --------------------------- | -------------------------------------------------- |
| `npm run check`             | `astro check` + `tsc --noEmit`                     |
| `npm run lint` / `format`   | ESLint / Prettier (`format:check` è gate CI)       |
| `npm test`                  | Unit (Vitest)                                      |
| `npm run test:e2e`          | E2E, mock backend ok                               |
| `npm run test:e2e:degraded` | E2E, backend irraggiungibile                       |
| `npm run test:e2e:empty`    | E2E, payload vuoti + fallback `/site/content`      |
| `npm run build` / `preview` | Build SSR / esecuzione locale del build con `.env` |

Architettura e convenzioni per lo sviluppo: [`CLAUDE.md`](CLAUDE.md).
