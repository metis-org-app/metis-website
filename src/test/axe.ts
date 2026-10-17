import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe-core on a rendered tree and fails with a readable list of violations.
 * Colour contrast is checked separately (jsdom does not compute styles); see tokens.test.ts.
 */
export async function expectNoAxeViolations(
  container: Element,
  rules: axe.RunOptions['rules'] = {},
): Promise<void> {
  const result = await axe.run(container, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
    },
    rules: { 'color-contrast': { enabled: false }, ...rules },
  });
  const violations = result.violations.map(
    (v) => `${v.id} (${v.nodes.length}): ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
  expect(violations).toEqual([]);
}
