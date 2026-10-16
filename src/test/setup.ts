import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { installBrowserMocks, resetBrowserMocks } from './mocks';

// Node-environment tests (e.g. scripts/*.test.ts) share this setup but have no DOM.
const hasDom = typeof window !== 'undefined';

if (hasDom) installBrowserMocks();

// Testing Library drains its async work with a setTimeout(0) and only advances fake timers when it
// finds a `jest` global. Expose the equivalent Vitest call so user-event works with vi.useFakeTimers().
(globalThis as { jest?: { advanceTimersByTime: (ms: number) => void } }).jest = {
  advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms),
};

afterEach(() => {
  if (!hasDom) return;
  cleanup();
  resetBrowserMocks();
  // Language switches push /en/ into the history; start every test from the Spanish root again.
  window.history.replaceState(null, '', '/');
  document.cookie = 'nf_lang=; path=/; max-age=0';
  try {
    window.localStorage.clear();
  } catch {
    // storage can be unavailable; nothing to reset
  }
});
