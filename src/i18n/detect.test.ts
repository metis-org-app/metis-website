import { describe, expect, it } from 'vitest';
import { LANG_COOKIE, langFromPath, pathForLang, storeLangChoice } from './detect';

describe('langFromPath', () => {
  it.each([
    ['/', 'es'],
    ['/en', 'en'],
    ['/en/', 'en'],
    ['/en/anything', 'en'],
    ['/english', 'es'],
    ['/es/', 'es'],
  ])('%s → %s', (path, lang) => {
    expect(langFromPath(path)).toBe(lang);
  });

  it('round-trips with pathForLang', () => {
    expect(langFromPath(pathForLang('en'))).toBe('en');
    expect(langFromPath(pathForLang('es'))).toBe('es');
  });
});

describe('storeLangChoice', () => {
  it('writes the cookie Netlify reads for the language redirect', () => {
    const doc = { cookie: '' };
    storeLangChoice('en', doc);
    expect(doc.cookie).toMatch(new RegExp(`^${LANG_COOKIE}=en; path=/; max-age=\\d+; samesite=lax`));
  });

  it('survives a blocked cookie jar', () => {
    const blocked = {
      get cookie() {
        return '';
      },
      set cookie(_value: string) {
        throw new Error('blocked');
      },
    };
    expect(() => storeLangChoice('es', blocked)).not.toThrow();
  });
});
