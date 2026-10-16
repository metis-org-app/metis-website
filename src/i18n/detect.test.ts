import { describe, expect, it, vi } from 'vitest';
import { detectLang, readStoredLang, STORAGE_KEY, storeLang } from './detect';

describe('detectLang', () => {
  it('prefers a stored choice', () => {
    expect(detectLang({ stored: 'en', languages: ['es-MX'] })).toBe('en');
  });

  it('uses the first supported browser language', () => {
    expect(detectLang({ stored: null, languages: ['fr-FR', 'es-MX', 'en-US'] })).toBe('es');
    expect(detectLang({ stored: null, languages: ['en-GB'] })).toBe('en');
  });

  it('falls back to Spanish', () => {
    expect(detectLang({ stored: null, languages: ['de-DE'] })).toBe('es');
    expect(detectLang({ stored: null, languages: [] })).toBe('es');
  });
});

describe('language storage', () => {
  it('reads only valid values', () => {
    expect(readStoredLang({ getItem: () => 'en' })).toBe('en');
    expect(readStoredLang({ getItem: () => 'fr' })).toBeNull();
    expect(readStoredLang({ getItem: () => null })).toBeNull();
  });

  it('survives a storage that throws', () => {
    const throwing = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readStoredLang(throwing)).toBeNull();
    expect(() => storeLang('en', throwing)).not.toThrow();
  });

  it('persists the choice', () => {
    const setItem = vi.fn<(key: string, value: string) => void>();
    storeLang('en', { setItem });
    expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, 'en');
  });
});
