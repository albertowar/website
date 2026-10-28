import type { APIRoute } from 'astro';
import { renderOg } from '../../lib/og';
import { site } from '../../data/site';

export const GET: APIRoute = async () => {
  const png = await renderOg({
    title: site.headline,
    footer: `${site.name} · ${site.jobTitle}, ${site.location}`,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
