import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useI18n } from '../../i18n/useI18n';
import { renderWithProviders } from '../../test/render';
import { LangSwitch } from './LangSwitch';

function Heading() {
  const { m } = useI18n();
  return <h1>{m.header.cta}</h1>;
}

describe('LangSwitch', () => {
  it('links to each language page and marks the current one', () => {
    renderWithProviders(<LangSwitch />, { lang: 'es' });
    const spanish = screen.getByRole('link', { name: 'Español' });
    const english = screen.getByRole('link', { name: 'English' });
    expect(spanish).toHaveAttribute('href', '/');
    expect(spanish).toHaveAttribute('aria-current', 'page');
    expect(english).toHaveAttribute('href', '/en/');
    expect(english).toHaveAttribute('hreflang', 'en');
    expect(english).not.toHaveAttribute('aria-current');
  });

  it('switches in place, keeps the section in the URL and remembers the choice', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/#insights');
    renderWithProviders(
      <>
        <LangSwitch />
        <Heading />
      </>,
      { lang: 'es' },
    );
    await user.click(screen.getByRole('link', { name: 'English' }));
    expect(window.location.pathname).toBe('/en/');
    expect(window.location.hash).toBe('#insights');
    expect(document.cookie).toContain('nf_lang=en');
    expect(document.documentElement.lang).toBe('en');
    expect(screen.getByRole('heading', { name: 'Create assessment →' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('aria-current', 'page');
  });

  it('follows the browser history back to the previous language', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Heading />, { lang: 'es' });
    renderWithProviders(<LangSwitch />, { lang: 'es' });
    await user.click(screen.getAllByRole('link', { name: 'English' })[0]!);
    act(() => {
      window.history.replaceState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('heading', { name: 'Crear evaluación →' })).toBeInTheDocument();
  });

  it('leaves modified clicks (new tab) to the browser', () => {
    renderWithProviders(<LangSwitch />, { lang: 'es' });
    const english = screen.getByRole('link', { name: 'English' });
    const notCancelled = fireEvent.click(english, { metaKey: true });
    expect(notCancelled).toBe(true);
    expect(window.location.pathname).toBe('/');
  });
});
