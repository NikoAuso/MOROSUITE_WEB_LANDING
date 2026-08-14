# Backend contract

The data this template consumes from its backend. This is a human-readable mirror of the authoritative source,
[`src/lib/dto.ts`](src/lib/dto.ts) — **if the two ever disagree, `dto.ts` wins** (a mismatch is a build break in the
template's CI, by design). Update `dto.ts` first, then this file.

## Transport rules

- **Base URL** — all paths are relative to `${API_BASE_URL}/${FACILITY_SLUG}` (composed in `src/lib/config.ts`). The
  template appends `/site`, `/site/opening-hours`, `/site/pricing`.
- **Auth** — every request carries `Authorization: Bearer ${API_AUTH_TOKEN}`. The one exception is the liveness probe
  `GET /up` (see below), called **without** auth.
- **Content-Type** — responses MUST be `application/json`.
- **Null over omit** — return unknown/empty values as `null` rather than omitting the key, so the template renders
  fallback UI without optional-chaining gymnastics.
- **Failure handling** — on error return an [`ApiError`](#error-envelope) with HTTP status ≥ 400. The template never
  throws: `src/lib/api.ts` turns any failure (network, non-2xx, timeout) into `null`, and the affected section shows an
  explicit "non disponibile" state. If `GET /site` is `null`, the whole page returns **HTTP 503**.
- **"Empty in a significant way" = null** — a technically-200 response can still be treated as `null`: `daily_hours: null`
  (opening hours) and `has_prices: false` (pricing) both collapse to the "non disponibile" state.

## Endpoints

| Method & path             | Response                                        | Notes                                                                                                                  |
| ------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `GET /site`               | [`SitePayload`](#get-site)                      | `null` ⇒ entire page returns 503                                                                                       |
| `GET /site/opening-hours` | [`OpeningHoursPayload`](#get-siteopening-hours) | `daily_hours: null` ⇒ section hidden                                                                                   |
| `GET /site/pricing`       | [`PricingPayload`](#get-sitepricing)            | `has_prices: false` ⇒ "non disponibile"                                                                                |
| `GET /site/content`       | [`SiteContent`](#get-sitecontent)               | **Optional.** 404 or unusable payload ⇒ the template renders its committed `site.content.ts` instead                   |
| `GET /up`                 | any 2xx                                         | Liveness probe, **no auth**, at the host root (not under the facility slug). Used by `/health` to report `backend_up`. |

---

## `GET /site`

Identity and presentation data. Drives header/footer, hero copy, GDPR mentions, social links, JSON-LD, season metadata.

| Field                     | Type             | Description                                                                                                            |
| ------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `slug`                    | `string \| null` | Stable site slug. MUST equal the deploy's `FACILITY_SLUG`; the template logs a warning on mismatch.                    |
| `name`                    | `string \| null` | Full commercial name. Default page-title / `og:site_name` fallback.                                                    |
| `short_name`              | `string \| null` | Short name for the header logo and tight UI spots.                                                                     |
| `tagline`                 | `string \| null` | One-line claim. Default meta-description fallback.                                                                     |
| `default_locale`          | `string`         | ISO-639-1 locale rendered as `<html lang>` (template config is only the fallback).                                     |
| `online_bookings_enabled` | `boolean`        | Kill switch: `false` makes the template null `links.booking`, disabling every booking CTA regardless of the link sent. |
| `contacts`                | object (below)   | Contact endpoints for footer/contact CTAs.                                                                             |
| `address`                 | object (below)   | Postal address (footer + schema.org).                                                                                  |
| `gdpr`                    | object (below)   | Data-controller identity, shown verbatim in footer and legal pages.                                                    |
| `social`                  | object (below)   | Public profile links; `null` entries hide their icon.                                                                  |
| `season`                  | object (below)   | Coarse seasonal window (ISO-8601).                                                                                     |
| `links`                   | object (below)   | Contextual CTAs. Each entry is `{ label, url }` or `null`.                                                             |

**`contacts`** — all fields optional, `string \| null`:

| Field      | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| `email`    | Contact email.                                                                 |
| `phone`    | Contact phone.                                                                 |
| `whatsapp` | Phone used to build `https://wa.me/<digits>`; non-digits stripped client-side. |
| `website`  | Marketing website distinct from this template, if any.                         |

**`address`** — all fields optional, `string \| null`:

| Field             | Description                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| `street`          | Street address.                                                              |
| `locality`        | City/town.                                                                   |
| `region`          | Province/region.                                                             |
| `postal_code`     | Postal code.                                                                 |
| `country`         | ISO-3166-1 alpha-2 (`IT`, `FR`, …).                                          |
| `google_maps_url` | Canonical Maps URL; if missing the template builds one from locality+region. |

**`gdpr`**:

| Field            | Type             | Description                                       |
| ---------------- | ---------------- | ------------------------------------------------- |
| `titolare`       | `string \| null` | Legal name of the data controller.                |
| `email_privacy`  | `string \| null` | Mailbox for GDPR art. 15–22 requests.             |
| `email_security` | `string \| null` | Mailbox for coordinated vulnerability disclosure. |

**`social`** — all fields optional, `string \| null`: `instagram`, `facebook`, `tiktok`.

**`season`**: `start_date` (`string \| null`, ISO-8601), `end_date` (`string \| null`, ISO-8601).

**`links`** — each value is `{ label: string; url: string }` or `null`:

| Field     | Rendered where                              | Purpose                                                             |
| --------- | ------------------------------------------- | ------------------------------------------------------------------- |
| `booking` | header, hero, pricing tab, bar, regolamento | Primary booking CTA.                                                |
| `login`   | header                                      | **Customer** login CTA (the header's primary button).               |
| `manager` | footer                                      | **Manager / back-office** login. Separate destination from `login`. |
| `hotel`   | header + mobile menu                        | External link to a parent hotel / sister property.                  |

> A `null` link renders a disabled `<CtaButton>` (or is hidden, for `hotel`). Labels are rendered verbatim — the backend
> owns the copy, so multilingual deploys swap them without touching the template.

---

## `GET /site/opening-hours`

Weekly schedule plus the timezone it is expressed in.

| Field         | Type                 | Description                                                              |
| ------------- | -------------------- | ------------------------------------------------------------------------ |
| `daily_hours` | `Array<Day> \| null` | 7 entries (one per weekday). `null` ⇒ the opening-hours block is hidden. |
| `timezone`    | `string`             | IANA zone (e.g. `Europe/Rome`); used to compute the "today" highlight.   |

**`Day`**:

| Field       | Type                | Description                                               |
| ----------- | ------------------- | --------------------------------------------------------- |
| `key`       | `'monday'…'sunday'` | Lowercase English weekday key.                            |
| `label`     | `string`            | Localised label (e.g. "Lunedì").                          |
| `intervals` | `Array<Interval>`   | Open time slots. Empty iff `closed: true`.                |
| `closed`    | `boolean`           | Closed all day. When `true`, `intervals` SHOULD be empty. |

**`Interval`**:

| Field   | Type                                    | Description                  |
| ------- | --------------------------------------- | ---------------------------- |
| `slot`  | `'morning' \| 'afternoon' \| 'evening'` | Category driving copy.       |
| `label` | `string`                                | Localised slot label.        |
| `open`  | `string`                                | Opening time, `HH:mm` (24h). |
| `close` | `string`                                | Closing time, `HH:mm` (24h). |

---

## `GET /site/pricing`

Active price list. The template renders two tabs: single entrances and passes/season tickets.

| Field                    | Type                     | Description                                                  |
| ------------------------ | ------------------------ | ------------------------------------------------------------ |
| `active_price_list_name` | `string \| null`         | Display name (e.g. "Listino 2026"). `null` = no active list. |
| `has_prices`             | `boolean`                | `false` ⇒ template shows a "not available yet" placeholder.  |
| `entrance_count`         | `number`                 | Count of entrance rows across sections (tab badge).          |
| `pass_count`             | `number`                 | Count of pass rows across sections (tab badge).              |
| `entrance_sections`      | `Array<EntranceSection>` | Single-entrance prices, grouped.                             |
| `pass_sections`          | `Array<PassSection>`     | Passes / season tickets, grouped.                            |

**`EntranceSection`**: `label: string`, `rows: Array<EntranceRow>`.

**`EntranceRow`**:

| Field             | Type             | Description                                                     |
| ----------------- | ---------------- | --------------------------------------------------------------- |
| `label`           | `string`         | Row label (e.g. "Intero", "Ridotto").                           |
| `range`           | `string \| null` | Optional age range / qualifier (e.g. "0–3 anni").               |
| `weekday_value`   | `number \| null` | Weekday price (currency major unit). `null` ⇒ em-dash.          |
| `weekend_value`   | `number \| null` | Weekend price. `null` ⇒ em-dash.                                |
| `weekday_is_free` | `boolean`        | Marks the weekday price "Gratis" regardless of `weekday_value`. |
| `weekend_is_free` | `boolean`        | Marks the weekend price "Gratis" regardless of `weekend_value`. |

**`PassSection`**: `label: string`, `allows_umbrella_booking: boolean` (drives a fine-print note), `rows: Array<PassRow>`.

**`PassRow`**:

| Field     | Type             | Description                                         |
| --------- | ---------------- | --------------------------------------------------- |
| `label`   | `string`         | Row label.                                          |
| `range`   | `string \| null` | Optional age range / qualifier.                     |
| `value`   | `number \| null` | Pass price (currency major unit). `null` ⇒ em-dash. |
| `is_free` | `boolean`        | Marks the pass "Gratis" regardless of `value`.      |

---

## `GET /site/content`

**Optional endpoint — the page structure itself.** When implemented, the backend composes the entire homepage: which
sections appear, in what order, whether each one is in the menu, and every string they render. Structure and copy
changes then go live within the cache TTL, with no template redeploy. When not implemented (404), the template renders
the committed `site.content.ts`; the missing endpoint is never an error.

The shape is `SiteContent` from [`src/lib/sections.ts`](src/lib/sections.ts) — the single authoritative definition,
shared with the committed default; it is deliberately not duplicated field-by-field here. In outline:

```jsonc
{
  "meta": {
    "titleSuffix": "Prenota ingresso e ombrellone", // after the venue name in <title>
    "siteNameFallback": "Piscina", // when /site has neither name nor short_name
    "descriptionTemplate": "Scopri %s.", // %s = venue name
  },
  "sections": [
    // ordered; each entry: { type, id, navLabel?, enabled, data }
    { "type": "hero", "enabled": true, "data": {/* HeroContent */} },
    {
      "type": "hours",
      "id": "orari",
      "navLabel": "Orari",
      "enabled": true,
      "data": {/* HoursContent */},
    },
  ],
}
```

Rules the template enforces at runtime (`normalizeSiteContent`):

- `type` MUST be one of the component catalog: `hero`, `features`, `hours`, `pricing`, `services`, `rules`,
  `highlight`. **Unknown types are silently dropped** — an older template survives a newer backend.
- Every non-`hero` section MUST have a string `id` (it becomes the `#anchor`) and a boolean `enabled`; `navLabel` is
  optional (omit to keep the section out of the menu). `data` MUST be an object matching the section's `*Content` type.
- A payload with unusable `meta` or zero valid sections is rejected wholesale ⇒ committed fallback.
- Inside `data`, the shapes in `sections.ts` are the contract; drift there is the backend's bug, same as every other
  endpoint.

The header/mobile menu is derived from the enabled sections' `navLabel`s — there is no separate menu payload.

## Error envelope

Returned with HTTP status ≥ 400:

```json
{ "error": { "code": "string", "message": "string" } }
```

The template does not surface `code`/`message` to visitors; any error simply degrades the affected section (or the whole
page, for `/site`) to a "non disponibile" state.
