// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import icon from 'astro-icon';

// astro.config runs in Node before Vite injects import.meta.env, so we
// reach for the env explicitly via Vite's loadEnv helper.
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

// Astro/Vite only expose PUBLIC_-prefixed env vars via import.meta.env.
// For server-only vars (API_AUTH_TOKEN, FACILITY_SLUG, API_BASE_URL,
// CACHE_TTL_SECONDS) we need them in process.env so src/lib/config.ts can
// pick them up in both dev and built SSR. Mirror the .env file into
// process.env without overriding values already set by the parent shell.
for (const [key, value] of Object.entries(env)) {
  if (process.env[key] === undefined) process.env[key] = value;
}

const siteUrl = env.PUBLIC_SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site: siteUrl,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/_'),
    }),
    robotsTxt({
      sitemap: `${siteUrl}/sitemap-index.xml`,
      policy: [{ userAgent: '*', allow: '/' }],
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
