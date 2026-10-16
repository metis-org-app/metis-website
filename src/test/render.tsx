import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { DemoProvider } from '../features/guide/DemoProvider';
import type { Lang } from '../i18n/detect';
import { LangProvider } from '../i18n/LangProvider';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  lang?: Lang;
  /** Wrap in the guide/configurator state provider. */
  demo?: boolean;
}

/** Renders with the app's providers (English by default). */
export function renderWithProviders(
  ui: ReactElement,
  { lang = 'en', demo = false, ...options }: Options = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <LangProvider initialLang={lang}>
        {demo ? <DemoProvider>{children}</DemoProvider> : children}
      </LangProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
