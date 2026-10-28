/**
 * Open Graph card renderer. Runs at build time only (see src/pages/og/).
 * satori lays out a small element tree and emits SVG with text as outlines;
 * sharp (already a dependency of Astro) rasterises it to PNG.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { site } from '../data/site';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Mirrors the tokens at the top of src/styles/global.css.
const paper = '#0e1020';
const ink = '#ece9ff';
const ink2 = '#9d9bc0';
const line = '#262a4d';
const accent = '#5ee6ff';
const signal = '#ff5fa2';

// Astro bundles this module into dist/.prerender/ before running it, so paths are resolved from
// the project root (the build runs from there, locally and on Netlify) rather than import.meta.url.
const root = process.cwd();
const font = (name: string) => readFile(path.join(root, 'src/assets/fonts', `${name}.ttf`));

const fontsPromise = Promise.all([
  font('Literata-Regular'),
  font('Literata-SemiBold'),
  font('Silkscreen-Regular'),
]).then(([regular, semibold, pixel]) => [
  { name: 'Literata', data: regular, weight: 400 as const, style: 'normal' as const },
  { name: 'Literata', data: semibold, weight: 600 as const, style: 'normal' as const },
  { name: 'Silkscreen', data: pixel, weight: 400 as const, style: 'normal' as const },
]);

const avatarPromise = readFile(path.join(root, 'public/favicon.svg')).then(
  (svg) => `data:image/svg+xml;base64,${svg.toString('base64')}`,
);

export interface OgCard {
  /** Main line, 2–3 lines at most. */
  title: string;
  /** Line under the rule at the bottom, e.g. name · role, or event · venue · year. */
  footer: string;
  /** Small pixel label next to the avatar. Defaults to the domain. */
  label?: string;
}

// satori takes React-like element objects; no JSX needed.
const h = (type: string, props: Record<string, unknown>, ...children: unknown[]) => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children },
});

export async function renderOg({ title, footer, label = site.domain }: OgCard): Promise<Buffer> {
  const [fonts, avatar] = await Promise.all([fontsPromise, avatarPromise]);
  const titleSize = title.length > 60 ? 54 : 64;

  const tree = h(
    'div',
    {
      style: {
        // satori sizes boxes as content-box unless told otherwise; without this the padding
        // grows the canvas past 1200×630 and the footer row falls off the bottom.
        width: `${OG_WIDTH}px`,
        height: `${OG_HEIGHT}px`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px 56px',
        background: paper,
        color: ink,
        fontFamily: 'Literata',
      },
    },
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '20px' } },
      h('img', { src: avatar, width: 56, height: 56, style: { width: '56px', height: '56px' } }),
      h('div', { style: { fontFamily: 'Silkscreen', fontSize: '22px', color: accent, letterSpacing: '0.04em' } }, label),
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          fontSize: `${titleSize}px`,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          maxWidth: '980px',
        },
      },
      title,
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          paddingTop: '24px',
          borderTop: `1px solid ${line}`,
          fontSize: '26px',
          color: ink2,
        },
      },
      h('div', { style: { width: '12px', height: '12px', background: signal } }),
      h('div', { style: { display: 'flex' } }, footer),
    ),
  );

  const svg = await satori(tree as never, { width: OG_WIDTH, height: OG_HEIGHT, fonts });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
