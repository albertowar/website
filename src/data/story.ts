export interface Stage {
  title: string;
  /** Years or date range, e.g. "2016–2019". Empty until Alberto fills it in. */
  when: string;
  role: string;
  text?: string;
}

// TODO(alberto): fill in `when` for every stage. The CV paste lost all digits.
export const stages: readonly Stage[] = [
  {
    title: 'University of Málaga',
    when: '',
    role: 'MSc in Computer Engineering',
  },
  {
    title: 'University of Oulu, Finland',
    when: '',
    role: 'Erasmus exchange, Computer Software Engineering',
  },
  {
    title: 'Microsoft, Dublin',
    when: '',
    role: 'Software Engineer II, Azure DNS and Traffic Manager',
    text: 'Zone and record management APIs, TCP health checks, and a plugin framework that watches security-relevant server state across datacenters.',
  },
  {
    title: 'Riot Games, Publishing',
    when: '',
    role: 'Software Engineer',
    text: "News personalisation for the League of Legends client, and co-built ALF, which became Riot's standard load-testing framework for years.",
  },
  {
    title: 'Riot Games, Commerce',
    when: '',
    role: 'Senior, then Staff Software Engineer',
    text: "Designed Riot's first web store and the Game Asset Platform that feeds it and Riot Mobile.",
  },
  {
    title: 'Riot Games, Player Security',
    when: '',
    role: 'Staff Security Engineer, founding engineer',
    text: 'The bot-detection SDK (Node.js, Java, Go, Python), captcha on email and password changes, Impossible Traveler detection, automated account remediation, and an AI-assisted pentesting prototype.',
  },
];
