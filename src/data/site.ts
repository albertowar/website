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
    { label: 'Email', handle: 'contact@albertoguerra.com', url: 'mailto:contact@albertoguerra.com' },
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
      by: 'Master Oogway',
    },
    { text: 'I can accept failure, everyone fails at something. But I can’t accept not trying.', by: 'Michael Jordan' },
    {
      text: 'It is hard to fail, but it is worse never to have tried to succeed.',
      by: 'Theodore Roosevelt',
    },
    { text: 'Do. Or do not. There is no try.', by: 'Yoda' },
    { text: 'The greatest teacher, failure is.', by: 'Yoda' },
    { text: 'The only way to learn is to live.', by: 'Matt Haig' },
    { text: 'God is an ever-receding pocket of scientific ignorance.', by: 'Neil deGrasse Tyson' },
    { text: 'The only way to go fast, is to go well.', by: 'Robert C. Martin' },
    { text: 'Do it right, or do it twice.' },
    { text: 'One never notices what has been done; one can only see what remains to be done.', by: 'Marie Curie' },
    { text: 'Nothing in life is to be feared; it is only to be understood.', by: 'Marie Curie' },
    { text: 'The important thing is not to stop questioning.', by: 'Albert Einstein' },
    { text: 'Imagination is more important than knowledge.', by: 'Albert Einstein' },
    { text: 'Science is a history of corrected mistakes.', by: 'Karl Popper' },
    { text: 'You lose your curiosity when you stop learning.', by: 'Katherine Johnson' },
    {
      text: 'What you do makes a difference, and you have to decide what kind of difference you want to make.',
      by: 'Jane Goodall',
    },
    { text: 'Pressure is a privilege, and champions adjust.', by: 'Billie Jean King' },
    {
      text: 'We don’t sit around and reflect. That’s not how you get out here and win matches, reflecting and looking back. You work hard, look forward.',
      by: 'Venus Williams',
    },
  ],
} as const;

/** Public profiles for schema.org sameAs: every non-mail link in socials and hobbies. */
export const sameAs: readonly string[] = [...site.socials, ...site.hobbies]
  .map((s) => s.url)
  .filter((u) => !u.startsWith('mailto:'));

export type Social = (typeof site.socials)[number];
