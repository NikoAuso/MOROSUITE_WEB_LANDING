import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Repo-owned legal documents (policy, cookie). Edited per deploy as Markdown;
// not fetched from the backend. The entry id is the filename slug.
const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    version: z.string(),
    effective_date: z.coerce.date().optional(),
  }),
});

export const collections = { legal };
