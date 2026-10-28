export interface Stage {
  title: string;
  /** Years or date range, e.g. "2013 – 2014" or "Mar 2023 – present". */
  when: string;
  role: string;
  text?: string;
}

export const stages: readonly Stage[] = [
  {
    title: 'University of Málaga',
    when: '2008 – 2015',
    role: 'MSc in Computer Engineering',
  },
  {
    title: 'University of Oulu, Finland',
    when: '2013 – 2014',
    role: 'Erasmus exchange, Computer Software Engineering',
  },
  {
    title: 'Microsoft, Dublin',
    when: 'Jun 2014 – Oct 2017',
    role: 'Software Engineer II, Azure DNS and Traffic Manager',
    text: 'Zone and record management APIs, TCP health checks, and a plugin framework that watches security-relevant server state across datacenters.',
  },
  {
    title: 'Riot Games, Publishing',
    when: 'Oct 2017 – Jun 2020',
    role: 'Software Engineer',
    text: "News personalisation for the League of Legends client, and co-built ALF, which became Riot's standard load-testing framework for years.",
  },
  {
    title: 'Riot Games, Commerce',
    when: 'Jun 2020 – Mar 2023',
    role: 'Senior Software Engineer, Staff from Oct 2022',
    text: "Designed Riot's first web store and the Game Asset Platform that feeds it and Riot Mobile.",
  },
  {
    title: 'Riot Games, Player Security',
    when: 'Mar 2023 – present',
    role: 'Staff Security Engineer, founding engineer',
    text: 'Antibot, account security and account remediation across Riot\'s games, plus early work on AI-assisted security tooling.',
  },
];
