import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test/axe';
import { mockReducedMotion } from '../../test/mocks';
import { renderWithProviders } from '../../test/render';
import { AnalysisCarousel, SLIDE_MS } from './AnalysisCarousel';

const TABS = ['01 · Integrity', '02 · What they ask', '03 · With evidence', '04 · Over time'];

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
});
afterEach(() => {
  vi.useRealTimers();
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
});

function setup(lang: 'en' | 'es' = 'en') {
  const user = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) });
  const view = renderWithProviders(<AnalysisCarousel />, { lang });
  return { user, ...view };
}

const selected = () => screen.getByRole('tab', { selected: true });
const panels = () => Array.from(document.querySelectorAll('[role="tabpanel"]'));
const liveRegion = () => panels()[0]!.parentElement!;
const advance = (ms = SLIDE_MS) => act(() => vi.advanceTimersByTime(ms));

describe('AnalysisCarousel', () => {
  it('shows four analyses as tabs, with only the selected slide reachable', () => {
    setup();
    expect(screen.getByRole('region', { name: 'What Metis analyzes in the conversations' })).toHaveAttribute(
      'aria-roledescription',
      'carousel',
    );
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual(TABS);
    expect(selected()).toHaveTextContent('Integrity');
    expect(panels().map((panel) => panel.hasAttribute('inert'))).toEqual([false, true, true, true]);
    expect(panels()[1]).toHaveAttribute('aria-label', '2 of 4');
    // Every slide is in the markup (prerendered for search engines), even when hidden.
    expect(panels()[3]).toHaveTextContent('Questions to Metis per student fell from 3 to 1');
  });

  it('moves on its own and loops back to the first slide', () => {
    setup();
    expect(liveRegion()).toHaveAttribute('aria-live', 'off');
    advance();
    expect(selected()).toHaveTextContent('What they ask');
    advance(SLIDE_MS * 3);
    expect(selected()).toHaveTextContent('Integrity');
  });

  it('can be paused and played again', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Pause the analyses carousel' }));
    expect(liveRegion()).toHaveAttribute('aria-live', 'polite');
    advance(SLIDE_MS * 2);
    expect(selected()).toHaveTextContent('Integrity');
    // Playing again rotates even with the pointer and focus still on the button.
    await user.click(screen.getByRole('button', { name: 'Play the analyses carousel' }));
    advance();
    expect(selected()).toHaveTextContent('What they ask');
  });

  it('waits while the pointer is over it', () => {
    setup();
    fireEvent.pointerEnter(screen.getByRole('region'));
    advance(SLIDE_MS * 2);
    expect(selected()).toHaveTextContent('Integrity');
    fireEvent.pointerLeave(screen.getByRole('region'));
    advance();
    expect(selected()).toHaveTextContent('What they ask');
  });

  it('goes to a slide on request and stops rotating', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: /With evidence/ }));
    expect(selected()).toHaveTextContent('With evidence');
    expect(panels()[2]).not.toHaveAttribute('inert');
    await user.click(screen.getByRole('button', { name: 'Next analysis' }));
    expect(selected()).toHaveTextContent('Over time');
    await user.click(screen.getByRole('button', { name: 'Next analysis' }));
    expect(selected()).toHaveTextContent('Integrity');
    await user.click(screen.getByRole('button', { name: 'Previous analysis' }));
    expect(selected()).toHaveTextContent('Over time');
    fireEvent.pointerLeave(screen.getByRole('region'));
    advance(SLIDE_MS * 2);
    expect(selected()).toHaveTextContent('Over time');
  });

  it('moves between tabs with the arrow, Home and End keys', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: /Integrity/ }));
    await user.keyboard('{ArrowRight}');
    expect(selected()).toHaveTextContent('What they ask');
    expect(selected()).toHaveFocus();
    await user.keyboard('{End}');
    expect(selected()).toHaveTextContent('Over time');
    await user.keyboard('{ArrowRight}');
    expect(selected()).toHaveTextContent('Integrity');
    await user.keyboard('{ArrowLeft}');
    expect(selected()).toHaveTextContent('Over time');
    await user.keyboard('{Home}');
    expect(selected()).toHaveTextContent('Integrity');
    expect(screen.getAllByRole('tab').map((tab) => tab.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  it('stays still under reduced motion, without a pause button', () => {
    mockReducedMotion(true);
    setup();
    expect(screen.queryByRole('button', { name: /carousel/ })).not.toBeInTheDocument();
    advance(SLIDE_MS * 2);
    expect(selected()).toHaveTextContent('Integrity');
    expect(liveRegion()).toHaveAttribute('aria-live', 'polite');
  });

  it('does not rotate on narrow screens, where it is taller than the viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });
    setup();
    expect(screen.queryByRole('button', { name: /carousel/ })).not.toBeInTheDocument();
    advance(SLIDE_MS * 2);
    expect(selected()).toHaveTextContent('Integrity');
    expect(screen.getByRole('button', { name: 'Next analysis' })).toBeInTheDocument();
  });

  it('speaks Spanish', () => {
    setup('es');
    expect(
      screen.getByRole('region', { name: 'Lo que Metis analiza en las conversaciones' }),
    ).toHaveAttribute('aria-roledescription', 'carrusel');
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      '01 · Integridad',
      '02 · De qué hablan',
      '03 · Con evidencia',
      '04 · En el tiempo',
    ]);
    expect(panels()[0]).toHaveAttribute('aria-label', '1 de 4');
  });

  it('has no axe violations', async () => {
    vi.useRealTimers();
    const { container } = renderWithProviders(<AnalysisCarousel />);
    await expectNoAxeViolations(container, {
      'page-has-heading-one': { enabled: false },
      region: { enabled: false },
    });
  });
});
