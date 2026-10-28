export const site = {
  name: 'Alberto Guerra González',
  shortName: 'Alberto Guerra',
  domain: 'albertoguerra.com',
  role: 'Staff Security Engineer · Anti-abuse, account security & application security',
  jobTitle: 'Staff Security Engineer',
  employer: { name: 'Riot Games', url: 'https://www.riotgames.com/' },
  location: 'Dublin, Ireland',
  address: { locality: 'Dublin', country: 'IE' },
  headline: 'I keep bots and account thieves away from players.',
  // TODO(alberto): add the years ("N years at Microsoft and Riot Games").
  // Keep Player Security work described in generic terms (antibot, account security, account
  // remediation): no product names, mechanisms or figures.
  summary:
    "Staff Security Engineer, previously at Microsoft and now at Riot Games, focused on bot mitigation and account takeover prevention. Founding engineer of Riot's Player Security team, where I work on antibot, account security and account remediation for players across Riot's games.",
  summary2:
    'Product-minded: the problem I solve for players matters more than the stack I solve it with. I take the growth of the people around me seriously and have mentored many software and QA engineers.',
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
  facts: [
    { term: 'Based', detail: 'Dublin, Ireland' },
    { term: 'Now', detail: 'Riot Games, Player Security' },
    { term: 'Before', detail: 'Microsoft, Azure DNS' },
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
  offDuty: [
    'An Erasmus year at the University of Oulu, Finland.',
    'Spanish and English.',
    'Took a Game Hacking with Cheat Engine course. For research.',
  ],
} as const;

/** Public profiles for schema.org sameAs: every non-mail link in socials and hobbies. */
export const sameAs: readonly string[] = [...site.socials, ...site.hobbies]
  .map((s) => s.url)
  .filter((u) => !u.startsWith('mailto:'));

export type Social = (typeof site.socials)[number];
