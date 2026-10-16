/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL?: string;
  readonly VITE_LOGIN_URL?: string;
  readonly VITE_CONTACT_URL?: string;
  readonly VITE_PRIVACY_URL?: string;
  readonly VITE_TERMS_URL?: string;
  /** Absolute site URL, always defined at build time (see vite.config.ts). */
  readonly VITE_SITE_URL: string;
  /** Year of the build (see vite.config.ts), so the prerendered page and the browser agree. */
  readonly VITE_BUILD_YEAR: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
