import { act, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockReducedMotion, setDefaultIntersecting, triggerIntersection } from '../../test/mocks';
import { renderWithProviders } from '../../test/render';
import { ResultsSection } from './ResultsSection';

afterEach(() => {
  vi.useRealTimers();
});

/** The animated (visible) KPI numbers, hidden from screen readers. */
const visibleKpis = () =>
  Array.from(document.querySelectorAll('dd > span[aria-hidden="true"]')).map((el) => el.textContent);

describe('ResultsSection', () => {
  it('counts the KPIs up once the section is in view', async () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    setDefaultIntersecting(false);
    const { container } = renderWithProviders(<ResultsSection />);
    expect(visibleKpis()).toEqual(['0/28', '0%', '0', '0']);

    const target = container.querySelector('.container-page')!;
    act(() => triggerIntersection(target, true));
    await act(() => vi.advanceTimersByTimeAsync(1600));
    expect(visibleKpis()).toEqual(['26/28', '74%', '11', '0']);
  });

  it('always exposes the final values to assistive technology', () => {
    renderWithProviders(<ResultsSection />);
    for (const value of ['26/28', '74%', '11'])
      expect(screen.getByText(value, { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('shows final values immediately under reduced motion', () => {
    mockReducedMotion(true);
    setDefaultIntersecting(false);
    renderWithProviders(<ResultsSection />);
    expect(visibleKpis()).toEqual(['26/28', '74%', '11', '0']);
  });

  it('shows Metis reviewing the results', () => {
    renderWithProviders(<ResultsSection />);
    expect(
      screen.getByRole('img', { name: 'Metis reviewing the results, with reading glasses' }),
    ).toHaveClass('mt-e-reviewing');
    expect(screen.getByRole('link', { name: 'See the conversations →' })).toHaveAttribute(
      'href',
      '#insights',
    );
  });
});
