import { describe, expect, it } from 'vitest';
import { en } from '../../i18n/messages/en';
import { es } from '../../i18n/messages/es';
import { noticeText, replyText, studentText, tagText } from './copy';
import { HELP_MODES, type Kind, type MetisBody } from './types';

const KINDS: Kind[] = ['answer', 'start', 'check', 'other'];
const hint = (over: Partial<Extract<MetisBody, { t: 'hint' }>> = {}): MetisBody => ({
  t: 'hint',
  kind: 'answer',
  mode: 'socratic',
  num: null,
  cite: false,
  hint: 2,
  max: 3,
  ...over,
});

describe('replyText', () => {
  it.each([
    ['en', en],
    ['es', es],
  ] as const)('%s: every kind × mode has a reply that never reveals the answer ($40)', (_lang, m) => {
    for (const kind of KINDS)
      for (const mode of HELP_MODES) {
        const text = replyText(hint({ kind, mode }), m);
        expect(text.length).toBeGreaterThan(20);
        expect(text).not.toContain('40');
      }
  });

  it('echoes the price the student asked about, or a neutral reference', () => {
    expect(replyText(hint({ kind: 'check', num: '30' }), en)).toContain('$30');
    expect(replyText(hint({ kind: 'check', num: null }), en)).toContain('that price');
    expect(replyText(hint({ kind: 'check', num: '30' }), es)).toContain('$30');
  });

  it('adds the source only when citing', () => {
    expect(replyText(hint({ cite: true }), en)).toMatch(/Source: Lesson 4, p\. 06\.$/);
    expect(replyText(hint({ cite: false }), en)).not.toContain('Source');
    expect(replyText(hint({ cite: true }), es)).toMatch(/Fuente: Lección 4, p\. 06\.$/);
  });

  it('explains the hint limit', () => {
    expect(replyText({ t: 'limit', max: 2 }, en)).toContain('2 hints');
    expect(replyText({ t: 'limit', max: 2 }, es)).toContain('2 pistas');
  });
});

describe('tagText', () => {
  it('describes the rule that produced each reply', () => {
    expect(tagText(hint({ cite: true }), en)).toBe('SOCRATIC · HINT 2/3 · SOURCE P. 06 · ANSWER WITHHELD');
    expect(tagText(hint({ mode: 'hints', cite: false, hint: 1, max: 1 }), en)).toBe(
      'DIRECT HINT · HINT 1/1 · ANSWER WITHHELD',
    );
    expect(tagText(hint({ mode: 'example', cite: true }), es)).toBe(
      'EJEMPLO RESUELTO · PISTA 2/3 · FUENTE P. 06 · RESPUESTA RESERVADA',
    );
    expect(tagText({ t: 'limit', max: 3 }, en)).toBe('LIMIT REACHED · ANSWER WITHHELD');
  });
});

describe('noticeText and studentText', () => {
  it('renders rule-change notices', () => {
    expect(noticeText({ t: 'mode', mode: 'hints' }, en)).toBe('Rule updated: Direct hints');
    expect(noticeText({ t: 'maxHints', value: 1 }, en)).toBe('Rule updated: max hints 1');
    expect(noticeText({ t: 'cite', on: false }, es)).toBe('Regla actualizada: citar material no');
    expect(noticeText({ t: 'guide', on: false }, en)).toBe('AI guide turned off');
  });

  it('renders preset prompts in the active language and free text as typed', () => {
    expect(studentText({ id: 1, from: 'student', preset: 'check40' }, es)).toBe('¿Es $40?');
    expect(studentText({ id: 1, from: 'student', text: 'Is it $30?' }, es)).toBe('Is it $30?');
  });
});
