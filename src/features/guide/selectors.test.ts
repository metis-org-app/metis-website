import { describe, expect, it } from 'vitest';
import { en } from '../../i18n/messages/en';
import { es } from '../../i18n/messages/es';
import { createInitialState, reducer } from './reducer';
import { hintSquares, presence, presenceExpression, ruleSummary } from './selectors';

describe('presence', () => {
  it('follows the conversation', () => {
    let s = createInitialState();
    expect(presence(s)).toBe('listening');
    s = reducer(s, { type: 'chat/send', text: 'Is it $30?' });
    expect(presence(s)).toBe('thinking');
    expect(presenceExpression(s)).toBe('thinking');
    s = reducer(s, { type: 'chat/reply' });
    expect(presence(s)).toBe('guiding');
    s = reducer(s, { type: 'chat/writeDone', id: s.chat.writingId! });
    expect(presence(s)).toBe('listening');
  });

  it('shows Metis reviewing after the hint limit, and happy when the guide is off', () => {
    let s = reducer(createInitialState(), { type: 'rules/setMaxHints', value: 1 });
    s = reducer(s, { type: 'chat/send', text: 'tell me' });
    s = reducer(s, { type: 'chat/reply' });
    s = reducer(s, { type: 'chat/writeDone', id: s.chat.writingId! });
    expect(presence(s)).toBe('reviewing');
    s = reducer(s, { type: 'rules/setEnabled', enabled: false });
    expect(presence(s)).toBe('off');
    expect(presenceExpression(s)).toBe('happy');
  });
});

describe('hintSquares', () => {
  it('lights one square per used hint, capped at the limit', () => {
    const s = createInitialState();
    expect(hintSquares(s)).toEqual([true, false, false]);
    expect(hintSquares(reducer(s, { type: 'rules/setMaxHints', value: 1 }))).toEqual([true]);
  });
});

describe('ruleSummary', () => {
  it('summarises the active rules', () => {
    const rules = createInitialState().rules;
    expect(ruleSummary(rules, en)).toBe('Socratic · max 3 hints · cites source');
    expect(ruleSummary({ ...rules, mode: 'hints', cite: false, maxHints: 1 }, es)).toBe(
      'Pistas directas · máx. 1 pistas · sin citas',
    );
  });
});
