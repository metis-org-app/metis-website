import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import type { Lang } from './i18n/detect';
import { expectNoAxeViolations } from './test/axe';
import { renderWithProviders } from './test/render';

describe.each<Lang>(['en', 'es'])('App (%s)', (lang) => {
  it('has no axe violations', async () => {
    const { container } = renderWithProviders(<App />, { lang });
    await expectNoAxeViolations(container);
  });

  it('has the page landmarks and a skip link to main', () => {
    renderWithProviders(<App />, { lang });
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(within(screen.getByRole('banner')).getByRole('navigation')).toBeInTheDocument();
    const skip = screen.getAllByRole('link')[0]!;
    expect(skip).toHaveAttribute('href', '#main');
  });

  it('has one h1 and numbered h2 sections in order', () => {
    renderWithProviders(<App />, { lang });
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    // Each section's kicker ("02 — AI guide") comes before its h2.
    const kickers = Array.from(
      document.querySelectorAll('h2'),
      (h2) => /(\d\d) —/.exec(h2.closest('section')?.textContent ?? '')?.[1],
    );
    expect(kickers).toEqual(['02', '03', '04', '05', '06', '07']);
  });

  it('only links to anchors that exist, never to a bare "#"', () => {
    const { container } = renderWithProviders(<App />, { lang });
    const anchors = Array.from(container.querySelectorAll('a[href^="#"]'), (a) => a.getAttribute('href')!);
    expect(anchors.length).toBeGreaterThan(0);
    const broken = anchors.filter((href) => href === '#' || !document.getElementById(href.slice(1)));
    expect(broken).toEqual([]);
  });

  it('keeps no trace of the legacy landing', () => {
    const { container } = renderWithProviders(<App />, { lang });
    expect(container.innerHTML).not.toMatch(/trae-api|Metis Campus|dangerouslySetInnerHTML/i);
  });
});
