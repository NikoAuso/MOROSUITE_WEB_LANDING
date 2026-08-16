# Backend contract

The data this kit consumes from a backend, when the deploy default (`dataSource: 'backend'` in
`site.config.ts`) or a single section (`data.source: 'backend'` on `hours`/`pricing`) points there.
This is a human-readable mirror of the authoritative source, [`src/lib/dto.ts`](src/lib/dto.ts) —
**if the two ever disagree, `dto.ts` wins**. Update `dto.ts` first, then this file.

Live responses are **not validated at runtime** (they are cast to the DTO types): the type-check only
guards the committed fixtures (`presets/*/demo-data.ts`), so a backend drift shows up as a wrong or
"non disponibile" section, not as a build break.

A fully static deploy needs **none of this**: the same shapes are then provided by `STATIC_DATA`
(exported by `site.content.ts`, by default the preset's `demo-data.ts`), type-checked at build.

## Transport rules

- **Base URL** — all paths are relative to `${API_BASE_URL}/${FACILITY_SLUG}` (composed in
  `src/lib/config.ts`).
- **Auth** — every request carries `Authorization: Bearer ${API_AUTH_TOKEN}` when the token is set
  (an empty token sends no header). The one exception is the liveness probe `GET /up`, called
  **without** auth at the host root.
- **Content-Type** — responses MUST be `application/json`.
- **Null over omit** — return unknown/empty values as `null` rather than omitting the key.
- **Failure handling** — on error return an [`ApiError`](#error-envelope) with HTTP status ≥ 400.
  The kit never throws: any failure becomes `null` and the affected section shows an explicit
  "non disponibile" state. A `null` `/site` makes the page return **HTTP 503** (the static path
  never hits the network, but a missing/incomplete `STATIC_DATA['/site']` yields the same 503).
- **"Empty in a significant way" = null** — `daily_hours: null` or `[]` (hours), `has_prices: false`
  or both `entrance_sections` and `pass_sections` empty (pricing) collapse to the "non disponibile"
  state even on a 200.

## Endpoints

| Method & path             | Response                                        | Notes                                                     |
| ------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| `GET /site`               | [`SitePayload`](#get-site)                      | `null` ⇒ page 503 (backend mode)                          |
| `GET /site/opening-hours` | [`OpeningHoursPayload`](#get-siteopening-hours) | `daily_hours: null` ⇒ "non disponibile"                   |
| `GET /site/pricing`       | [`PricingPayload`](#get-sitepricing)            | `has_prices: false` ⇒ "non disponibile"                   |
| `GET /up`                 | any 2xx                                         | liveness probe, **no auth**, host root; used by `/health` |

## `GET /site`

Identity and presentation data. Drives header/footer, GDPR mentions, social links, JSON-LD, CTAs.

| Field                     | Type             | Description                                                                                                                                                                                                                                        |
| ------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slug`                    | `string \| null` | MUST equal the deploy's `FACILITY_SLUG`; the kit logs a warning on mismatch                                                                                                                                                                        |
| `name`                    | `string \| null` | full commercial name (title/OG fallback)                                                                                                                                                                                                           |
| `short_name`              | `string \| null` | header/tight spots                                                                                                                                                                                                                                 |
| `tagline`                 | `string \| null` | meta-description fallback + footer blurb                                                                                                                                                                                                           |
| `default_locale`          | `string \| null` | drives `<html lang>`; `null`/empty falls back to the kit config                                                                                                                                                                                    |
| `online_bookings_enabled` | `boolean`        | **kill switch**: `false` nulls `links.booking`, disabling every booking CTA regardless of the link sent                                                                                                                                            |
| `contacts`                | object           | `email`, `phone`, `whatsapp` (digits are extracted for `wa.me`), `website` — each optional, `string \| null`                                                                                                                                       |
| `address`                 | object           | `street`, `locality`, `region`, `postal_code`, `country` (ISO-3166-1 α2), `google_maps_url` — each optional, `string \| null`. **Required object** (footer dereferences it)                                                                        |
| `gdpr`                    | object           | `titolare`, `email_privacy`, `email_security` — `string \| null`. **Required object** (legal pages render it)                                                                                                                                      |
| `social`                  | object           | `instagram`, `facebook`, `tiktok` — each optional, `string \| null`; hrefs pass a scheme allow-list                                                                                                                                                |
| `season`                  | object `\| null` | `{ start_date, end_date }` ISO-8601 (each `string \| null`) or `null` for year-round venues. **Never fatal**: a null season or null date only hides its card                                                                                       |
| `links`                   | object           | `booking`, `login`, `manager`, `hotel` — each `{ label, url } \| null`. Labels render verbatim (`login`/`manager` may be overridden or hidden per deploy via `headerLinks` in `site.config.ts`); URLs pass `safeHref` (http/https/mailto/tel only) |

## `GET /site/opening-hours`

| Field         | Type            | Description                                                                                                                                                                                                                                                                                                                             |
| ------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `daily_hours` | array `\| null` | 7 entries `{ key, label, closed, intervals }`; `key` is the lowercase English weekday; `intervals` = `{ slot, label, open, close }` with `HH:mm` times. `key`/`closed` drive the "today" badge, the closed label and the JSON-LD; `label`/`open`/`close` are rendered; the `slot` enum (`morning\|afternoon\|evening`) is contract-only |
| `timezone`    | `string`        | IANA zone used for the "today" highlight                                                                                                                                                                                                                                                                                                |

## `GET /site/pricing`

| Field                           | Type             | Description                                                                                                                                                                                                                     |
| ------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `active_price_list_name`        | `string \| null` | display name of the active list                                                                                                                                                                                                 |
| `has_prices`                    | `boolean`        | `false` ⇒ section shows the unavailable state                                                                                                                                                                                   |
| `entrance_count` / `pass_count` | `number`         | informative; the kit recomputes badges from the visible rows                                                                                                                                                                    |
| `entrance_sections`             | array            | `{ label, rows }`; rows `{ label, range, weekday_value, weekend_value, weekday_is_free, weekend_is_free }` — prices in currency major units, `null` renders as em-dash, `*_is_free` wins over the value                         |
| `pass_sections`                 | array            | `{ label, allows_umbrella_booking?, rows }`; rows `{ label, range, value, is_free }`. `allows_umbrella_booking` is **optional and pool-specific**: the fine-print renders only on an explicit `false` — other verticals omit it |

## Error envelope

```json
{ "error": { "code": "string", "message": "string" } }
```

Returned with HTTP ≥ 400. The kit tolerates any failure shape — this is the courteous one.
