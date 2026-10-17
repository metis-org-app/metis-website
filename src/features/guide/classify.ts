import type { Kind } from './types';

export interface Classified {
  kind: Kind;
  /** A number the student mentioned (e.g. "30" in "Is it $30?"), as typed. */
  num: string | null;
}

/** Lower-case and strip accents so Spanish input matches without diacritics. */
const normalise = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const CHECK = /\b(is it|correct|right|am i|did i)\b|^\W*es\b|\bes (correcto|asi)\b|esta bien|acerte/;
const ANSWER =
  /answer|tell me|give me|just say|what is the|what's the|respuesta|\bdime\b|\bdame\b|cual es (el|la)\b/;
const START =
  /start|begin|how do|don.?t know|stuck|\blost\b|help|confus|empez|comienz|por donde|\bno se\b|perdid|ayuda|atascad|confund|no entiendo/;

/**
 * Infers what the student wants, in English or Spanish. Order matters (as in the design):
 * a number or a confirmation question → check; then answer; then where-to-start; otherwise other.
 */
export function classify(text: string): Classified {
  const x = normalise(text);
  const match = x.match(/\d+(?:[.,]\d+)?/);
  const num = match ? match[0] : null;
  if (num || CHECK.test(x)) return { kind: 'check', num };
  if (ANSWER.test(x)) return { kind: 'answer', num: null };
  if (START.test(x)) return { kind: 'start', num: null };
  return { kind: 'other', num: null };
}
