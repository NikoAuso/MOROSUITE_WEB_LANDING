# Public Site Template

Template **white-label** in Astro 6 per il sito pubblico di marketing di una struttura ricettiva (un deploy per sito). I
dati dinamici (identità del sito, orari, tariffe, contenuti legali, dati di trasparenza) vengono recuperati **a
build-time** da un backend HTTP che implementa il contratto descritto in [`src/lib/dto.ts`](src/lib/dto.ts) sotto un
unico base URL configurabile.

L'output in `dist/` è completamente statico ed è pensato per essere pubblicato su Cloudflare Pages.

## Stack tecnologico

- **Astro 6** in modalità `output: 'static'` con `trailingSlash: 'never'`
- **Tailwind 4** CSS-first (`@theme` in `src/styles/tokens.css`, nessun `tailwind.config.ts`)
- **TypeScript 5** con path alias `@/*` → `src/*` e `@config` → `./site.config.ts`
- **`marked`** per il rendering dei documenti legali (markdown → HTML)
- **Playwright** per i test E2E e **Lighthouse CI** per i gate di performance/SEO
- Fetcher a build-time (`src/lib/api.ts`) con retry esponenziale + memoizzazione per processo
- Target di deploy: **Cloudflare Pages**

## Prerequisiti

| Requisito    | Versione minima                                                              |
|--------------|------------------------------------------------------------------------------|
| Node.js      | **22.12+** (vedi `engines.node` in `package.json`)                           |
| npm          | versione bundle con Node 22                                                  |
| Backend HTTP | un'istanza raggiungibile che esponga gli endpoint del contratto (vedi sotto) |
| Git          | per clonare il repo                                                          |

> Il progetto **non** utilizza pnpm né yarn: usare esclusivamente `npm` per evitare disallineamenti su
`package-lock.json`.

## Installazione

1. **Clona il repository**

   ```bash
   git clone <url-del-repo>
   cd <nome-cartella-del-repo>
   ```

2. **Installa le dipendenze**

   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**

   Copia il file di esempio e adatta i valori al tuo ambiente:

   ```bash
   cp .env.example .env
   ```

   Tutte le variabili sono tecnicamente opzionali in dev: in assenza, i tre URL ricadono sui fallback `DEMO_*` definiti in `src/lib/config.ts` (e su `astro.config.mjs` per `PUBLIC_SITE_URL`). In produzione **vanno sempre valorizzate**.

   | Variabile                   | Fallback (in dev)                         | Descrizione                                                                                  |
   | --------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
   | `API_BASE_URL`              | `http://localhost:8765/api/public/v1`     | URL **assoluto** del backend che implementa il contratto (vedi `src/lib/dto.ts`).            |
   | `PUBLIC_SITE_URL`           | `http://localhost:4321`                   | URL canonico del sito (usato per canonical, sitemap, OG).                                    |
   | `PUBLIC_GA4_MEASUREMENT_ID` | _vuoto_                                   | ID misurazione Google Analytics 4 (consent-mode v2). Vuoto = nessuno script gtag iniettato.  |
   | `REVALIDATE_SECRET`         | —                                         | Secret per eventuali revalidate hook.                                                        |
   | `SITEMAP_PING_GOOGLE`       | —                                         | Abilita il ping della sitemap a Google in build di produzione.                               |

   > Tutti i link CTA (prenotazione, login, registrazione, sito hotel) sono forniti dal backend come parte di `SitePayload.links`: non esiste più un `APP_BASE_URL` configurabile lato sito perché ogni URL viaggia con la sua label.

   > Le variabili in `.env` hanno la **precedenza** sui valori dichiarati in `site.config.ts`: usa sempre
   `@/lib/config` (e non `@config`) dal codice runtime per applicare correttamente gli override.

4. **(Opzionale) Verifica che il backend sia raggiungibile**

   Il build chiama gli endpoint del contratto in fase di pre-render. Se l'API non risponde, **il build non fallisce**: ogni wrapper di `src/lib/api.ts` ha un fallback intrinseco (`EMPTY_*` in `src/lib/dto.ts`) e la pagina viene generata con sezioni vuote o nascoste. Le pagine legali, in mancanza del documento, mostrano una `<ErrorState>` esplicita.

