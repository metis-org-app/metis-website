/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Security headers. Keep in sync with `netlify.toml` (a unit test checks the CSP matches).
 * `vite preview` serves them too, so the production CSP can be exercised locally.
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

export const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // Netlify exposes the deploy URL as `URL` at build time.
  const siteUrl = (env.VITE_SITE_URL || process.env.URL || 'http://localhost:5173').replace(/\/+$/, '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
      'import.meta.env.VITE_BUILD_YEAR': JSON.stringify(new Date().getFullYear()),
    },
    // The SSR build (`src/entry-server.tsx`, used by scripts/prerender.mjs) runs in Node only: one file.
    build: isSsrBuild
      ? {}
      : {
          rolldownOptions: {
            output: {
              codeSplitting: {
                groups: [
                  { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
                  { name: 'avatar', test: /src[\\/]components[\\/]avatar[\\/]MetisAvatarArt/ },
                ],
              },
            },
          },
        },
    preview: {
      headers: SECURITY_HEADERS,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        include: ['src/features/**', 'src/i18n/**', 'src/config/**', 'src/hooks/**'],
      },
    },
  };
});
