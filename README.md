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

## Where the content lives

Everything the site shows comes from markdown or one data file. Components never hard-code URLs.

| What                         | Where                                 |
| ---------------------------- | ------------------------------------- |
| Name, tagline, socials, hobby links | `src/data/site.ts`             |
| Talks (one file per talk)    | `src/content/talks/*.md`              |
| Posts / external articles    | `src/content/posts/*.md`              |
| About section                | `src/content/pages/about.md`          |
| Writing / book section       | `src/content/pages/writing.md`        |
| Frontmatter schemas          | `src/content.config.ts`               |

### Add a talk

Create `src/content/talks/<slug>.md`. The slug becomes the URL `/talks/<slug>/`.

```md
---
title: "Talk title"
event: "Conference name 2026"
venue: "City or institution"   # optional
year: 2026
date: 2026-05-12               # optional, shown instead of the year when present
summary: "One or two sentences for the card on the landing page."
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

### Hero photo

The hero is typography-only until a photo exists. Drop one at `src/assets/hero.jpg` (or `.png` / `.webp`) and the hero switches to a split layout with the image. A portrait crop around 4:5 works best.
