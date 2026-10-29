import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    lang: z.enum(['zh','en']).default('zh'),
    translation_url: z.string().optional(),
    permalink: z.string().optional(),
  }),
});
const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: z.object({
    name: z.string().min(1),
    order: z.number().int().positive(),
    zh_url: z.string(),
    en_url: z.string(),
    zh_description: z.string(),
    en_description: z.string(),
    featured_rank: z.number().int().positive().optional(),
    featured_zh_url: z.string().optional(),
    featured_en_url: z.string().optional(),
    featured_zh_description: z.string().optional(),
    featured_en_description: z.string().optional(),
    featured_tags: z.array(z.string()).optional(),
    featured_meta: z.array(z.string()).optional(),
  }),
});
const skills = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/skills' }),
  schema: z.object({
    name: z.string().min(1),
    order: z.number().int().positive(),
    source: z.string(),
    zh_description: z.string(),
    en_description: z.string(),
    featured_zh_domain: z.string().optional(),
    featured_en_domain: z.string().optional(),
    featured_zh_summary: z.string().optional(),
    featured_en_summary: z.string().optional(),
    featured_zh_usage: z.array(z.string()).optional(),
    featured_en_usage: z.array(z.string()).optional(),
  }),
});
export const collections = { blog, projects, skills };
