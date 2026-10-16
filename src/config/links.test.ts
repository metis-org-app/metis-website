import { describe, expect, it } from 'vitest';
import { APP_FALLBACK, isExternal, resolveLinks, sanitizeUrl } from './links';

describe('sanitizeUrl', () => {
  it.each([undefined, '', '   ', 'not a url', 'javascript:alert(1)', 'data:text/html,hi', 'ftp://x.test'])(
    'rejects %j',
    (value) => {
      expect(sanitizeUrl(value)).toBeNull();
    },
  );

  it('accepts https and normalises it', () => {
    expect(sanitizeUrl(' https://app.metis.test/signup ')).toBe('https://app.metis.test/signup');
  });

  it('accepts mailto only when allowed', () => {
    expect(sanitizeUrl('mailto:hello@metis.test')).toBeNull();
    expect(sanitizeUrl('mailto:hello@metis.test', { allowMailto: true })).toBe('mailto:hello@metis.test');
  });

  it('accepts http only when allowed (development)', () => {
    expect(sanitizeUrl('http://localhost:3000')).toBeNull();
    expect(sanitizeUrl('http://localhost:3000', { allowHttp: true })).toBe('http://localhost:3000/');
  });
});

describe('resolveLinks', () => {
  it('falls back to the in-page configurator and hides the rest when unset', () => {
    expect(resolveLinks({})).toEqual({
      app: APP_FALLBACK,
      login: null,
      contact: null,
      privacy: null,
      terms: null,
    });
  });

  it('uses valid values and drops invalid ones', () => {
    const links = resolveLinks({
      VITE_APP_URL: 'https://app.metis.test',
      VITE_LOGIN_URL: 'javascript:void(0)',
      VITE_CONTACT_URL: 'mailto:team@metis.test',
      VITE_PRIVACY_URL: 'https://metis.test/privacy',
      VITE_TERMS_URL: '#',
    });
    expect(links).toEqual({
      app: 'https://app.metis.test/',
      login: null,
      contact: 'mailto:team@metis.test',
      privacy: 'https://metis.test/privacy',
      terms: null,
    });
  });

  it('never produces a bare "#" link', () => {
    const links = resolveLinks({ VITE_APP_URL: '#' });
    expect(Object.values(links)).not.toContain('#');
  });
});

describe('isExternal', () => {
  it('distinguishes external URLs from in-page anchors', () => {
    expect(isExternal('https://x.test')).toBe(true);
    expect(isExternal('mailto:a@b.test')).toBe(true);
    expect(isExternal('#configurar')).toBe(false);
  });
});
