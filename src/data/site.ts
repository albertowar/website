export const site = {
  name: 'Alberto Guerra González',
  shortName: 'Alberto Guerra',
  domain: 'albertoguerra.com',
  role: 'Staff Security Engineer · Anti-abuse, account security & application security',
  location: 'Dublin, Ireland',
  headline: 'I keep bots and account thieves away from players.',
  // TODO(alberto): add the years ("N years at Microsoft and Riot Games") and the exact figures
  // (authentication success from X% to Y%; % of high-confidence compromises auto-remediated).
  summary:
    "Staff Security Engineer, previously at Microsoft and now at Riot Games, focused on bot mitigation and account takeover prevention. Founding engineer of Riot's Player Security team, where I built the bot defenses that lifted authentication success across Riot's games and the pipeline that automatically remediates most high-confidence account compromises.",
  summary2:
    'Product-minded: the problem I solve for players matters more than the stack I solve it with. I take the growth of the people around me seriously and have mentored many software and QA engineers.',
  description:
    'Alberto Guerra González, Staff Security Engineer in Dublin: bot mitigation and account takeover prevention at Riot Games, talks, articles on AI and security, an upcoming book, and photography.',
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
  talksRepo: 'https://github.com/albertowar/talks',
} as const;

export type Social = (typeof site.socials)[number];
