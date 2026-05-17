// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import robotsTxt from 'astro-robots-txt';
import tailwindcss from '@tailwindcss/vite';

// astro.config runs in Node before Vite injects import.meta.env, so we
// reach for the env explicitly via Vite's loadEnv helper.
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const siteUrl = env.PUBLIC_SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/_'),
    }),
    mdx(),
    robotsTxt({
      sitemap: `${siteUrl}/sitemap-index.xml`,
      policy: [{ userAgent: '*', allow: '/' }],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
