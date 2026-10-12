import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Lang, type TranslationKey } from './translations';

const STORAGE_KEY = 'metis-lang';

function detectLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'es' || saved === 'en') return saved;
  const langs =
    navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es'];
  for (const l of langs) {
    if (!l) continue;
    const low = l.toLowerCase();
    if (low.startsWith('es')) return 'es';
    if (low.startsWith('en')) return 'en';
  }
  return 'es';
}

interface LangValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  useEffect(() => {
    const dict = translations[lang];
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    document.title = dict.doc_title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', dict.doc_desc);
  }, [lang]);

  const value = useMemo<LangValue>(
    () => ({
      lang,
      setLang,
      toggle: () => setLang(lang === 'es' ? 'en' : 'es'),
      t: (key: TranslationKey) => translations[lang][key],
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangValue {
  const value = useContext(LangContext);
  if (!value) throw new Error('useLang must be used within LangProvider');
  return value;
}
