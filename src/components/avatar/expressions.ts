/** The six Metis expressions. Each maps to the root class `mt-e-<expression>` of the avatar SVG. */
export const EXPRESSIONS = ['happy', 'listening', 'thinking', 'reviewing', 'guiding', 'celebrating'] as const;
export type Expression = (typeof EXPRESSIONS)[number];

export function expressionClass(expression: Expression): string {
  return `mt mt-e-${expression}`;
}
