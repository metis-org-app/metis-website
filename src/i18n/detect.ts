export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const STORAGE_KEY = 'metis-lang';
export const FALLBACK_LANG: Lang = 'es';

export function isLang(value: unknown): value is Lang {
  return value === 'es' || value === 'en';
}

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem'>;

/** `localStorage` can throw (blocked cookies, private mode, sandboxed iframes). */
function browserStorage(): Storage | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

export function readStoredLang(storage: ReadableStorage | undefined = browserStorage()): Lang | null {
  try {
    const value = storage?.getItem(STORAGE_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeLang(lang: Lang, storage: WritableStorage | undefined = browserStorage()): void {
  try {
    storage?.setItem(STORAGE_KEY, lang);
  } catch {
    // Persisting the choice is best effort.
  }
}

export function browserLanguages(): readonly string[] {
  if (typeof navigator === 'undefined') return [];
  if (navigator.languages?.length) return navigator.languages;
  return navigator.language ? [navigator.language] : [];
}

/** Stored choice → first supported browser language → fallback (Spanish). */
export function detectLang({
  stored,
  languages,
  fallback = FALLBACK_LANG,
}: {
  stored: Lang | null;
  languages: readonly string[];
  fallback?: Lang;
}): Lang {
  if (stored) return stored;
  for (const language of languages) {
    const prefix = language.toLowerCase().slice(0, 2);
    if (isLang(prefix)) return prefix;
  }
  return fallback;
}
