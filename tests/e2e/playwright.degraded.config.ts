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
        // Same guard as playwright.config.ts: a developer's .env with
        // DEMO_MODE=true is inlined into the build and would make this server
        // run in demo mode — which reports /health ok and defeats the point
        // of the degraded suite.
        DEMO_MODE: 'false',
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
