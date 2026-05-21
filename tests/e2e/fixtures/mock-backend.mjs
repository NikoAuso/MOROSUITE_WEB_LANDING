import { createServer } from 'node:http';
import { SITE, HOURS, PRICING, LEGAL_POLICY, LEGAL_COOKIE } from './payloads.mjs';

const PORT = Number(process.env.MOCK_BACKEND_PORT) || 8765;
const REQUIRE_AUTH = process.env.MOCK_BACKEND_REQUIRE_AUTH === 'true';
const EXPECTED_TOKEN = process.env.MOCK_BACKEND_TOKEN || 'test-token';
const MODE = process.env.MOCK_BACKEND_MODE || 'ok'; // 'ok' | 'empty'

const ROUTES = {
  '/api/public/v1/site': () => SITE,
  '/api/public/v1/site/opening-hours': () => MODE === 'empty'
    ? { timezone: 'Europe/Rome', daily_hours: null }
    : HOURS,
  '/api/public/v1/site/pricing': () => MODE === 'empty'
    ? { active_price_list_name: null, has_prices: false, entrance_count: 0, pass_count: 0, entrance_sections: [], pass_sections: [] }
    : PRICING,
  '/api/public/v1/legal/policy': () => MODE === 'empty'
    ? { ...LEGAL_POLICY, body: '' }
    : LEGAL_POLICY,
  '/api/public/v1/legal/cookie': () => MODE === 'empty'
    ? { ...LEGAL_COOKIE, body: '' }
    : LEGAL_COOKIE,
  '/up': () => ({ status: 'ok' }),
};

// In empty mode, /site stays populated (otherwise everything 503s and we can't
// exercise the per-component empty fallbacks).

const server = createServer((req, res) => {
  const handler = ROUTES[req.url];
  if (!handler) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { code: 'not_found', message: req.url } }));
    return;
  }

  if (REQUIRE_AUTH && req.url !== '/up') {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${EXPECTED_TOKEN}`) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { code: 'unauthorized', message: 'bad token' } }));
      return;
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(handler()));
});

server.listen(PORT, () => {
  console.log(`[mock-backend] listening on http://127.0.0.1:${PORT} (mode=${MODE}, auth=${REQUIRE_AUTH})`);
});
