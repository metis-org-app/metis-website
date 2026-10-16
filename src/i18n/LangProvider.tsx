import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext } from './context';
import { browserLanguages, detectLang, readStoredLang, storeLang, type Lang } from './detect';
import { en, type Messages } from './messages/en';
import { es } from './messages/es';

const MESSAGES: Record<Lang, Messages> = { en, es };

export function LangProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(
    () => initialLang ?? detectLang({ stored: readStoredLang(), languages: browserLanguages() }),
  );

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    storeLang(next);
  }, []);

  const m = MESSAGES[lang];

  // Keep the document in sync with the active language.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = m.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', m.meta.description);
  }, [lang, m]);

  const value = useMemo(() => ({ lang, m, setLang }), [lang, m, setLang]);
  return <I18nContext value={value}>{children}</I18nContext>;
}
