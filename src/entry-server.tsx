import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { LANG_PATHS, LANGS, type Lang } from './i18n/detect';
import { LangProvider } from './i18n/LangProvider';
import { MESSAGES } from './i18n/messages';

/** Server render of the whole page in one language; scripts/prerender.mjs writes it into dist/. */
export function render(lang: Lang): string {
  return renderToString(
    <StrictMode>
      <LangProvider initialLang={lang}>
        <App />
      </LangProvider>
    </StrictMode>,
  );
}

export { LANG_PATHS, LANGS, MESSAGES };
