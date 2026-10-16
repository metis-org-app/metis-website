// Types for scripts/seo.mjs (plain JS so the prerender step runs in Node without a compiler).
export interface PageMeta {
  title: string;
  description: string;
  ogDescription: string;
  ogImageAlt: string;
}

export const OG_LOCALES: Record<string, string>;
export function pageUrl(siteUrl: string, path: string): string;
export function localizeHead(
  html: string,
  options: {
    lang: string;
    meta: PageMeta;
    siteUrl: string;
    paths: Record<string, string>;
    defaultLang: string;
  },
): string;
export function injectApp(html: string, appHtml: string): string;
export function sitemapXml(siteUrl: string, paths: Record<string, string>, defaultLang: string): string;
export function robotsTxt(siteUrl: string): string;
