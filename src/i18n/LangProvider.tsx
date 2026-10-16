import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext } from './context';
import { FALLBACK_LANG, langFromPath, pathForLang, storeLangChoice, type Lang } from './detect';
import { MESSAGES } from './messages';

/**
 * Active language. It starts from the URL (`/` Spanish, `/en/` English), so the prerendered page and the
 * first client render agree. Switching language updates the URL in place (no reload), and the browser's
 * back and forward buttons switch it back.
 */
export function LangProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(
    () =>
      initialLang ?? (typeof window === 'undefined' ? FALLBACK_LANG : langFromPath(window.location.pathname)),
  );

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    storeLangChoice(next);
    const path = pathForLang(next);
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', `${path}${window.location.search}${window.location.hash}`);
    }
  }, []);

  useEffect(() => {
    const onPop = () => setLangState(langFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const m = MESSAGES[lang];

  // Keep the document in sync with the active language (the prerendered head already matches its page).
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = m.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', m.meta.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    const href = canonical?.getAttribute('href');
    if (canonical && href) canonical.setAttribute('href', new URL(pathForLang(lang), href).href);
  }, [lang, m]);

  const value = useMemo(() => ({ lang, m, setLang }), [lang, m, setLang]);
  return <I18nContext value={value}>{children}</I18nContext>;
}
