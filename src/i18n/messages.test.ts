import { describe, expect, it } from 'vitest';
import { en } from './messages/en';
import { es } from './messages/es';

type Leaf = { path: string; value: unknown };

function leaves(value: unknown, path = ''): Leaf[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  return [{ path, value }];
}

/** Calls interpolation functions with representative arguments. */
function text(value: unknown): unknown {
  return typeof value === 'function'
    ? (value as (...args: unknown[]) => unknown)('$30', 3, 'medium', true)
    : value;
}

const enLeaves = leaves(en);
const esLeaves = leaves(es);

describe('messages', () => {
  it('Spanish and English have exactly the same shape', () => {
    expect(esLeaves.map((l) => l.path)).toEqual(enLeaves.map((l) => l.path));
    const typeMismatches = enLeaves
      .filter((leaf, i) => typeof esLeaves[i]?.value !== typeof leaf.value)
      .map((leaf) => leaf.path);
    expect(typeMismatches).toEqual([]);
  });

  it.each([
    ['en', enLeaves],
    ['es', esLeaves],
  ] as const)('%s: every message is a non-empty string without HTML', (_lang, list) => {
    const problems = list
      .filter(({ value }) => {
        const t = text(value);
        return typeof t !== 'string' || t.trim().length === 0 || /<[a-z/]/i.test(t);
      })
      .map((leaf) => leaf.path);
    expect(problems).toEqual([]);
  });

  it('never names the old brand', () => {
    const offenders = [...enLeaves, ...esLeaves]
      .filter(({ value }) => /Metis Campus/i.test(String(text(value))))
      .map((leaf) => leaf.path);
    expect(offenders).toEqual([]);
  });
});
