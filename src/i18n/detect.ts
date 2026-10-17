export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];

/** Spanish lives at the root and is the default (x-default) for every other language. */
export const FALLBACK_LANG: Lang = 'es';

/** Each language has its own prerendered page, so search engines can index both. */
export const LANG_PATHS: Record<Lang, string> = { es: '/', en: '/en/' };

/**
 * Netlify reads this cookie instead of the browser's Accept-Language for the "/" → "/en/" redirect
 * (netlify.toml), so the language someone picks sticks on their next visit.
 */
export const LANG_COOKIE = 'nf_lang';
const ONE_YEAR_S = 60 * 60 * 24 * 365;

export function isLang(value: unknown): value is Lang {
  return value === 'es' || value === 'en';
}

/** The page language comes from the URL: `/en` or `/en/…` is English, everything else Spanish. */
export function langFromPath(pathname: string): Lang {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : FALLBACK_LANG;
}

export function pathForLang(lang: Lang): string {
  return LANG_PATHS[lang];
}

/** Typed without the DOM lib: this module is also compiled for the Node scripts (prerender, SEO tests). */
type CookieJar = { cookie: string };
const browser = globalThis as { document?: CookieJar; location?: { protocol?: string } };

/** Remembers the choice for the root redirect. Best effort: cookies can be blocked. */
export function storeLangChoice(lang: Lang, jar: CookieJar | undefined = browser.document): void {
  try {
    if (!jar) return;
    const secure = browser.location?.protocol === 'https:' ? '; secure' : '';
    jar.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${ONE_YEAR_S}; samesite=lax${secure}`;
  } catch {
    // Not remembering the choice only means the root redirect uses the browser language again.
  }
}
