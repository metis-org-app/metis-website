// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_SECURITY_POLICY, SECURITY_HEADERS } from '../vite.config';

const netlify = readFileSync(resolve(import.meta.dirname, '../netlify.toml'), 'utf8');

describe('security headers', () => {
  it('netlify.toml serves the same headers as `vite preview`', () => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(netlify).toContain(`${name} = "${value}"`);
    }
  });

  it('keeps a strict, self-only CSP', () => {
    expect(CONTENT_SECURITY_POLICY).toContain("script-src 'self'");
    expect(CONTENT_SECURITY_POLICY).not.toMatch(/unsafe-(inline|eval)/);
    expect(CONTENT_SECURITY_POLICY).toContain("frame-ancestors 'none'");
  });

  it('does not reintroduce the SPA catch-all redirect', () => {
    expect(netlify).not.toMatch(/from = "\/\*"/);
    expect(netlify).not.toMatch(/to = "\/index\.html"/);
  });

  it('sends English browsers from / to the prerendered /en/ page, temporarily', () => {
    expect(netlify).toMatch(
      /\[\[redirects\]\]\s+from = "\/"\s+to = "\/en\/"\s+status = 302\s+force = true\s+conditions = \{Language = \["en"\]\}/,
    );
  });

  it('caches hashed assets immutably', () => {
    expect(netlify).toMatch(/for = "\/assets\/\*"[\s\S]*immutable/);
  });
});
