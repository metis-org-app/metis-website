import { describe, expect, it } from 'vitest';
import { createInitialState, MAX_MESSAGES, reducer } from './reducer';
import type { Action, DemoState } from './types';

const run = (actions: Action[], state: DemoState = createInitialState()) => actions.reduce(reducer, state);

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

/** Sends a message and lets Metis finish replying. */
function turn(state: DemoState, text: string): DemoState {
  const sent = reducer(state, { type: 'chat/send', text });
  const replied = reducer(sent, { type: 'chat/reply' });
  return reducer(replied, { type: 'chat/writeDone', id: replied.chat.writingId ?? -1 });
}

describe('guide reducer', () => {
  it('starts with the design’s opening exchange', () => {
    const s = createInitialState();
    expect(s.chat.messages.map((m) => m.from)).toEqual(['student', 'metis']);
    expect(s.chat.used).toBe(1);
    expect(s.rules).toEqual({ enabled: true, maxHints: 3, mode: 'socratic', cite: true });
  });

  it('ignores empty messages and messages while Metis is busy', () => {
    const s = createInitialState();
    expect(reducer(s, { type: 'chat/send', text: '   ' })).toBe(s);
    const thinking = reducer(s, { type: 'chat/send', text: 'Is it $30?' });
    expect(thinking.chat.phase).toBe('thinking');
    expect(reducer(thinking, { type: 'chat/send', text: 'hello?' })).toBe(thinking);
  });

  it('answers a check with the next hint and highlights the price row', () => {
    const s = run([{ type: 'chat/send', text: 'Is it $30?' }, { type: 'chat/reply' }]);
    const last = s.chat.messages.at(-1)!;
    expect(last).toMatchObject({
      from: 'metis',
      body: { t: 'hint', kind: 'check', num: '30', hint: 2, max: 3 },
    });
    expect(s.chat.used).toBe(2);
    expect(s.chat.highlight).toBe(30);
    expect(s.chat.phase).toBe('writing');
    expect(s.chat.writingId).toBe(last.id);
  });

  it('stops giving hints at the limit without revealing the answer', () => {
    let s = run([{ type: 'rules/setMaxHints', value: 1 }]);
    s = turn(s, 'Just tell me');
    expect(s.chat.messages.at(-1)).toMatchObject({ from: 'metis', body: { t: 'limit', max: 1 } });
    expect(s.chat.used).toBe(1);
    // Raising the limit allows hints again.
    s = turn(reducer(s, { type: 'rules/setMaxHints', value: 3 }), 'Is it $50?');
    expect(s.chat.messages.at(-1)).toMatchObject({ body: { t: 'hint', hint: 2, max: 3 } });
  });

  it('records a notice only when a rule really changes', () => {
    const s = createInitialState();
    expect(reducer(s, { type: 'rules/setMode', mode: 'socratic' })).toBe(s);
    const changed = reducer(s, { type: 'rules/setMode', mode: 'example' });
    expect(changed.chat.messages.at(-1)).toMatchObject({
      from: 'system',
      notice: { t: 'mode', mode: 'example' },
    });
    expect(changed.rules.mode).toBe('example');
  });

  it('turning the guide off cancels a pending reply and the demo', () => {
    let s = run([{ type: 'chat/startDemo' }, { type: 'chat/demoNext' }]);
    expect(s.chat.phase).toBe('thinking');
    s = reducer(s, { type: 'rules/setEnabled', enabled: false });
    expect(s.chat).toMatchObject({ phase: 'idle', pending: null, demo: null });
    expect(reducer(s, { type: 'chat/reply' })).toBe(s);
    expect(reducer(s, { type: 'chat/send', text: 'Is it $30?' })).toBe(s);
  });

  it('shares the guide setting and max hints with the configurator preview', () => {
    const s = run([
      { type: 'rules/setEnabled', enabled: false },
      { type: 'rules/setMaxHints', value: 2 },
    ]);
    expect(s.config.regen).toBe(2);
  });

  it('resets the conversation', () => {
    const s = run([
      { type: 'chat/send', text: 'Is it $30?' },
      { type: 'chat/reply' },
      { type: 'chat/reset' },
    ]);
    expect(s.chat).toMatchObject({ messages: [], used: 0, phase: 'idle', highlight: null, writingId: null });
  });

  it('plays the demo script in order, one step per finished reply', () => {
    let s = run([{ type: 'chat/startDemo' }]);
    const sent: string[] = [];
    for (let step = 0; step < 4; step++) {
      s = reducer(s, { type: 'chat/demoNext' });
      if (s.chat.phase !== 'thinking') break;
      const student = s.chat.messages.at(-1)!;
      if (student.from === 'student' && 'preset' in student) sent.push(student.preset);
      s = reducer(s, { type: 'chat/reply' });
      // demoNext is ignored while Metis is writing
      expect(reducer(s, { type: 'chat/demoNext' })).toBe(s);
      s = reducer(s, { type: 'chat/writeDone', id: s.chat.writingId! });
    }
    expect(sent).toEqual(['answer', 'start', 'check40']);
    expect(s.chat.demo).toBeNull();
    expect(s.chat.highlight).toBe(40);
  });

  it('keeps at most MAX_MESSAGES with unique, increasing ids', () => {
    let s = createInitialState();
    for (let i = 0; i < 25; i++) s = turn(s, `question ${i}`);
    expect(s.chat.messages).toHaveLength(MAX_MESSAGES);
    const ids = s.chat.messages.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(ids.toSorted((a, b) => a - b));
  });

  it('treats writeDone as idempotent', () => {
    const s = run([{ type: 'chat/send', text: 'Is it $30?' }, { type: 'chat/reply' }]);
    const done = reducer(s, { type: 'chat/writeDone', id: s.chat.writingId! });
    expect(reducer(done, { type: 'chat/writeDone', id: s.chat.writingId! })).toBe(done);
  });

  it('keeps at least one item type selected', () => {
    let s = run([
      { type: 'config/toggleType', itemType: 'mc' },
      { type: 'config/toggleType', itemType: 'tf' },
    ]);
    expect(s.config.types).toMatchObject({ mc: false, tf: false, short: true });
    const before = s;
    s = reducer(s, { type: 'config/toggleType', itemType: 'short' });
    expect(s).toBe(before);
  });

  it('clamps the item count', () => {
    expect(run([{ type: 'config/setCount', count: 99 }]).config.count).toBe(20);
    expect(run([{ type: 'config/setCount', count: 1 }]).config.count).toBe(4);
  });

  it('ignores no-op configuration changes and records real ones', () => {
    const s = createInitialState();
    expect(reducer(s, { type: 'config/setLevel', level: 'medium' })).toBe(s);
    expect(reducer(s, { type: 'config/setCount', count: 8 })).toBe(s);
    const changed = reducer(s, { type: 'config/setLevel', level: 'advanced' });
    expect(changed.config).toMatchObject({ level: 'advanced', regen: 1 });
  });

  it('records citation changes and uses them in the next reply', () => {
    let s = reducer(createInitialState(), { type: 'rules/setCite', on: false });
    expect(reducer(s, { type: 'rules/setCite', on: false })).toBe(s);
    expect(s.chat.messages.at(-1)).toMatchObject({ from: 'system', notice: { t: 'cite', on: false } });
    s = turn(s, 'Is it $20?');
    expect(s.chat.messages.at(-1)).toMatchObject({ body: { t: 'hint', cite: false } });
    expect(s.chat.highlight).toBe(20);
  });

  it('sends preset prompts only when idle and enabled', () => {
    const s = createInitialState();
    const sent = reducer(s, { type: 'chat/sendPreset', preset: 'check40' });
    expect(sent.chat.pending).toEqual({ kind: 'check', num: '40' });
    expect(reducer(sent, { type: 'chat/sendPreset', preset: 'start' })).toBe(sent);
    const off = reducer(s, { type: 'rules/setEnabled', enabled: false });
    expect(reducer(off, { type: 'chat/sendPreset', preset: 'start' })).toBe(off);
    const on = reducer(off, { type: 'rules/setEnabled', enabled: true });
    expect(on.chat.messages.at(-1)).toMatchObject({ notice: { t: 'guide', on: true } });
  });

  it('keeps the previous highlight for prices outside the table', () => {
    let s = turn(createInitialState(), 'Is it $30?');
    s = turn(s, 'Is it $35?');
    expect(s.chat.highlight).toBe(30);
  });

  it('ignores reply and demo steps when nothing is pending', () => {
    const s = createInitialState();
    expect(reducer(s, { type: 'chat/reply' })).toBe(s);
    expect(reducer(s, { type: 'chat/demoNext' })).toBe(s);
  });

  it('is pure: same input, same output, no mutation', () => {
    const state = deepFreeze(createInitialState());
    const action: Action = { type: 'chat/send', text: 'Is it $30?' };
    expect(() => reducer(state, action)).not.toThrow();
    expect(reducer(state, action)).toEqual(reducer(state, action));
  });
});
