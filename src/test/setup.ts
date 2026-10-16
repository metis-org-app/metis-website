import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { installBrowserMocks, resetBrowserMocks } from './mocks';

// Node-environment tests (e.g. scripts/*.test.ts) share this setup but have no DOM.
const hasDom = typeof window !== 'undefined';

if (hasDom) installBrowserMocks();

afterEach(() => {
  if (!hasDom) return;
  cleanup();
  resetBrowserMocks();
  try {
    window.localStorage.clear();
  } catch {
    // storage can be unavailable; nothing to reset
  }
});
