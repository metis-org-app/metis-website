import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
// Self-hosted fonts (no third-party requests; works with the strict CSP).
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './index.css';
import App from './App';
import { langFromPath } from './i18n/detect';
import { LangProvider } from './i18n/LangProvider';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

const app = (
  <StrictMode>
    <LangProvider initialLang={langFromPath(window.location.pathname)}>
      <App />
    </LangProvider>
  </StrictMode>
);

// Built pages are prerendered (scripts/prerender.mjs), so React takes over the existing HTML;
// the dev server serves an empty #root.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
