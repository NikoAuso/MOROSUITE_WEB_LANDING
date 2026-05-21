import { defineConfig } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:4321';
const MOCK_URL = 'http://127.0.0.1:8765/api/public/v1';
const TOKEN = 'test-token';

export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  reporter: 'list',
  use: { baseURL: BASE_URL },

  webServer: [
    {
      command: 'node tests/e2e/fixtures/mock-backend.mjs',
      url: 'http://127.0.0.1:8765/up',
      reuseExistingServer: false,
      env: {
        MOCK_BACKEND_PORT: '8765',
        MOCK_BACKEND_REQUIRE_AUTH: 'true',
        MOCK_BACKEND_TOKEN: TOKEN,
        MOCK_BACKEND_MODE: process.env.MOCK_BACKEND_MODE ?? 'ok',
      },
    },
    {
      command: 'node ./dist/server/entry.mjs',
      url: BASE_URL,
      reuseExistingServer: false,
      env: {
        HOST: '127.0.0.1',
        PORT: '4321',
        API_BASE_URL: MOCK_URL,
        API_AUTH_TOKEN: TOKEN,
        PUBLIC_SITE_URL: BASE_URL,
        CACHE_TTL_SECONDS: '1',
      },
    },
  ],
});
