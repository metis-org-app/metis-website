/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL?: string;
  readonly VITE_LOGIN_URL?: string;
  readonly VITE_CONTACT_URL?: string;
  readonly VITE_PRIVACY_URL?: string;
  readonly VITE_TERMS_URL?: string;
  /** Absolute site URL, always defined at build time (see vite.config.ts). */
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
