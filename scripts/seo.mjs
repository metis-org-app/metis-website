// Pure helpers for scripts/prerender.mjs: per-language <head>, the app markup, sitemap and robots.
// Kept free of file-system access so scripts/seo.test.ts can check them without a build.

/** Open Graph locale per page language. */
export const OG_LOCALES = { es: 'es_ES', en: 'en_US' };

const escapeAttr = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const escapeText = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;');

/** Absolute URL of a page path ("/", "/en/") on the site. */
export function pageUrl(siteUrl, path) {
  return new URL(path, `${siteUrl.replace(/\/+$/, '')}/`).href;
}

/** Replaces exactly one match, so a change in index.html fails the build instead of shipping stale tags. */
function replaceOnce(html, pattern, replacement, what) {
  const matches = html.match(new RegExp(pattern.source, `${pattern.flags.replace('g', '')}g`));
  if (matches?.length !== 1)
    throw new Error(`prerender: expected one ${what} in index.html, found ${matches?.length ?? 0}`);
  return html.replace(pattern, replacement);
}

const metaTag = (attr, key) =>
  new RegExp(`<meta\\s+${attr}="${key.replaceAll(':', '\\:')}"\\s+content="[^"]*"\\s*\\/>`);

/**
 * Localizes the built index.html head for one language: html lang, title, description, canonical,
 * Open Graph tags, and hreflang alternates for every language (Spanish is also the x-default).
 */
export function localizeHead(html, { lang, meta, siteUrl, paths, defaultLang }) {
  const url = pageUrl(siteUrl, paths[lang]);
  const others = Object.keys(paths).filter((code) => code !== lang);
  const alternates = [
    ...Object.entries(paths).map(
      ([code, path]) => `<link rel="alternate" hreflang="${code}" href="${pageUrl(siteUrl, path)}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl(siteUrl, paths[defaultLang])}" />`,
  ].join('\n    ');

  let out = html;
  out = replaceOnce(out, /<html lang="[^"]*">/, `<html lang="${lang}">`, '<html lang>');
  out = replaceOnce(out, /<title>[^<]*<\/title>/, `<title>${escapeText(meta.title)}</title>`, '<title>');
  out = replaceOnce(
    out,
    metaTag('name', 'description'),
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    'meta description',
  );
  out = replaceOnce(
    out,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />\n    ${alternates}`,
    'canonical link',
  );
  const og = {
    'og:title': meta.title,
    'og:description': meta.ogDescription,
    'og:url': url,
    'og:image:alt': meta.ogImageAlt,
    'og:locale': OG_LOCALES[lang],
    'og:locale:alternate': others.map((code) => OG_LOCALES[code]).join(','),
  };
  for (const [property, value] of Object.entries(og)) {
    out = replaceOnce(
      out,
      metaTag('property', property),
      `<meta property="${property}" content="${escapeAttr(value)}" />`,
      `meta ${property}`,
    );
  }
  return out;
}

/** Puts the server-rendered app inside the empty #root. */
export function injectApp(html, appHtml) {
  return replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${appHtml}</div>`, 'empty #root');
}

export function sitemapXml(siteUrl, paths, defaultLang) {
  const links = [
    ...Object.entries(paths).map(
      ([code, path]) =>
        `    <xhtml:link rel="alternate" hreflang="${code}" href="${pageUrl(siteUrl, path)}"/>`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(siteUrl, paths[defaultLang])}"/>`,
  ].join('\n');
  const urls = Object.values(paths)
    .map((path) => `  <url>\n    <loc>${pageUrl(siteUrl, path)}</loc>\n${links}\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

export function robotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${pageUrl(siteUrl, '/sitemap.xml')}\n`;
}
