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

const pressed = () => screen.getAllByRole('button', { pressed: true }).map((b) => b.textContent);

describe('MetisCard', () => {
  it('cycles through the expressions', () => {
    renderWithProviders(<MetisCard />);
    expect(pressed()).toEqual(['Happy']);
    expect(screen.getByRole('img', { name: 'Metis, the AI guide, happy' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(HERO_CYCLE_MS));
    expect(pressed()).toEqual(['Listening']);
    expect(screen.getByText('Ask me anything about this item.')).toBeInTheDocument();
  });

  it('stops cycling once an expression is picked', () => {
    renderWithProviders(<MetisCard />);
    act(() => screen.getByRole('button', { name: 'Reviewing' }).click());
    expect(pressed()).toEqual(['Reviewing']);
    act(() => vi.advanceTimersByTime(HERO_CYCLE_MS * 3));
    expect(pressed()).toEqual(['Reviewing']);
  });

  it('does not cycle under reduced motion', () => {
    mockReducedMotion(true);
    renderWithProviders(<MetisCard />);
    act(() => vi.advanceTimersByTime(HERO_CYCLE_MS * 2));
    expect(pressed()).toEqual(['Happy']);
  });

  it('speaks Spanish', () => {
    renderWithProviders(<MetisCard />, { lang: 'es' });
    expect(pressed()).toEqual(['Contenta']);
    expect(screen.getByText('Doy pistas, nunca respuestas.')).toBeInTheDocument();
  });
});
