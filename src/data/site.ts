export const site = {
  name: 'Alberto Guerra González',
  shortName: 'Alberto Guerra',
  domain: 'albertoguerra.com',
  role: 'Staff Security Engineer · Anti-Abuse, Account Security & Application Security',
  jobTitle: 'Staff Security Engineer',
  employer: { name: 'Riot Games', url: 'https://www.riotgames.com/' },
  location: 'Dublin, Ireland',
  address: { locality: 'Dublin', country: 'IE' },
  headline: 'I keep bots and account thieves away from players.',
  // Keep Player Security work described in generic terms (antibot, account security, account
  // remediation): no product names, mechanisms or figures.
  summary:
    "Staff Security Engineer, 12+ years at Microsoft and Riot Games, focused on bot mitigation and account takeover prevention. Founding engineer of Riot's Player Security team, where I work on antibot, account security and account remediation for players across Riot's games. I also battle phishing, scalpers and social engineering.",
  /** Long form, for Open Graph and llms.txt. */
  description:
    'Alberto Guerra González, Staff Security Engineer in Dublin: bot mitigation and account takeover prevention at Riot Games, talks, articles on AI and security, an upcoming book, and photography.',
  /** Under 155 characters so Google shows it whole. */
  metaDescription:
    'Staff Security Engineer in Dublin. Bot mitigation and account takeover prevention at Riot Games, conference talks, and articles on AI and security.',
  /** Topics for structured data (schema.org Person.knowsAbout). */
  knowsAbout: [
    'Bot mitigation',
    'Account takeover prevention',
    'Anti-abuse engineering',
    'Application security',
    'Online game security',
  ],
  socials: [
    { label: 'LinkedIn', handle: 'in/albertowar', url: 'https://www.linkedin.com/in/albertowar/' },
    { label: 'GitHub', handle: 'albertowar', url: 'https://github.com/albertowar' },
    { label: 'Email', handle: 'cv@anotherdevboy.com', url: 'mailto:cv@anotherdevboy.com' },
  ],
  talksRepo: 'https://github.com/albertowar/talks',
  photographyBlurb: 'When I am not at a keyboard I am usually behind a wide-angle lens.',
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
      blurb: 'Prints and licenses of selected photographs.',
    },
  ],
  /** The photo in src/assets/hero/. */
  heroPhoto: {
    alt: 'Alberto on stage at Hackers Week 2026, University of Málaga, with the audience in front.',
  },
  /** Hero quote, a new one on each page load. Leave `by` out when the origin is unclear. */
  quotes: [
    { text: 'There is no failure, only feedback.' },
    { text: 'Perfect is the enemy of done.' },
    { text: 'If, if, if… “if” doesn’t exist.', by: 'Rafael Nadal' },
    {
      text: 'Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.',
      by: 'Master Oogway, Kung Fu Panda',
    },
    { text: 'I can accept failure, everyone fails at something. But I can’t accept not trying.', by: 'Michael Jordan' },
    {
      text: 'It is hard to fail, but it is worse never to have tried to succeed.',
      by: 'Theodore Roosevelt, The Strenuous Life (1899)',
    },
    { text: 'Do. Or do not. There is no try.', by: 'Yoda, The Empire Strikes Back' },
    { text: 'The greatest teacher, failure is.', by: 'Yoda, The Last Jedi' },
    { text: 'The only way to learn is to live.', by: 'Matt Haig, The Midnight Library' },
    { text: 'God is an ever-receding pocket of scientific ignorance.', by: 'Neil deGrasse Tyson' },
  ],
} as const;

/** Public profiles for schema.org sameAs: every non-mail link in socials and hobbies. */
export const sameAs: readonly string[] = [...site.socials, ...site.hobbies]
  .map((s) => s.url)
  .filter((u) => !u.startsWith('mailto:'));

export type Social = (typeof site.socials)[number];
