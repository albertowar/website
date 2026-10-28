export interface Work {
  title: string;
  text: string;
  /** Public page that shows the work from the player's side. */
  link?: { label: string; url: string };
}

// Source: ~/github/albertowar/cv/cv.md. Keep these in generic terms like the hero summary:
// no internal names, detection mechanisms or figures.
export const work: readonly Work[] = [
  {
    title: 'Bot protection for core account flows',
    text: 'Built and deployed the protections against bots and credential stuffing on login, signup, recovery and account management, across many services and tech stacks.',
  },
  {
    title: 'Automated account remediation',
    text: 'Led it from product discovery to launch: when an account is clearly compromised it is secured automatically, without the player waiting on a support ticket.',
    link: {
      label: 'What players see',
      url: 'https://support.riotgames.com/en-us/riot/account/riot-secured-your-account-what-to-do-next',
    },
  },
  {
    title: 'Fan-first raffles',
    text: "Built the security layer of the raffles that keep high-demand exclusives, such as booster packs and Esports tickets, in players' hands, not scalpers'.",
  },
];
