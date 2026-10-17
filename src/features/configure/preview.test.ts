import { describe, expect, it } from 'vitest';
import { createInitialState } from '../guide/reducer';
import type { ConfigState } from '../guide/types';
import { activeTypes, moreCount, pad2, previewRows } from './preview';

const config = (over: Partial<ConfigState> = {}): ConfigState => ({
  ...createInitialState().config,
  ...over,
});

describe('previewRows', () => {
  it('shows at most eight rows and counts the rest', () => {
    expect(previewRows(config({ count: 4 }))).toHaveLength(4);
    expect(previewRows(config({ count: 12 }))).toHaveLength(8);
    expect(moreCount(config({ count: 12 }))).toBe(4);
    expect(moreCount(config({ count: 8 }))).toBe(0);
  });

  it('matches the prototype for the default configuration', () => {
    const rows = previewRows(config());
    expect(rows.map((r) => r.num)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
    expect(rows.map((r) => r.type)).toEqual(['mc', 'tf', 'short', 'mc', 'tf', 'short', 'mc', 'tf']);
    expect(rows.map((r) => r.topic)).toEqual([
      'demand',
      'complements',
      'surplus',
      'supply',
      'ceilings',
      'shifts',
      'equilibrium',
      'shortage',
    ]);
    expect(rows.map((r) => r.level)).toEqual([2, 2, 3, 1, 2, 3, 2, 1]);
    expect(rows.map((r) => r.page)).toEqual(['02', '07', '12', '03', '08', '13', '04', '09']);
  });

  it('rotates only through the active item types', () => {
    const rows = previewRows(config({ types: { mc: false, tf: false, short: false, match: true } }));
    expect(new Set(rows.map((r) => r.type))).toEqual(new Set(['match']));
  });

  it('clamps difficulty to 1..3', () => {
    expect(previewRows(config({ level: 'basic' })).every((r) => r.level >= 1)).toBe(true);
    expect(previewRows(config({ level: 'advanced' })).every((r) => r.level <= 3)).toBe(true);
    expect(previewRows(config({ level: 'advanced' }))[2]?.level).toBe(3);
    expect(previewRows(config({ level: 'basic' }))[3]?.level).toBe(1);
  });
});

describe('helpers', () => {
  it('pads numbers and lists active types in order', () => {
    expect(pad2(4)).toBe('04');
    expect(pad2(12)).toBe('12');
    expect(activeTypes({ mc: true, tf: false, short: true, match: true })).toEqual(['mc', 'short', 'match']);
  });
});
