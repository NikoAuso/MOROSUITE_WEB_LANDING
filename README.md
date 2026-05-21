# Public Site Template

Template **white-label** in Astro 6 (SSR) per il sito pubblico di marketing di una struttura ricettiva (un deploy per
sito). I dati dinamici (identità del sito, orari, tariffe, link CTA, contenuti legali) vengono recuperati **a
ogni richiesta** da un backend HTTP che implementa il contratto descritto in [`src/lib/dto.ts`](src/lib/dto.ts), sotto
un unico base URL configurabile e autenticando ogni chiamata con un Bearer token.

L'output di `npm run build` è un **server Node standalone** (`dist/server/entry.mjs`) pensato per girare su VPS / container
sotto un process manager (PM2, systemd, Docker), tipicamente dietro un reverse proxy (Nginx, Caddy).

## Stack tecnologico

- **Astro 6** in modalità `output: 'server'` con adapter `@astrojs/node` (`mode: 'standalone'`) e `trailingSlash: 'never'`
- **Tailwind 4** CSS-first (`@theme` in `src/styles/tokens.css`, nessun `tailwind.config.ts`)
- **TypeScript 5** con path alias `@/*` → `src/*` e `@config` → `./site.config.ts`
- **`marked`** per il rendering dei documenti legali (markdown → HTML)
- **Vitest** per i test unit della cache layer
- **Playwright** per i test E2E (suite `ok`, `degraded`, `empty`) e **Lighthouse CI** per i gate di performance/SEO
- Cache in-process con TTL configurabile (default 300 s) + single-flight su `src/lib/api.ts`
- Target di deploy: **server Node** (VPS, container, PaaS)

## Prerequisiti

| Requisito    | Versione minima                                                                |
|--------------|--------------------------------------------------------------------------------|
| Node.js      | **22+** (vedi `engines.node` in `package.json`)                                |
| npm          | versione bundle con Node 22                                                    |
| Backend HTTP | istanza raggiungibile che esponga gli endpoint del contratto e accetti Bearer  |
| Git          | per clonare il repo                                                            |

> Il progetto **non** utilizza pnpm né yarn: usare esclusivamente `npm` per evitare disallineamenti su
> `package-lock.json`.

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

   Crea un `.env` (o passa le variabili al process manager in produzione):

   | Variabile                   | Obbligatoria in prod? | Default (dev)                         | Descrizione                                                                                              |
   | --------------------------- | --------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
   | `API_BASE_URL`              | sì                    | `http://127.0.0.1:8000/api/public/v1` | Radice del backend. Le URL complete vengono composte come `${API_BASE_URL}/${FACILITY_SLUG}/site`, ecc.  |
   | `FACILITY_SLUG`             | sì                    | `demo`                                | Slug della facility servita da questo deploy. Inserito subito dopo `/v1/` in ogni URL del backend.       |
   | `API_AUTH_TOKEN`            | sì                    | _vuoto_                               | Bearer token inviato in `Authorization` su tutte le chiamate (eccetto `/up`).                            |
   | `PUBLIC_SITE_URL`           | sì                    | `http://localhost:4321`               | URL canonico del sito (canonical, sitemap, OG).                                                          |
   | `CACHE_TTL_SECONDS`         | no                    | `300`                                 | TTL (secondi) della cache in-process per ogni endpoint del backend.                                      |
   | `PUBLIC_GA4_MEASUREMENT_ID` | no                    | _vuoto_                               | ID misurazione GA4 (consent-mode v2). Vuoto = nessuno script gtag iniettato.                             |
   | `PORT` / `HOST`             | no                    | adapter Node defaults                 | Porta e indirizzo di bind del server SSR.                                                                |

   > `API_AUTH_TOKEN` **non** ha prefisso `PUBLIC_`: vive solo lato server e non viene mai esposto al browser. `src/lib/api.ts`
   > non lo logga mai (i log degli errori contengono solo URL e status code).

   > I valori in `.env` (e, in produzione, in `process.env`) hanno la **precedenza** sui valori dichiarati in
   > `site.config.ts`. Importa sempre `@/lib/config` (e non `@config` diretto) dal codice runtime perché gli override env
   > vengano applicati.

## Avvio

### Sviluppo locale (HMR)

```bash
npm run dev
```

