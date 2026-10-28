import type { Work } from './work';

// The consulting offer. Keep it in generic terms like the rest of the site: no Riot internals.
export const consulting = {
  intro:
    'I help teams keep bots, fraudsters and account thieves out of their products. Book a session for a focused review or a second opinion.',
  offers: [
    {
      title: 'Anti-bot & account takeover review',
      text: 'A review of your login, signup and recovery flows for bot and account takeover exposure, with prioritized recommendations.',
    },
    {
      title: 'Threat modeling session',
      text: 'A guided threat model or security review of a product or feature, before it ships or while it grows.',
    },
    {
      title: 'Abuse strategy',
      text: 'Fraud and abuse prevention for games and consumer apps: bots, scalpers, phishing and account resale.',
    },
    {
      title: 'Mentoring',
      text: 'Career and technical mentoring for software and security engineers.',
    },
  ] satisfies Work[],
  /** Cal.com event types, one button each ("user/event" paths). Empty falls back to email. */
  events: [
    { label: '30 min', calLink: 'albertoguerra/30min' },
    { label: '60 min', calLink: 'albertoguerra/60min' },
  ],
} as const;
