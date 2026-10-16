import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockReducedMotion } from '../../test/mocks';
import { renderWithProviders } from '../../test/render';
import { HERO_CYCLE_MS, MetisCard } from './MetisCard';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

const portrait = () => screen.getByRole('img', { name: /^Metis, the AI guide, / });

describe('MetisCard', () => {
  it('has no expression buttons: it cycles on its own like a carousel', () => {
    renderWithProviders(<MetisCard />);
    expect(screen.queryByRole('button', { name: 'Listening' })).not.toBeInTheDocument();
    expect(portrait()).toHaveAccessibleName('Metis, the AI guide, happy');
    expect(screen.getByText('Metis / Happy')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(HERO_CYCLE_MS));
    expect(portrait()).toHaveAccessibleName('Metis, the AI guide, listening');
    expect(portrait()).toHaveClass('mt-e-listening');
    expect(screen.getByText('Ask me anything about this item.')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(HERO_CYCLE_MS * 5));
    expect(portrait()).toHaveAccessibleName('Metis, the AI guide, happy');
  });

  it('can be paused and resumed', () => {
    renderWithProviders(<MetisCard />);
    act(() => screen.getByRole('button', { name: 'Pause the Metis carousel' }).click());
    act(() => vi.advanceTimersByTime(HERO_CYCLE_MS * 3));
    expect(portrait()).toHaveAccessibleName('Metis, the AI guide, happy');
    act(() => screen.getByRole('button', { name: 'Play the Metis carousel' }).click());
    act(() => vi.advanceTimersByTime(HERO_CYCLE_MS));
    expect(portrait()).toHaveAccessibleName('Metis, the AI guide, listening');
  });

  it('does not move under reduced motion', () => {
    mockReducedMotion(true);
    renderWithProviders(<MetisCard />);
    act(() => vi.advanceTimersByTime(HERO_CYCLE_MS * 2));
    expect(portrait()).toHaveAccessibleName('Metis, the AI guide, happy');
    expect(screen.queryByRole('button', { name: /carousel/ })).not.toBeInTheDocument();
  });

  it('speaks Spanish', () => {
    renderWithProviders(<MetisCard />, { lang: 'es' });
    expect(screen.getByText('Metis / Contenta')).toBeInTheDocument();
    expect(screen.getByText('Doy pistas, nunca respuestas.')).toBeInTheDocument();
  });
});
