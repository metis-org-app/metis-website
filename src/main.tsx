import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted fonts (no third-party requests; works with the strict CSP).
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './index.css';
import App from './App';
import { LangProvider } from './i18n/LangProvider';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
);
