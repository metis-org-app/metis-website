// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LANG_PATHS } from '../src/i18n/detect';
import { MESSAGES } from '../src/i18n/messages';
import { injectApp, localizeHead, pageUrl, robotsTxt, sitemapXml } from './seo.mjs';

const SITE = 'https://metis.example';
// The source template, with the site URL the build would substitute.
const template = readFileSync(resolve(import.meta.dirname, '../index.html'), 'utf8').replaceAll(
  '%VITE_SITE_URL%',
  SITE,
);
const head = (lang: 'es' | 'en') =>
  localizeHead(template, {
    lang,
    meta: MESSAGES[lang].meta,
    siteUrl: SITE,
    paths: LANG_PATHS,
    defaultLang: 'es',
  });

describe('localizeHead', () => {
  it('gives the English page its own language, title, canonical and social tags', () => {
    const html = head('en');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain(`<title>${MESSAGES.en.meta.title}</title>`);
    expect(html).toContain('<link rel="canonical" href="https://metis.example/en/" />');
    expect(html).toContain('<meta property="og:url" content="https://metis.example/en/" />');
    expect(html).toContain('<meta property="og:locale" content="en_US" />');
    expect(html).toContain('<meta property="og:locale:alternate" content="es_ES" />');
    expect(html).toContain('won&#39;t'.replace('&#39;', "'"));
    expect(html).not.toContain(MESSAGES.es.meta.description);
  });

  it('lists every language and the x-default as alternates on both pages', () => {
    for (const lang of ['es', 'en'] as const) {
      const html = head(lang);
      expect(html).toContain('<link rel="alternate" hreflang="es" href="https://metis.example/" />');
      expect(html).toContain('<link rel="alternate" hreflang="en" href="https://metis.example/en/" />');
      expect(html).toContain('<link rel="alternate" hreflang="x-default" href="https://metis.example/" />');
    }
  });

  it('escapes attribute values', () => {
    const meta = { ...MESSAGES.en.meta, description: 'Say "hi" & <b>' };
    const html = localizeHead(template, {
      lang: 'en',
      meta,
      siteUrl: SITE,
      paths: LANG_PATHS,
      defaultLang: 'es',
    });
    expect(html).toContain('content="Say &quot;hi&quot; &amp; &lt;b>"');
  });

  it('fails loudly when the template no longer has a tag it localizes', () => {
    const broken = template.replace(/<title>[^<]*<\/title>/, '');
    expect(() =>
      localizeHead(broken, {
        lang: 'es',
        meta: MESSAGES.es.meta,
        siteUrl: SITE,
        paths: LANG_PATHS,
        defaultLang: 'es',
      }),
    ).toThrow(/<title>/);
  });
});

describe('injectApp, sitemap and robots', () => {
  it('fills the empty #root', () => {
    expect(injectApp(template, '<main>hi</main>')).toContain('<div id="root"><main>hi</main></div>');
  });

  it('lists both pages with their alternates', () => {
    const xml = sitemapXml(SITE, LANG_PATHS, 'es');
    expect(xml.match(/<loc>/g)).toHaveLength(2);
    expect(xml).toContain('<loc>https://metis.example/en/</loc>');
    expect(xml).toContain('hreflang="x-default" href="https://metis.example/"');
  });

  it('points robots to the sitemap', () => {
    expect(robotsTxt(SITE)).toContain('Sitemap: https://metis.example/sitemap.xml');
    expect(pageUrl(`${SITE}/`, '/en/')).toBe('https://metis.example/en/');
  });
});
