// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://albertoguerra.com',
  output: 'static',
  // The CSS is small enough (~8 KiB gzipped) that inlining it beats two render-blocking requests.
  build: { inlineStylesheets: 'always' },
  vite: {
    build: {
      // The arcade gate's script runs on every first visit, so ship it inside the HTML (~5 KiB
      // compressed) rather than as a second request chained behind the document. Everything else
      // keeps Vite's default 4 KiB inlining limit (returning undefined falls back to it).
      assetsInlineLimit: (file) => (file.includes('ArcadeGate.astro') ? true : undefined),
    },
  },
  integrations: [
    sitemap({
      // Every page is rebuilt on deploy, so the build time is an honest lastmod.
      serialize: (item) => ({ ...item, lastmod: new Date().toISOString() }),
    }),
  ],
  // Fonts are downloaded at build time and served from /_astro/fonts, so the browser never
  // waits on a third-party stylesheet. The <Font /> tags live in src/layouts/Base.astro.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Literata',
      cssVariable: '--font-literata',
      // Only body (400) and headings/labels (500) are used; every character on the site is in
      // the latin subset. Widening either means downloading more font.
      weights: ['400 500'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      // Keep the optical-size axis (7..72) that the Google Fonts stylesheet used to request.
      options: { experimental: { variableAxis: { opsz: [{ min: 7, max: 72 }] } } },
    },
    {
      provider: fontProviders.google(),
      name: 'Silkscreen',
      cssVariable: '--font-silkscreen',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
