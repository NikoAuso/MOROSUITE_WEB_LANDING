import { createServer } from 'node:http';
import { SITE, HOURS, PRICING, CONTENT } from './payloads.mjs';

const PORT = Number(process.env.MOCK_BACKEND_PORT) || 18000;
const REQUIRE_AUTH = process.env.MOCK_BACKEND_REQUIRE_AUTH === 'true';
const EXPECTED_TOKEN = process.env.MOCK_BACKEND_TOKEN || 'test-token';
const MODE = process.env.MOCK_BACKEND_MODE || 'ok'; // 'ok' | 'empty'

// The template now composes URLs as `/api/public/v1/{facility-slug}/...`.
// The mock accepts ANY slug — the template under test passes whichever value
// is in FACILITY_SLUG / config.facilitySlug. The regex captures the slug and
// the suffix; suffix selects the handler.
const FACILITY_ROUTE = /^\/api\/public\/v1\/([^/]+)(\/.+)$/;

const HANDLERS = {
  '/site': () => SITE,
  // Served only in 'ok' mode; 'empty' answers 404 like a backend that never
  // implemented the optional endpoint, pinning the committed-default fallback.
  ...(MODE === 'ok' ? { '/site/content': () => CONTENT } : {}),
  '/site/opening-hours': () =>
    MODE === 'empty' ? { timezone: 'Europe/Rome', daily_hours: null } : HOURS,
  '/site/pricing': () =>
    MODE === 'empty'
      ? {
          active_price_list_name: null,
          has_prices: false,
          entrance_count: 0,
          pass_count: 0,
          entrance_sections: [],
          pass_sections: [],
        }
      : PRICING,
};

// In empty mode, /site stays populated (otherwise everything 503s and we can't
// exercise the per-component empty fallbacks).

function resolveHandler(url) {
  if (url === '/up') return { handler: () => ({ status: 'ok' }), requiresAuth: false };
  const match = url.match(FACILITY_ROUTE);
  if (!match) return null;
  const suffix = match[2];
  const handler = HANDLERS[suffix];
  if (!handler) return null;
  return { handler, requiresAuth: true };
}

const server = createServer((req, res) => {
  const resolved = resolveHandler(req.url);
  if (!resolved) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { code: 'not_found', message: req.url } }));
    return;
  }

  if (REQUIRE_AUTH && resolved.requiresAuth) {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${EXPECTED_TOKEN}`) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { code: 'unauthorized', message: 'bad token' } }));
      return;
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(resolved.handler()));
});

server.listen(PORT, () => {
  console.log(
    `[mock-backend] listening on http://127.0.0.1:${PORT} (mode=${MODE}, auth=${REQUIRE_AUTH})`,
  );
});
