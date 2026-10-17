import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  AUDIT,
  INSIGHTS,
  ITEM05_INCORRECT,
  ITEM_ACCURACY,
  KPI,
  MATERIAL_HEATMAP,
  MISCONCEPTIONS,
  RELIANCE,
} from '../../../content/demo-data';
import { renderWithProviders } from '../../../test/render';
import { AuditWaffle } from './AuditWaffle';
import { MaterialHeatmap } from './MaterialHeatmap';
import { MisconceptionBars } from './MisconceptionBars';
import { RelianceTrend } from './RelianceTrend';

const sum = (values: readonly number[]) => values.reduce((total, n) => total + n, 0);
const dataRows = () =>
  within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((row) => Array.from(row.children, (cell) => cell.textContent));

describe('sample data behind the analyses', () => {
  it('matches the rest of the page', () => {
    expect(sum(Object.values(AUDIT))).toBe(INSIGHTS.questions);
    expect(sum(MATERIAL_HEATMAP.flat())).toBe(INSIGHTS.questions);
    expect(sum(MISCONCEPTIONS.map((item) => item.students))).toBe(ITEM05_INCORRECT);
    const item05 = ITEM_ACCURACY.find((item) => item.num === '05')!;
    expect(Math.round(((KPI.submissions - ITEM05_INCORRECT) / KPI.submissions) * 100)).toBe(item05.pct);
    expect(AUDIT.revealed).toBe(KPI.revealed);
  });
});

describe('AuditWaffle', () => {
  it('draws one square per reply and labels every category with its count', () => {
    renderWithProviders(<AuditWaffle active={false} />);
    const chart = screen.getByRole('img', { name: /^64 replies: 52 followed the rules/ });
    expect(chart.querySelectorAll(':scope > rect')).toHaveLength(INSIGHTS.questions);
    const legend = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(legend).toEqual([
      'Followed your rules and cited the material52',
      'Followed your rules, no citation9',
      'Drifted from the help style3',
      'Revealed the answer0',
    ]);
    expect(screen.getByText('0 of 64')).toBeInTheDocument();
    expect(screen.getByText('all 14 held back')).toBeInTheDocument();
    expect(dataRows()).toEqual([
      ['Followed your rules and cited the material', '52'],
      ['Followed your rules, no citation', '9'],
      ['Drifted from the help style', '3'],
      ['Revealed the answer', '0'],
    ]);
  });
});

describe('MaterialHeatmap', () => {
  it('prints every value and marks only the busiest cell with the accent', () => {
    const { container } = renderWithProviders(<MaterialHeatmap active={false} />);
    expect(
      screen.getByRole('img', { name: /The most, 17, are about page 08 during item 05/ }),
    ).toBeInTheDocument();
    const cells = Array.from(
      container.querySelectorAll('[aria-hidden="true"] > .contents > span:not(:first-child)'),
    );
    expect(cells).toHaveLength(42);
    expect(sum(cells.map((cell) => Number(cell.textContent)))).toBe(64);
    const accent = cells.filter((cell) => cell.className.includes('bg-accent'));
    expect(accent.map((cell) => cell.textContent)).toEqual(['17']);
    expect(screen.getAllByRole('listitem').map((li) => li.querySelector('.font-mono')?.textContent)).toEqual([
      '21 questions',
      '12 questions',
      '6 questions',
    ]);
    expect(dataRows().map((row) => row.at(-1))).toEqual(['4', '3', '12', '8', '25', '12']);
  });
});

describe('MisconceptionBars', () => {
  it('ranks the named beliefs largest first and keeps the unclear ones last', () => {
    renderWithProviders(<MisconceptionBars active={false} />);
    const list = screen.getByRole('list', {
      name: /three misconceptions explain 11 of the 14 wrong answers/,
    });
    const rows = within(list).getAllByRole('listitem');
    const counts = rows.map((row) => Number(/(\d+) students/.exec(row.textContent ?? '')![1]));
    const named = counts.slice(0, -1);
    expect(named).toEqual(named.toSorted((a, b) => b - a));
    expect(rows.at(-1)).toHaveTextContent('No clear pattern');
    expect(rows[0]!.querySelectorAll('rect')[1]).toHaveAttribute('width', '100%');
    expect(screen.getByText('What to teach on Monday')).toBeInTheDocument();
    expect(screen.getAllByRole('blockquote')).toHaveLength(2);
  });
});

describe('RelianceTrend', () => {
  it('plots the median per quiz with labels and the current assessment marked', () => {
    renderWithProviders(<RelianceTrend active={false} />);
    const chart = screen.getByRole('img', { name: /went from 3 in Quiz 01 to 1 in Quiz 04/ });
    for (const quiz of ['Quiz 01', 'Quiz 02', 'Quiz 03', 'Quiz 04']) expect(chart).toHaveTextContent(quiz);
    expect(chart).toHaveTextContent('This assessment');
    expect(dataRows()).toEqual(
      RELIANCE.map((q) => [`Quiz ${q.quiz}`, String(q.median), `${q.p25}–${q.p75}`]),
    );
    expect(screen.getByText('31% → 12%')).toBeInTheDocument();
  });

  it('formats numbers for Spanish', () => {
    renderWithProviders(<RelianceTrend active={false} />, { lang: 'es' });
    expect(screen.getByRole('img')).toHaveTextContent('1,5');
    expect(screen.getByText('31 % → 12 %')).toBeInTheDocument();
  });
});
