# albertoguerra.com

Personal landing page, built with [Astro](https://astro.build) and deployed on Netlify.

## Run

```sh
npm install
npm run dev      # local dev server
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
npx astro check  # type-check components and content frontmatter
```

Node 24 (see `.nvmrc`). Netlify builds with `npm run build` and publishes `dist/` (see `netlify.toml`).

## Design

Japandi structure on a cyberpunk arcade palette: a deep indigo base (never pure black), cool
off-white ink, cyan for labels and controls, magenta as the "signal" colour (bots in the game, the
status mark), hairline rules, one typeface (Literata) and a lot of empty space.
The videogame thread is the brand mark (Alberto's pixel-art avatar, a head crop of the GitHub
profile image, served as `public/favicon.svg` and reused as the nav logo), an RPG-style cursor in the nav, "stages" for the
career, and **Login Queue**, a small arcade shooter (`src/scripts/login-queue.ts`) that gates
everything below the landing screen: fire captchas at descending bots, do not hit the players, and
from wave 2 watch for bots disguised as players whose cover drops as they get close. While it is unfinished the nav reads as compromised (blurred,
glitched links and a "Bots detected" status). Without JavaScript the gated content is simply visible;
winning or skipping the game stores `aq-bonus` in `localStorage`, and "Replay Login Queue" at the
end of the page locks it again.

The site is dark-only by design. Colour tokens live at the top of `src/styles/global.css`.

## Where the content lives

Everything the site shows comes from markdown or two data files. Components never hard-code URLs.

| What                                             | Where                           |
| ------------------------------------------------ | ------------------------------- |
| Name, role, headline, summary, facts, links      | `src/data/site.ts`              |
| Career stages (the Story section)                | `src/data/story.ts`             |
| Talks (one file per talk)                        | `src/content/talks/*.md`        |
| Posts / external articles                        | `src/content/posts/*.md`        |
| Writing / book section                           | `src/content/pages/writing.md`  |
| Photography links and "off duty" lines           | `src/data/site.ts`              |
| Frontmatter schemas                              | `src/content.config.ts`         |

Lines marked `TODO(alberto)` in the data files are figures and dates that still need filling in.

### Add a talk

Create `src/content/talks/<slug>.md`. The slug becomes the URL `/talks/<slug>/`.

```md
---
title: "Talk title"
event: "Conference name 2026"
venue: "City or institution"   # optional
year: 2026
date: 2026-05-12               # optional, shown instead of the year when present
summary: "One or two sentences for the row on the landing page."
slides: https://...            # optional
video: https://...             # optional
sourceUrl: https://...         # optional, e.g. the README in github.com/albertowar/talks
---

Abstract, then any follow-up links as regular markdown.
```

### Add a post

Create `src/content/posts/<slug>.md`. Posts link out, so the body can stay empty.

```md
---
title: "Article title"
url: https://www.linkedin.com/pulse/...
date: 2026-05-26
publication: "LinkedIn"        # optional, defaults to LinkedIn
series: "AI Ramblings"         # optional
summary: "One or two sentences."
---
```

### Photos

- **Landing photo**: drop one at `src/assets/hero.jpg` (or `.png` / `.webp`). It appears above the facts
  list on the right of the landing screen. A portrait crop around 4:5 works best.
- **Photography band**: drop up to three photos in `src/assets/photos/`. They show as a row above the
  photography links. Landscape 3:2 crops work best.
