import { defineConfig } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:14321';
const MOCK_URL = 'http://127.0.0.1:18000/api/public/v1';
const TOKEN = 'test-token';
const FACILITY_SLUG = 'test-facility';
const MODE = process.env.MOCK_BACKEND_MODE ?? 'ok';

export default defineConfig({
  testDir: '.',
  testIgnore:
    MODE === 'empty'
      ? [
          'cta.spec.ts',
          'homepage.spec.ts',
          'legal.spec.ts',
          'public.spec.ts',
          'degraded.spec.ts',
          // In empty mode the mock 404s /site/content on purpose (the fallback
          // is under test in empty.spec.ts); the backend-driven assertions
          // only hold in ok mode.
          'content.spec.ts',
        ]
      : ['empty.spec.ts', 'degraded.spec.ts'],
  fullyParallel: false,
  reporter: 'list',
  use: { baseURL: BASE_URL },

  webServer: [
    {
      command: 'node fixtures/mock-backend.mjs',
      url: 'http://127.0.0.1:18000/up',
      reuseExistingServer: false,
      env: {
        MOCK_BACKEND_PORT: '18000',
        MOCK_BACKEND_REQUIRE_AUTH: 'true',
        MOCK_BACKEND_TOKEN: TOKEN,
        MOCK_BACKEND_MODE: process.env.MOCK_BACKEND_MODE ?? 'ok',
      },
    },
    {
      command: 'node ../../dist/server/entry.mjs',
      url: BASE_URL,
      reuseExistingServer: false,
      env: {
        // Explicit override: a developer's .env with DEMO_MODE=true gets
        // inlined into the build by Vite, and config.ts falls back to that
        // inlined value when the runtime env is silent. Without this line the
        // E2E server would run in demo mode on any machine that has that .env.
        DEMO_MODE: 'false',
        HOST: '127.0.0.1',
        PORT: '14321',
        API_BASE_URL: MOCK_URL,
        API_AUTH_TOKEN: TOKEN,
        FACILITY_SLUG,
        PUBLIC_SITE_URL: BASE_URL,
        CACHE_TTL_SECONDS: '1',
      },
    },
  ],
});
