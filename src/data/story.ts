export interface Stage {
  title: string;
  /** Years or date range, e.g. "2013 – 2014" or "Mar 2023 – present". */
  when: string;
  role: string;
  /** The chapter, in first person; [text](url) makes a link. Facts come from the CV (~/github/albertowar/cv/cv.md); keep
   *  Player Security in generic terms: no internal names, detection mechanisms or figures. */
  story: string;
  /** For the timeline map: 'YYYY' (start of that year) or 'YYYY-MM'. No `to` means present. */
  from: string;
  to?: string;
  lane: 'study' | 'work';
  /** Name on the timeline segment. */
  short: string;
}

/** Opens the Story section, under the map. */
export const storyIntro =
  'From a degree in Málaga to founding engineer of Riot’s Player Security team: twelve years of building software, first for infrastructure and players, now against the bots and thieves who target them.';

export const stages: readonly Stage[] = [
  {
    title: 'University of Málaga',
    from: '2008',
    to: '2015',
    lane: 'study',
    short: 'Málaga',
    when: '2008 – 2015',
    role: 'MSc in Computer Engineering',
    story: 'I studied Computer Engineering at the University of Málaga, through to an MSc.',
  },
  {
    title: 'University of Oulu, Finland',
    from: '2013',
    to: '2014',
    lane: 'study',
    short: 'Oulu',
    when: '2013 – 2014',
    role: 'Erasmus exchange, Computer Software Engineering',
    story:
      'Midway through, an Erasmus year in Finland, studying Computer Software Engineering at the University of Oulu.',
  },
  {
    title: 'Microsoft, Dublin',
    from: '2014-06',
    to: '2017-10',
    lane: 'work',
    short: 'Microsoft',
    when: 'Jun 2014 – Oct 2017',
    role: 'Software Engineer II, Azure DNS and Traffic Manager',
    story:
      'In 2014 I joined Microsoft in Dublin, on Azure DNS and Azure Traffic Manager. I implemented the DNS zone and record management APIs, added TCP health checks to Traffic Manager’s health monitoring, and built a plugin framework that watches security-relevant server state across datacenters, from local administrator accounts to certificate expiry.',
  },
  {
    title: 'Riot Games, Publishing',
    from: '2017-11',
    to: '2020-06',
    lane: 'work',
    short: 'Publishing',
    when: 'Nov 2017 – Jun 2020',
    role: 'Software Engineer',
    story:
      'At the end of 2017 I moved to Riot Games, still in Dublin. On Publishing I built Content Targeting, which personalises the news in the League of Legends client and mobile app. I also [fixed a TCP bug](https://github.com/locustio/locust/pull/1101) in [Locust](https://locust.io/), the open-source load-testing framework, that had kept it out of Riot’s internal cloud, then co-developed ALF on top of it. ALF became Riot’s standard load-testing framework for years.',
  },
  {
    title: 'Riot Games, Commerce',
    from: '2020-06',
    to: '2023-03',
    lane: 'work',
    short: 'Commerce',
    when: 'Jun 2020 – Mar 2023',
    role: 'Senior Software Engineer, Staff from Oct 2022',
    story:
      'On Commerce I was feature lead on Riot’s first web store: I designed its architecture, from the content-managed storefront to a purchase pipeline integrated with Riot’s payment systems, and hardened it for production. As a Staff engineer I then built the Game Asset Platform, which extracts image assets from game builds and serves them to the web store and Riot Mobile.',
  },
  {
    title: 'Riot Games, Player Security',
    from: '2023-03',
    lane: 'work',
    short: 'Player Security',
    when: 'Mar 2023 – present',
    role: 'Staff Security Engineer, founding engineer',
    story:
      'In 2023 I moved into security as the first engineer on Riot’s Player Security team. I built and deployed the bot protections on login, signup, recovery and account management; launched a detection that warns players about unusual logins; led automated account remediation from discovery to launch, so a clearly compromised account is secured without waiting on a support ticket; and built the security layer of the fan-first raffles that keep high-demand exclusives away from scalpers. I also lead security reviews and threat models of player-facing services, and I am bringing AI into the work: an AI-assisted review and threat-modeling process that Product Security adopted, and a weekly threat-hunting agent.',
  },
];
