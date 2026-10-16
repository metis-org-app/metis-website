// Prerenders one static page per language after `vite build` and `vite build --ssr`:
//   dist/index.html (Spanish, also the x-default) and dist/en/index.html (English),
// each with its own head (lang, title, description, canonical, hreflang, Open Graph),
// plus dist/sitemap.xml and dist/robots.txt. Run through `npm run build`.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { injectApp, localizeHead, robotsTxt, sitemapXml } from './seo.mjs';

const DIST = new URL('../dist/', import.meta.url);
const SSR_DIR = new URL('../dist-ssr/', import.meta.url);

const { render, MESSAGES, LANGS, LANG_PATHS } = await import(new URL('entry-server.js', SSR_DIR).href);
const template = await readFile(new URL('index.html', DIST), 'utf8');

// The client build already resolved %VITE_SITE_URL% in the canonical link.
const canonical = template.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if (!canonical) throw new Error('prerender: no canonical link in dist/index.html');
const siteUrl = canonical.replace(/\/+$/, '');
const defaultLang = LANGS.find((lang) => LANG_PATHS[lang] === '/');

const pages = LANGS.map((lang) => {
  const head = localizeHead(template, {
    lang,
    meta: MESSAGES[lang].meta,
    siteUrl,
    paths: LANG_PATHS,
    defaultLang,
  });
  const app = render(lang);
  // The CSP (style-src 'self') blocks style attributes in HTML; components apply theirs after hydration.
  if (/\sstyle="/.test(app))
    throw new Error(`prerender: inline style attribute in the ${lang} page, see the CSP`);
  return { lang, html: injectApp(head, app), file: new URL(`.${LANG_PATHS[lang]}index.html`, DIST) };
});

await Promise.all(pages.map(({ file }) => mkdir(new URL('.', file), { recursive: true })));
await Promise.all(pages.map(({ file, html }) => writeFile(file, html)));
for (const { lang, html } of pages) {
  console.log(`prerendered ${LANG_PATHS[lang]} (${lang}): ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}

await writeFile(new URL('sitemap.xml', DIST), sitemapXml(siteUrl, LANG_PATHS, defaultLang));
await writeFile(new URL('robots.txt', DIST), robotsTxt(siteUrl));
await rm(SSR_DIR, { recursive: true, force: true });
console.log(`sitemap.xml and robots.txt for ${siteUrl}`);