## Avvio

### Sviluppo locale (HMR)

```bash
npm run dev
```

Il dev server si avvia su [`http://localhost:4321`](http://localhost:4321) con hot-reload. Le chiamate al backend
vengono memoizzate per processo: modifiche ai dati richiedono il riavvio del server.

### Build di produzione

```bash
npm run build
```

Genera il bundle statico nella cartella `dist/`. Pronto per essere servito da qualsiasi CDN (deploy target raccomandato:
Cloudflare Pages).

### Anteprima del build

```bash
npm run preview
```

Serve localmente il contenuto di `dist/` per validare il risultato finale prima del deploy.

## Script disponibili

| Comando            | Scopo                                                                   |
|--------------------|-------------------------------------------------------------------------|
| `npm run dev`      | Dev server con HMR su `:4321`                                           |
| `npm run build`    | Build statica in `dist/` (non fallisce in caso di API down: usa fallback)|
| `npm run preview`  | Servizio locale di `dist/` per anteprima post-build                     |
| `npm run check`    | `astro check` + `tsc --noEmit` (esegui prima di considerare un task ok) |
| `npm run lint`     | ESLint (configurazione flat in `eslint.config.js`)                      |
| `npm run format`   | Prettier in modalità write (`format:check` per la sola lettura)         |
| `npm run test:e2e` | Playwright E2E (avvia automaticamente `preview` tramite `webServer`)    |
| `npm run test:lh`  | Lighthouse CI (perf ≥ 0.9, SEO ≥ 0.95, a11y warn ≥ 0.9)                 |

Per lanciare una singola spec E2E:

```bash
npx playwright test --config tests/e2e/playwright.config.ts tests/e2e/seo.spec.ts
```

Aggiungi `--ui` per la modalità interattiva.

## Contratto API

L'applicazione è agnostica rispetto all'implementazione del backend: chiunque può servire i dati, purché rispetti il
contratto definito in [`src/lib/dto.ts`](src/lib/dto.ts). Tutti i payload sono `application/json`; le risorse vivono
sotto l'unico base URL configurato in `API_BASE_URL`. Il backend è un servizio esterno: il template non ne ospita
alcuna parte e l'unico collegamento avviene tramite questa env var.

| Metodo | Path                   | DTO di risposta       | Pagine che lo consumano                      |
|--------|------------------------|-----------------------|----------------------------------------------|
| `GET`  | `/site`                | `SitePayload`         | Layout pubblico (header/footer), home        |
| `GET`  | `/site/opening-hours`  | `OpeningHoursPayload` | Home (sezione orari)                         |
| `GET`  | `/site/pricing`        | `PricingPayload`      | Home (sezione tariffe)                       |
| `GET`  | `/legal/{doc}`         | `LegalPayload`        | `/policy`, `/cookie`                         |
| `GET`  | `/seo/structured-data` | `SeoPayload`          | Layout pubblico (JSON-LD nel `<head>`)       |

Dove `{doc}` ∈ `policy | cookie`. I termini di servizio dell'app di booking e il regolamento operativo della struttura **non** sono compito di questo template (i primi vivono nell'app di booking; il regolamento è renderizzato inline come sezione `#regolamento` nella homepage).

Per ogni campo (obbligatorio/opzionale, formato, esempi) consultare il JSDoc nel file [
`src/lib/dto.ts`](src/lib/dto.ts). In caso di errore il backend deve rispondere con status HTTP `>= 400` e payload
`ApiError` `{ error: { code, message } }`.

### Resilienza alle interruzioni del backend

