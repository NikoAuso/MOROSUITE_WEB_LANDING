# Contributing

Grazie per il contributo. L'obiettivo del kit: componenti generici, preset per verticale, zero copy
di business sotto `src/`.

## Setup

```bash
npm install
cp .env.example .env   # DEMO_MODE=true: gira senza backend
npm run dev            # http://localhost:4321
```

Node **22+**, solo npm (il lock è `package-lock.json`).

## Prima di aprire una PR

In ordine, tutti verdi:

```bash
npm run check    # astro check + tsc
npm run lint
npm run format:check
npm test
```

Per modifiche a rendering o data layer, anche le E2E:

```bash
npm run test:e2e && npm run test:e2e:degraded && npm run test:e2e:empty
```

## Convenzioni (le guardie le fanno rispettare)

- **Niente copy in `src/`**: le stringhe di pagina stanno nei preset/`site.content.ts`, quelle di
  degradazione in `src/lib/copy.ts`, le etichette attorno ai dati backend nei content type
  (`todayLabel`, `freeLabel`, ...).
- **Niente tinte grezze d'identità**: solo utility `brand-*`/`cta-*`/`accent-*`; la palette vive in
  `presets/<tema>/theme.css`. `src/lib/theme-tokens.test.ts` fallisce altrimenti.
- **Aggiungere una sezione** = `*Content` type + membro `EnabledSection` in `sections.ts` +
  componente `{ id, content }` + `case` in `index.astro`. Lo switch è esaustivo (`satisfies never`):
  il case mancante è un errore di build.
- **Contract-first**: i tipi in `dto.ts`/`sections.ts` cambiano PRIMA dei consumatori; poi si
  allinea `BACKEND_CONTRACT.md`.
- **E2E**: mai cablare copy o ancore del deploy nelle spec — le attese si derivano da
  `site.content.ts` e `FALLBACK_COPY` (vedi `homepage.spec.ts`).
- **Data layer**: tutto passa da `src/lib/api.ts` (`T | null`, mai throw); gli href da dati esterni
  passano da `safeHref`.

## Commit & PR

Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`), PR focalizzate, descrivi come hai
verificato.
