/**
 * /llms.txt: a plain-text index of the site for AI crawlers (https://llmstxt.org).
 * Built from the same data as the pages, so it never drifts from them.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

export const GET: APIRoute = async ({ site: siteUrl }) => {
  const origin = siteUrl ?? new URL(`https://${site.domain}`);
  const abs = (p: string) => new URL(p, origin).href;

  const talks = (await getCollection('talks')).sort((a, b) => b.data.year - a.data.year);
  const posts = (await getCollection('posts')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const day = (d: Date) => d.toISOString().slice(0, 10);

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## About',
    '',
    `- Role: ${site.jobTitle} at ${site.employer.name}, ${site.location}.`,
    `- ${site.summary}`,
    `- ${site.summary2}`,
    ...site.socials.map((s) => `- ${s.label}: ${s.url.startsWith('mailto:') ? s.handle : s.url}`),
    '',
    '## Talks',
    '',
    ...talks.map(
      (t) =>
        `- [${t.data.title}](${abs(`/talks/${t.id}/`)}): ${t.data.summary} (${[t.data.event, t.data.venue].filter(Boolean).join(', ')}, ${t.data.year})`,
    ),
    `- Slides and abstracts for every talk: ${site.talksRepo}`,
    '',
    '## Posts',
    '',
    ...posts.map(
      (p) => `- [${p.data.title}](${p.data.url}): ${p.data.summary} (${p.data.publication}, ${day(p.data.date)})`,
    ),
    '',
    '## Photography',
    '',
    `- ${site.photographyBlurb}`,
    ...site.hobbies.map((h) => `- [${h.label}](${h.url}): ${h.blurb}`),
    '',
    '## Optional',
    '',
    `- [Sitemap](${abs('/sitemap-index.xml')})`,
  ];

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
