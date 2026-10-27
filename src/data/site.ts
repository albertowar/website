export const site = {
  name: 'Alberto Guerra González',
  shortName: 'Alberto Guerra',
  initials: 'AG',
  domain: 'albertoguerra.com',
  tagline: 'Software engineer. Security and anti-bot. Speaker, writer, photographer.',
  description:
    'Personal site of Alberto Guerra González: talks, articles on AI and software security, an upcoming book, and photography.',
  socials: [
    { label: 'LinkedIn', handle: 'in/albertowar', url: 'https://www.linkedin.com/in/albertowar/' },
    { label: 'GitHub', handle: 'albertowar', url: 'https://github.com/albertowar' },
  ],
  hobbies: [
    {
      label: 'Instagram',
      handle: '@wideanglesights',
      url: 'https://www.instagram.com/wideanglesights/',
      blurb: 'Wide-angle landscapes and travel photography.',
    },
    {
      label: 'Print store',
      handle: 'wideanglesights.pixieset.com',
      url: 'https://wideanglesights.pixieset.com/',
      blurb: 'Buy prints and licenses of selected photographs.',
    },
  ],
  talksRepo: 'https://github.com/albertowar/talks',
} as const;

export type Social = (typeof site.socials)[number];
