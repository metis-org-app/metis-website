import { describe, expect, it } from 'vitest';
import { classify } from './classify';

describe('classify', () => {
  it.each([
    ['Just tell me the answer.', 'answer', null],
    ["What's the equilibrium price? Just give me the number.", 'answer', null],
    ["I don't know where to start.", 'start', null],
    ["I'm stuck, help", 'start', null],
    ['Is it $30?', 'check', '30'],
    ['is it right?', 'check', null],
    ['30.50', 'check', '30.50'],
    ['hello', 'other', null],
    ['Solo dime la respuesta.', 'answer', null],
    ['dame la respuesta', 'answer', null],
    ['¿Cuál es el precio de equilibrio?', 'answer', null],
    ['No sé por dónde empezar.', 'start', null],
    ['no entiendo nada', 'start', null],
    ['¿Es $40?', 'check', '40'],
    ['¿está bien?', 'check', null],
    ['30,5', 'check', '30,5'],
    ['gracias', 'other', null],
  ] as const)('%j → %s', (text, kind, num) => {
    expect(classify(text)).toEqual({ kind, num });
  });
});