Dev server su [`http://localhost:4321`](http://localhost:4321) con hot-reload. Ogni navigazione chiama il backend; se il
backend è giù vedrai gli stati "non disponibile" inline (e 503 per le pagine principali se manca `/site`).

### Build di produzione

```bash
npm run build
```

Produce `dist/server/entry.mjs` (entry Node) e `dist/client/` (asset statici).

### Avvio del server di produzione

```bash
node ./dist/server/entry.mjs
```

Lo stesso comando è esposto da `npm run preview` per testare il build in locale.

### Esempio: gira sotto PM2

```bash
# ecosystem.config.cjs minimo
module.exports = {
  apps: [{
    name: 'public-site',
    script: './dist/server/entry.mjs',
    env: {
      HOST: '127.0.0.1',
      PORT: '4321',
      API_BASE_URL: 'https://api.example.com/api/public/v1',
      API_AUTH_TOKEN: '...',
      PUBLIC_SITE_URL: 'https://www.example.com',
      CACHE_TTL_SECONDS: '300',
    },
  }],
};
```

```bash
pm2 start ecosystem.config.cjs
pm2 logs public-site
```

Per il TLS, gzip e per servire `dist/client/` direttamente (evitando il roundtrip a Node sugli asset statici), mettici
Nginx o Caddy davanti.

### Healthcheck

`GET /health` ritorna sempre `200 OK` con body JSON:

```json
{
  "status": "ok",
  "backend_reachable": true,
  "backend_up": true,
  "timestamp": "2026-05-21T20:00:00.000Z"
}
```

- `backend_up`: `true` se il backend risponde 2xx a `GET ${host root}/up` (senza auth, timeout 2 s).
- `backend_reachable`: `true` se `api.site()` ritorna non-null (riesce a leggere `/site` con il token configurato).
- `status`: `'ok'` se entrambi sono true, `'degraded'` altrimenti.

Diagnostica rapida: se vedi `backend_up: true` ma `backend_reachable: false` → il backend è vivo ma `API_AUTH_TOKEN` è
sbagliato o `/site` è rotto.

## Script disponibili

| Comando                       | Scopo                                                                                |
|-------------------------------|--------------------------------------------------------------------------------------|
| `npm run dev`                 | Dev server con HMR su `:4321`                                                        |
| `npm run build`               | SSR build in `dist/server/entry.mjs` + asset client in `dist/client/`                |
| `npm run preview`             | Avvia `node ./dist/server/entry.mjs` per testare il build localmente                 |
| `npm run check`               | `astro check` + `tsc --noEmit` (esegui prima di considerare un task ok)              |
| `npm run lint`                | ESLint (configurazione flat in `eslint.config.js`)                                   |
| `npm run format`              | Prettier in modalità write (`format:check` per la sola lettura)                      |
| `npm test`                    | Vitest — test unit della cache layer (cache, single-flight, auth, null normalization)|
| `npm run test:e2e`            | Playwright E2E (mock backend in modalità `ok`, avvia mock + SSR automaticamente)     |
| `npm run test:e2e:degraded`   | Playwright con backend irraggiungibile — verifica 503 + inline fallback              |
| `npm run test:e2e:empty`      | Playwright con payload vuoti — verifica `<ErrorState>` e CTA disabilitati            |
| `npm run test:lh`             | Lighthouse CI (perf ≥ 0.9, SEO ≥ 0.95, a11y warn ≥ 0.9)                              |

Lanciare una singola spec E2E:

```bash
npx playwright test --config tests/e2e/playwright.config.ts tests/e2e/cta.spec.ts
```

Aggiungi `--ui` per la modalità interattiva.

## Contratto API

L'applicazione è agnostica rispetto all'implementazione del backend: chiunque può servire i dati, purché rispetti il
contratto definito in [`src/lib/dto.ts`](src/lib/dto.ts). Tutti i payload sono `application/json`; le risorse vivono
sotto l'unico base URL configurato in `API_BASE_URL`. Il backend è un servizio esterno: il template non ne ospita
alcuna parte.

| Metodo | Path                  | DTO di risposta       | Pagine che lo consumano                |
|--------|-----------------------|-----------------------|----------------------------------------|
| `GET`  | `/site`               | `SitePayload`         | Layout pubblico (header/footer), home  |
| `GET`  | `/site/opening-hours` | `OpeningHoursPayload` | Home (sezione orari)                   |
| `GET`  | `/site/pricing`       | `PricingPayload`      | Home (sezione tariffe)                 |
| `GET`  | `/legal/{doc}`        | `LegalPayload`        | `/policy`, `/cookie`                   |

Dove `{doc}` ∈ `policy | cookie`. I termini di servizio dell'app di booking e il regolamento operativo della struttura
**non** sono compito di questo template (i primi vivono nell'app di booking; il regolamento è renderizzato inline come
sezione `#regolamento` nella homepage).

In aggiunta, il backend deve esporre `GET /up` **alla radice dell'host** (non sotto il prefisso `/api/public/v1/...`),
**senza autenticazione**, che ritorni `200 OK` se il servizio è vivo. Lo `/health` del template lo usa come probe.

Per ogni campo (obbligatorio/opzionale, formato, esempi) consultare il JSDoc nel file
[`src/lib/dto.ts`](src/lib/dto.ts). In caso di errore il backend deve rispondere con status HTTP `>= 400` e payload
`ApiError` `{ error: { code, message } }`.

### Autenticazione

Tutte le richieste verso `API_BASE_URL` includono l'header `Authorization: Bearer ${API_AUTH_TOKEN}`. L'unica eccezione è
la probe a `/up` (healthcheck), inviata senza header per convenzione.

Non serve CORS lato backend: le chiamate avvengono server-to-server dal processo Node del template, mai dal browser.

### Resilienza alle interruzioni del backend

Il template **non lancia eccezioni** quando il backend è giù, è lento o restituisce errori: ogni wrapper di
`src/lib/api.ts` cattura il fallimento e restituisce `null`. I componenti gestiscono il `null` in modo esplicito:

- **`SitePayload === null`** → la pagina risponde **HTTP 503** con `Retry-After: 60` e renderizza
  `<ServiceUnavailable />` (template HTML autonomo, no header/footer).
- **`OpeningHoursPayload === null`** o `daily_hours` vuoto → la sezione orari mostra `<ErrorState>` "Orari non disponibili".
- **`PricingPayload === null`** o `has_prices: false` → la sezione prezzi mostra `<ErrorState>` "Listino non disponibile".
- **`LegalPayload === null`** o `body` vuoto → la pagina legal mostra `<ErrorState>` "Documento temporaneamente non disponibile" (status 200, header/footer normali).
- **`SitePayload.links.<cta> === null`** → il `<CtaButton>` renderizza un bottone disabilitato con copy "Non disponibile" (o si nasconde, per il link `hotel`).

Tutti i testi di fallback sono centralizzati in [`src/lib/copy.ts`](src/lib/copy.ts).

La cache layer **memorizza anche i `null`** per `CACHE_TTL_SECONDS`: questo evita che un'outage del backend faccia
attivare retry+timeout su ogni richiesta utente. Le richieste concorrenti per la stessa chiave vengono coalescate
(single-flight). Per forzare un refresh, riavvia il processo Node.

> **Trust boundary**: il campo `LegalPayload.body` viene renderizzato senza sanitizzazione (markdown → HTML via
> `set:html`). Servi questi contenuti solo da autori interni fidati o aggiungi un sanitizer prima di modificare il
> contratto.

## White-label di un nuovo deploy

1. Fork o branch del repo.
2. Modifica `site.config.ts` (solo branding e identità per-deploy):
   - `siteSlug` — deve coincidere con `SitePayload.slug` restituito da `GET /site` sul backend target.
   - `brand.primaryColor`, `brand.accentColor`, `brand.logoUrl`, `brand.faviconUrl`, `brand.ogImageUrl` — logo, favicon
     e immagine OG sono URL **assoluti** ad asset hostati, non file locali.
3. Imposta le env vars del deploy (tabella sopra). Obbligatorie in produzione: `API_BASE_URL`, `API_AUTH_TOKEN`,
   `PUBLIC_SITE_URL`.
4. Build + start:
   ```bash
   npm ci && npm run build
   node ./dist/server/entry.mjs
   ```
   Esegui sotto PM2 / systemd / Docker per il restart automatico e dietro Nginx/Caddy per TLS+gzip.
5. Smoke test post-deploy: `curl https://<sito>/health` deve restituire `{"status":"ok",...}`.

## Convenzioni e accortezze

- **CTA esterne** (booking, login, register, hotel): renderizza sempre con
  `<CtaButton link={site.links.<cta>} fallbackLabel={...} />`, mai con un `<a>` raw o un URL hardcoded. Esiste un test E2E
  (`tests/e2e/cta.spec.ts`) che fallisce se un link `login`/`prenota` risolve a `http://localhost:4321/...`.
- **Navigazione hardcoded**: header/footer in `src/lib/navigation.ts`. Regolamento, Bar, Servizi sono altrettanto
  hardcoded nelle relative `.astro`. Per personalizzazioni: fork e edit.
- **Markdown legale fidato**: `src/lib/markdown.ts` esegue `marked.parse` con `set:html` **senza sanitizzazione**. Non
  modificare senza aggiungere un sanitizer.
- **Tailwind 4 CSS-first**: aggiungi token in `src/styles/tokens.css` tramite `@theme { --... }`, non in JS.
- **Path aliases**: usa `@/lib/config` (non `@config`) nel codice runtime per rispettare gli override env.
- **Cookie consent**: `CookieBanner.astro` persiste la scelta in `localStorage` (`cookie_consent`) con TTL di 6 mesi
  (Garante 10/06/2021) e invoca `gtag('consent', 'update', ...)`. Il banner riappare allo scadere del TTL; non esiste un
  controllo per modificare la scelta dopo.
- **Trailing slash**: `astro.config.mjs` impone `trailingSlash: 'never'`. Mantieni gli href interni senza slash finale.
- **`/health`** vive su `/health`, non `/_health`: Astro esclude le route con prefisso `_` dal route table.
