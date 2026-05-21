import { defineConfig } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:14321';
const MOCK_URL = 'http://127.0.0.1:18000/api/public/v1';
const TOKEN = 'test-token';
const FACILITY_SLUG = 'test-facility';
const MODE = process.env.MOCK_BACKEND_MODE ?? 'ok';

export default defineConfig({
  testDir: '.',
  testIgnore: MODE === 'empty' ? ['cta.spec.ts', 'homepage.spec.ts', 'legal.spec.ts', 'public.spec.ts', 'degraded.spec.ts'] : ['empty.spec.ts', 'degraded.spec.ts'],
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
