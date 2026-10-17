import { createContext } from 'react';
import type { Lang } from './detect';
import type { Messages } from './messages/en';

export interface I18nValue {
  lang: Lang;
  /** Messages for the active language. */
  m: Messages;
  setLang: (lang: Lang) => void;
}

export const I18nContext = createContext<I18nValue | null>(null);
