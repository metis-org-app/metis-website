import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { ConfigureSection } from './ConfigureSection';

function setup() {
  const user = userEvent.setup();
  renderWithProviders(<ConfigureSection />, { demo: true });
  return user;
}

describe('ConfigureSection', () => {
  it('updates the preview when the number of items changes', () => {
    setup();
    const range = screen.getByRole('slider', { name: /Number of items/ });
    fireEvent.change(range, { target: { value: '12' } });
    expect(range).toHaveAttribute('aria-valuetext', '12 items');
    expect(screen.getByText('+ 04 more items')).toBeInTheDocument();
    expect(screen.getByText('12 items · 3 types · Medium · guide on')).toBeInTheDocument();
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(9); // header + 8 visible rows
  });

  it('keeps at least one item type selected', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Multiple choice' }));
    await user.click(screen.getByRole('button', { name: 'True or false' }));
    const last = screen.getByRole('button', { name: /Short answer/ });
    expect(last).toHaveAttribute('aria-pressed', 'true');
    expect(last).toHaveAttribute('aria-disabled', 'true');
    await user.click(last);
    expect(last).toHaveAttribute('aria-pressed', 'true');
  });

  it('changes the difficulty', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Advanced' }));
    expect(screen.getByRole('button', { name: 'Advanced' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('img', { name: 'Level 3 of 3' }).length).toBeGreaterThan(0);
  });

  it('hides the max-hints control when Metis is off', async () => {
    const user = setup();
    expect(screen.getByRole('group', { name: 'Max hints per item' })).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: 'Metis in the student link' }));
    expect(screen.queryByRole('group', { name: 'Max hints per item' })).not.toBeInTheDocument();
    expect(screen.getByText('Metis: off')).toBeInTheDocument();
  });
});