Il template **non fallisce** quando il backend è offline o restituisce errore: ogni wrapper di `src/lib/api.ts` cattura l'errore e restituisce un payload **placeholder** definito in [`src/lib/placeholders.ts`](src/lib/placeholders.ts). Per evitare che ogni endpoint si mangi il proprio timeout quando l'host è chiaramente irraggiungibile, il fetcher monta un **circuit breaker per host**: la prima `fetch failed` (ECONNREFUSED / DNS / timeout) marca l'host come down e le richieste successive ritornano subito il placeholder senza riprovare. I default in `site.config.ts` (`retries: 1`, `timeoutMs: 3000`) tengono il worst-case sotto ~3 s anche offline.

- I placeholder contengono **dati fittizi visibili** (nome struttura demo, orari di esempio, listino prezzi dimostrativo, documenti legali con corpo Lorem ipsum, transparency con titolare demo, schema.org base). Modifica `src/lib/placeholders.ts` per personalizzare cosa vede l'utente quando l'API non risponde.
- `api.legal(doc)` restituisce sempre un payload (mai `null`): se il documento reale non è raggiungibile, viene mostrata l'anteprima dimostrativa di `PLACEHOLDER_LEGAL[doc]`.
- Esiste anche una pagina `src/pages/404.astro` per le route non esistenti (Astro la emette come `dist/404.html`, servita automaticamente da Cloudflare Pages). Il componente `<ErrorState>` in `src/components/ErrorState.astro` è riutilizzabile per altri stati di errore espliciti.

> **Trust boundary**: il campo `LegalPayload.body` viene renderizzato senza sanitizzazione (markdown → HTML via
`set:html`). Servi questi contenuti solo da autori interni fidati o aggiungi un sanitizer prima di modificare il
> contratto.

## White-label di un nuovo deploy

1. Fork o branch del repo.
2. Modifica `site.config.ts` (solo branding e identità per-deploy):
  - `siteSlug`
  - `brand.primaryColor`, `brand.accentColor`, `brand.logoUrl`, `brand.faviconUrl`, `brand.ogImageUrl`
3. Imposta nell'env del deploy `API_BASE_URL` e `PUBLIC_SITE_URL` (URL per-environment, non hardcoded nel config). Tutti i link CTA li fornisce il backend tramite `SitePayload.links`.
4. Sostituisci `public/images/favicon/*` con i favicon del cliente (le foto demo vivono su CDN esterne tramite gli URL in `site.config.ts`/`PLACEHOLDER_*`).
5. Imposta i secret GitHub corrispondenti per il deploy su Cloudflare Pages.
6. Push su `main` → Cloudflare Pages pubblica automaticamente.

> Il valore di `siteSlug` deve coincidere con quello restituito da `GET /site` (campo `SitePayload.slug`) sul backend
> target.

## Convenzioni e accortezze

- **CTA verso l'app di booking** (booking, login, register): costruisci sempre URL assoluti da `config.appBaseUrl`, ad
  es. `` `${config.appBaseUrl}/prenota` ``. Esiste un test E2E (`tests/e2e/cta.spec.ts`) che fallisce se un link
  `login`/`prenota` viene risolto come URL relativo.
- **Navigazione hardcoded**: le voci di header/footer sono in `src/lib/navigation.ts`. Le categorie mostrate in
  `trasparenza.astro` sono pure hardcoded. Per personalizzazioni per cliente: fork ed edit.
- **Markdown legale fidato**: `src/lib/markdown.ts` esegue `marked.parse` e il risultato è iniettato via `set:html` *
  *senza sanitizzazione**. Non modificare senza aggiungere un sanitizer.
- **Tailwind 4 CSS-first**: aggiungi token in `src/styles/tokens.css` tramite `@theme { --... }`, non in JS.
- **Path aliases**: usa `@/lib/config` invece di `@config` nel codice runtime per rispettare gli override env.
- **Cookie consent**: `CookieBanner.astro` persiste la scelta in `localStorage` (`cookie_consent`) con TTL di 6 mesi (Garante 10/06/2021) e invoca `gtag('consent', 'update', ...)`. Non viene esposto alcun controllo per modificare la scelta successivamente: il banner riappare solo allo scadere del TTL.
- **Trailing slash**: `astro.config.mjs` impone `trailingSlash: 'never'`. Mantieni gli href interni senza slash finale
  per evitare churn dei canonical.
