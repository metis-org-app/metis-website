import { act, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { READ_MS } from '../../features/material/material';
import { expectNoAxeViolations } from '../../test/axe';
import { mockReducedMotion } from '../../test/mocks';
import { renderWithProviders } from '../../test/render';
import { ConfigureSection } from './ConfigureSection';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
});
afterEach(() => {
  vi.useRealTimers();
});

function setup(lang: 'en' | 'es' = 'en') {
  const user = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) });
  const view = renderWithProviders(<ConfigureSection />, { demo: true, lang });
  return { user, ...view };
}

const fileRows = () => within(screen.getByRole('list', { name: 'Files added' })).getAllByRole('listitem');
const detected = () => screen.getByRole('heading', { name: /Topics detected/ }).parentElement!;
const dropZone = () => screen.getByText('Drag your class files here').closest('div[class*="border-dashed"]')!;

function filesTransfer(...files: File[]) {
  return { dataTransfer: { files, types: ['Files'], dropEffect: 'none' } };
}

describe('MaterialDrop', () => {
  it('starts empty, says the demo keeps files on the device, and previews the sample material', () => {
    setup();
    expect(screen.getByText('Add a file or try a sample to see the topics Metis finds.')).toBeInTheDocument();
    expect(screen.getByText(/your files stay on your device/)).toBeInTheDocument();
    expect(screen.getByText('Sample material: Lesson 4')).toBeInTheDocument();
  });

  it('reads a sample file, lists the topics found and feeds the preview', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Add the sample file Lesson_06.pdf' }));
    expect(fileRows()[0]).toHaveTextContent('Lesson_06.pdf');
    expect(fileRows()[0]).toHaveTextContent('2.4 MB');
    expect(fileRows()[0]).toHaveTextContent('Reading…');

    act(() => vi.advanceTimersByTime(READ_MS));
    expect(fileRows()[0]).toHaveTextContent('5 topics found');
    expect(within(detected()).getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByText('Sources: Lesson_06.pdf')).toBeInTheDocument();
    expect(screen.getByText('Lesson_06.pdf: 5 topics found')).toHaveAttribute('aria-live', 'polite');

    const topics = new Set(
      within(detected())
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    );
    const previewTopics = within(screen.getByRole('table'))
      .getAllByRole('row')
      .slice(1)
      .map((row) => row.children[2]!.textContent);
    expect(previewTopics.every((topic) => topics.has(topic))).toBe(true);
  });

  it('accepts dropped files and flags formats it cannot read, next to the file', () => {
    setup();
    const zone = dropZone();
    fireEvent.dragEnter(zone, filesTransfer());
    expect(screen.getByText('Drop them so Metis can read them')).toBeInTheDocument();
    fireEvent.drop(
      zone,
      filesTransfer(new File(['x'], 'unit_3.docx'), new File(['y'], 'photo.jpg', { type: 'image/jpeg' })),
    );
    expect(screen.getByText('Drag your class files here')).toBeInTheDocument();
    const [docx, photo] = fileRows();
    expect(docx).toHaveTextContent('Reading…');
    expect(photo).toHaveTextContent('Metis cannot read this format. Use PDF, DOCX, PPTX or text.');
    act(() => vi.advanceTimersByTime(READ_MS));
    expect(docx).toHaveTextContent('5 topics found');
  });

  it('takes files from the file picker, removes them one by one or all at once', async () => {
    const { user, container } = setup();
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    expect(input).toHaveAttribute('accept', '.pdf,.docx,.pptx,.txt,.md');
    await user.upload(input, [new File(['a'], 'a.pdf'), new File(['b'], 'b.md')]);
    expect(fileRows()).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Remove a.pdf' }));
    expect(fileRows()).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Remove all' }));
    expect(screen.queryByRole('list', { name: 'Files added' })).not.toBeInTheDocument();
  });

  it('keeps the demo to five files', () => {
    setup();
    const files = Array.from({ length: 7 }, (_, i) => new File(['x'], `file_${i}.pdf`));
    fireEvent.drop(dropZone(), filesTransfer(...files));
    expect(fileRows()).toHaveLength(5);
    expect(screen.getAllByText('The demo takes up to 5 files.').length).toBeGreaterThan(0);
  });

  it('skips the reading wait under reduced motion', async () => {
    mockReducedMotion(true);
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Add the sample file Supply_and_demand.pptx' }));
    expect(fileRows()[0]).toHaveTextContent('5 topics found');
  });

  it('speaks Spanish', async () => {
    const { user } = setup('es');
    await user.click(screen.getByRole('button', { name: 'Agregar el archivo de ejemplo Leccion_06.pdf' }));
    act(() => vi.advanceTimersByTime(READ_MS));
    expect(screen.getByText('Fuentes: Leccion_06.pdf')).toBeInTheDocument();
    expect(screen.getByText(/2,4 MB/)).toBeInTheDocument();
  });

  it('has no axe violations with files listed', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const { container } = renderWithProviders(<ConfigureSection />, { demo: true });
    await user.click(screen.getByRole('button', { name: 'Add the sample file Lesson_06.pdf' }));
    await expectNoAxeViolations(container, { 'page-has-heading-one': { enabled: false } });
  });
});
