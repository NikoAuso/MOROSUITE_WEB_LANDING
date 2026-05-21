// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import robotsTxt from 'astro-robots-txt';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
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
