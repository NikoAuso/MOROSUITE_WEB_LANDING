import { defineConfig } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:14322';

export default defineConfig({
  testDir: '.',
  testMatch: 'degraded.spec.ts',
  fullyParallel: false,
  reporter: 'list',
  use: { baseURL: BASE_URL },

  webServer: [
    {
      command: 'node ../../dist/server/entry.mjs',
      url: `${BASE_URL}/health`,
      reuseExistingServer: false,
      ignoreHTTPSErrors: true,
      env: {
        HOST: '127.0.0.1',
        PORT: '14322',
        API_BASE_URL: 'http://127.0.0.1:9/api/public/v1',
        API_AUTH_TOKEN: 'irrelevant',
        FACILITY_SLUG: 'test-facility',
        PUBLIC_SITE_URL: BASE_URL,
        CACHE_TTL_SECONDS: '1',
      },
    },
  ],
});
