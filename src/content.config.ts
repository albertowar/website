import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const talks = defineCollection({
  loader: glob({ base: './src/content/talks', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    venue: z.string().optional(),
    year: z.number().int(),
    date: z.coerce.date().optional(),
    summary: z.string(),
    slides: z.url().optional(),
    video: z.url().optional(),
    sourceUrl: z.url().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    url: z.url(),
    date: z.coerce.date(),
    publication: z.string().default('LinkedIn'),
    series: z.string().optional(),
    summary: z.string(),
    /** Cover image relative to the post file, e.g. ./covers/slug.jpg. Shown on the post's card. */
    cover: image().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    status: z.string().optional(),
  }),
});

export const collections = { talks, posts, pages };
