import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Read the existing Markdown at the repository root. No content rewrites or duplication.
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: '../_posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    lang: z.enum(['zh', 'en']).default('zh'),
    translation_url: z.string().optional(),
    permalink: z.string().optional(),
  }),
});
export const collections = { blog };
