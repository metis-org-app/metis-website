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

  it('has one h1 and one h2 per section, in page order', () => {
    renderWithProviders(<App />, { lang });
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    // Each h2 names its section (aria-labelledby), and the sections keep their order.
    const sections = Array.from(document.querySelectorAll('h2'), (h2) => {
      const section = h2.closest('section');
      expect(section).toHaveAttribute('aria-labelledby', h2.id);
      return section?.id || h2.id;
    });
    expect(sections).toEqual(['guide', 'configure', 'results', 'insights', 'spec', 'cta-title']);
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
