import { act } from '@testing-library/react';
import { StrictMode } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import type { Lang } from './i18n/detect';
import { LangProvider } from './i18n/LangProvider';

const page = (lang: Lang) => (
  <StrictMode>
    <LangProvider initialLang={lang}>
      <App />
    </LangProvider>
  </StrictMode>
);

let root: Root | undefined;
afterEach(() => {
  act(() => root?.unmount());
  root = undefined;
  document.body.innerHTML = '';
});

describe.each<Lang>(['es', 'en'])('prerendered page (%s)', (lang) => {
  const html = renderToString(page(lang));

  it('has no style attributes, which the CSP (style-src self) would block', () => {
    expect(html).not.toMatch(/\sstyle="/);
  });

  it('leaves the heavy avatar artwork to the browser', () => {
    expect(html).toContain('class="mt mt-e-happy');
    expect(html).not.toContain('mx-happy');
  });

  it('hydrates without mismatches', async () => {
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);
    const recoverable: unknown[] = [];
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => {
      root = hydrateRoot(container, page(lang), { onRecoverableError: (error) => recoverable.push(error) });
    });
    expect(recoverable).toEqual([]);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
    // After hydration the avatars draw their artwork.
    expect(container.querySelectorAll('.mx-happy').length).toBeGreaterThan(0);
  });
});
