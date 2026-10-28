/** schema.org nodes shared by the pages. Everything comes from src/data/site.ts. */
import { site, sameAs } from '../data/site';

export const personId = (origin: URL) => new URL('/#person', origin).href;

/** The full Person node, emitted once on the home page. */
export function personNode(origin: URL, imageUrl: string) {
  return {
    '@type': 'Person',
    '@id': personId(origin),
    name: site.name,
    alternateName: site.shortName,
    jobTitle: site.jobTitle,
    description: site.description,
    url: origin.href,
    image: imageUrl,
    email: site.socials.find((s) => s.url.startsWith('mailto:'))?.handle,
    worksFor: { '@type': 'Organization', name: site.employer.name, url: site.employer.url },
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressCountry: site.address.country,
    },
    knowsAbout: [...site.knowsAbout],
    sameAs: [...sameAs],
  };
}

/** A short reference to the same Person, for other pages. */
export function personRef(origin: URL) {
  return { '@type': 'Person', '@id': personId(origin), name: site.name, url: origin.href };
}
