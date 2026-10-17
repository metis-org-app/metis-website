import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { setDefaultIntersecting, triggerIntersection } from '../../test/mocks';
import { EXPRESSIONS } from './expressions';
import { MetisAvatar } from './MetisAvatar';

describe('MetisAvatar', () => {
  it('sets the expression class on the root and switches it with the prop', () => {
    const { container, rerender } = render(<MetisAvatar expression="thinking" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('mt', 'mt-e-thinking');
    rerender(<MetisAvatar expression="celebrating" />);
    expect(svg).toHaveClass('mt-e-celebrating');
    expect(svg).not.toHaveClass('mt-e-thinking');
  });

  it('is an image when labelled and decorative otherwise', () => {
    const { container, rerender } = render(<MetisAvatar expression="happy" label="Metis, the AI guide" />);
    expect(screen.getByRole('img', { name: 'Metis, the AI guide' })).toBeInTheDocument();
    rerender(<MetisAvatar expression="happy" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it.each(EXPRESSIONS)('ships artwork for the "%s" expression', (expression) => {
    const { container } = render(<MetisAvatar expression={expression} />);
    expect(container.querySelectorAll(`.mx-${expression}`).length).toBeGreaterThan(0);
  });

  it('pauses its animations while off-screen', () => {
    setDefaultIntersecting(false);
    const { container } = render(<MetisAvatar expression="guiding" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('data-paused');
    act(() => triggerIntersection(svg, true));
    expect(svg).not.toHaveAttribute('data-paused');
  });

  it('can be still: the static drawing, without idle loops', () => {
    const { container, rerender } = render(<MetisAvatar expression="thinking" />);
    const svg = container.querySelector('svg')!;
    expect(svg).not.toHaveAttribute('data-still');
    rerender(<MetisAvatar expression="thinking" still />);
    expect(svg).toHaveAttribute('data-still');
  });
});
