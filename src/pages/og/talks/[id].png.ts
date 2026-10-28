import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { renderOg } from '../../../lib/og';
import { site } from '../../../data/site';

export const getStaticPaths: GetStaticPaths = async () => {
  const talks = await getCollection('talks');
  return talks.map((talk) => ({ params: { id: talk.id }, props: { talk } }));
};

export const GET: APIRoute<{ talk: CollectionEntry<'talks'> }> = async ({ props }) => {
  const { title, event, venue, year } = props.talk.data;
  const png = await renderOg({
    title,
    // Event names usually carry the year already ("Hackers Week 2026"); only add it when they don't.
    footer: [event, venue, event.includes(String(year)) ? undefined : String(year)].filter(Boolean).join(' · '),
    label: `${site.domain} / talks`,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
