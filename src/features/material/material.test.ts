import { describe, expect, it } from 'vitest';
import { TOPIC_IDS } from '../../content/demo-data';
import {
  MAX_DEMO_FILES,
  formatSize,
  initialMaterial,
  materialKind,
  materialReducer,
  readyFiles,
  readyTopics,
  topicsForSlot,
  type MaterialState,
} from './material';

const add = (state: MaterialState, names: string[], instant = false) =>
  materialReducer(state, { type: 'add', files: names.map((name) => ({ name, size: 2_400_000 })), instant });

describe('materialKind', () => {
  it.each([
    ['Lesson_06.PDF', 'pdf'],
    ['notes.docx', 'docx'],
    ['slides.pptx', 'pptx'],
    ['summary.md', 'text'],
    ['readme.txt', 'text'],
    ['photo.jpg', null],
    ['no-extension', null],
  ])('%s → %s', (name, kind) => {
    expect(materialKind(name)).toBe(kind);
  });
});

describe('materialReducer', () => {
  it('reads accepted files and rejects unknown formats on the spot', () => {
    const state = add(initialMaterial, ['Lesson_06.pdf', 'photo.jpg']);
    expect(state.files.map((f) => [f.name, f.status])).toEqual([
      ['Lesson_06.pdf', 'reading'],
      ['photo.jpg', 'error'],
    ]);
    expect(state.files[1]!.topics).toEqual([]);
    expect(readyTopics(state)).toEqual([]);
  });

  it('marks a file ready once, and only then counts its topics', () => {
    const reading = add(initialMaterial, ['Lesson_06.pdf']);
    const ready = materialReducer(reading, { type: 'ready', id: 1 });
    expect(ready.files[0]!.status).toBe('ready');
    expect(ready.version).toBe(reading.version + 1);
    expect(readyTopics(ready)).toEqual(TOPIC_IDS.filter((t) => topicsForSlot(0).includes(t)));
    expect(materialReducer(ready, { type: 'ready', id: 1 })).toBe(ready);
  });

  it('is ready at once under reduced motion', () => {
    const state = add(initialMaterial, ['a.pdf', 'b.pptx'], true);
    expect(readyFiles(state)).toHaveLength(2);
    expect(state.version).toBe(1);
  });

  it('merges topics from several files without repeats', () => {
    const state = add(initialMaterial, ['a.pdf', 'b.pptx'], true);
    const topics = readyTopics(state);
    expect(new Set(topics).size).toBe(topics.length);
    expect(topics.length).toBeGreaterThan(topicsForSlot(0).length);
  });

  it(`keeps at most ${MAX_DEMO_FILES} files and reports the rest`, () => {
    const state = add(initialMaterial, ['1.pdf', '2.pdf', '3.pdf', '4.pdf', '5.pdf', '6.pdf', '7.pdf']);
    expect(state.files).toHaveLength(MAX_DEMO_FILES);
    expect(state.overflow).toBe(2);
    expect(add(state, ['8.pdf']).overflow).toBe(1);
  });

  it('removes and clears files, with unique ids across adds', () => {
    let state = add(initialMaterial, ['a.pdf', 'b.pdf'], true);
    state = materialReducer(state, { type: 'remove', id: 1 });
    expect(state.files.map((f) => f.name)).toEqual(['b.pdf']);
    state = add(state, ['c.pdf'], true);
    expect(state.files.map((f) => f.id)).toEqual([2, 3]);
    const cleared = materialReducer(state, { type: 'clear' });
    expect(cleared.files).toEqual([]);
    expect(cleared.nextId).toBe(4);
    expect(materialReducer(cleared, { type: 'clear' })).toBe(cleared);
  });

  it('never mutates its input', () => {
    const state = Object.freeze(add(initialMaterial, ['a.pdf']));
    expect(() => materialReducer(state, { type: 'ready', id: 1 })).not.toThrow();
    expect(state.files[0]!.status).toBe('reading');
  });
});

describe('formatSize', () => {
  it('uses MB or KB with the locale decimal separator', () => {
    expect(formatSize(2_400_000, 'en')).toBe('2.4 MB');
    expect(formatSize(2_400_000, 'es')).toBe('2,4 MB');
    expect(formatSize(312_000, 'en')).toBe('312 KB');
    expect(formatSize(12, 'en')).toBe('1 KB');
  });
});
