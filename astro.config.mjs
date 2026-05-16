// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import robotsTxt from 'astro-robots-txt';
import tailwindcss from '@tailwindcss/vite';

import { siteConfig } from './site.config.ts';

export default defineConfig({
  site: siteConfig.siteUrl,
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/_'),
    }),
    mdx(),
    robotsTxt({
      sitemap: `${siteConfig.siteUrl}/sitemap-index.xml`,
      policy: [{ userAgent: '*', allow: '/' }],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
