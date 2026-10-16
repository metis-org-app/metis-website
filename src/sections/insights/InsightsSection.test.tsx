import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { INTENT_SHARES, QUESTION_TIMELINE, SESSIONS } from '../../content/demo-data';
import { expectNoAxeViolations } from '../../test/axe';
import { renderWithProviders } from '../../test/render';
import { InsightsSection } from './InsightsSection';

const transcript = (student: string) =>
  screen.getByRole('list', { name: `Conversation between ${student} and Metis` });

describe('InsightsSection', () => {
  it('summarises who asked Metis, how much, and when', () => {
    renderWithProviders(<InsightsSection />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Every question to Metis is saved. Read them as data.' }),
    ).toBeInTheDocument();
    const stats = screen.getByText('Students who asked').closest('dl')!;
    expect(stats).toHaveTextContent('17/26');
    expect(stats).toHaveTextContent('64');
    expect(stats).toHaveTextContent('20–25 min');
    expect(stats).toHaveTextContent('Peak · item 05');
  });

  it('ranks what students ask, and the answer is always withheld', () => {
    renderWithProviders(<InsightsSection />);
    const list = screen.getByRole('heading', { name: 'What students ask Metis' }).nextElementSibling!;
    const rows = within(list as HTMLElement).getAllByRole('listitem');
    expect(rows.map((row) => row.querySelector('.font-mono.text-sm')?.textContent)).toEqual(
      INTENT_SHARES.map((s) => `${s.pct}%`),
    );
    expect(rows[2]).toHaveTextContent('Ask for the answer');
    expect(rows[2]).toHaveTextContent('Answer withheld every time');
    expect(rows[2]).toHaveTextContent('Just tell me the answer.');
  });

  it('charts the questions during the exam and marks the peak', () => {
    renderWithProviders(<InsightsSection />);
    const chart = screen.getByRole('img', { name: /^Line chart: questions to Metis rose to a peak of 17/ });
    expect(chart).toHaveTextContent('Item 05 · 17');
    expect(chart.querySelectorAll('rect[width="6"], rect[width="10"]')).toHaveLength(
      QUESTION_TIMELINE.length,
    );
    expect(QUESTION_TIMELINE.reduce((a, b) => a + b, 0)).toBe(64);
  });

  it('lets the instructor read any saved conversation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InsightsSection />);
    const group = screen.getByRole('group', { name: 'Saved conversations' });
    expect(within(group).getAllByRole('button')).toHaveLength(SESSIONS.length);

    const first = screen.getByRole('button', { name: /^Student 07/ });
    expect(first).toHaveAttribute('aria-pressed', 'true');
    expect(first).toHaveAccessibleName('Student 07 Item 05 · min 21 · 4 messages');
    expect(transcript('Student 07')).toHaveTextContent('What does consumer surplus mean?');

    await user.click(screen.getByRole('button', { name: /^Student 12/ }));
    expect(first).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /^Student 12/ })).toHaveAttribute('aria-pressed', 'true');
    const log = transcript('Student 12');
    expect(within(log).getAllByRole('listitem')).toHaveLength(4);
    expect(log).toHaveTextContent('Is it $40?');
    expect(log).toHaveTextContent('ANSWER WITHHELD');
    expect(screen.getByText('Item 03 · Equilibrium price')).toBeInTheDocument();
  });

  it('shows the Metis trend note with Metis thinking', () => {
    renderWithProviders(<InsightsSection />);
    expect(screen.getByRole('img', { name: 'Metis thinking about the class conversations' })).toHaveClass(
      'mt-e-thinking',
    );
    expect(screen.getByText(/8 of the 17 students who used Metis/)).toBeInTheDocument();
    expect(screen.getByText('Based on 64 questions from 17 conversations')).toBeInTheDocument();
  });

  it('speaks Spanish', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InsightsSection />, { lang: 'es' });
    expect(screen.getByText('05 — Conversaciones')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Estudiante 19/ }));
    expect(screen.getByRole('list', { name: 'Conversación entre Estudiante 19 y Metis' })).toHaveTextContent(
      'RESPUESTA RESERVADA',
    );
  });

  it('has no axe violations', async () => {
    const { container } = renderWithProviders(<InsightsSection />);
    await expectNoAxeViolations(container, { 'page-has-heading-one': { enabled: false } });
  });
});
