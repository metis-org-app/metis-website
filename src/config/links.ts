/**
 * Outbound links, configured through `VITE_*` environment variables (see `.env.example`).
 * Only safe schemes are accepted, and a missing link is never rendered as a dead `#`.
 */

export interface LinkEnv {
  VITE_APP_URL?: string;
  VITE_LOGIN_URL?: string;
  VITE_CONTACT_URL?: string;
  VITE_PRIVACY_URL?: string;
  VITE_TERMS_URL?: string;
}

export interface SiteLinks {
  /** Always defined: falls back to the in-page configurator. */
  app: string;
  login: string | null;
  contact: string | null;
  privacy: string | null;
  terms: string | null;
}

export const APP_FALLBACK = '#configurar';

interface SanitizeOptions {
  allowMailto?: boolean;
  allowHttp?: boolean;
}

/** Returns a normalised URL when it uses an allowed scheme, otherwise `null`. */
export function sanitizeUrl(value: string | undefined, options: SanitizeOptions = {}): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const allowed =
    url.protocol === 'https:' ||
    (options.allowMailto === true && url.protocol === 'mailto:') ||
    (options.allowHttp === true && url.protocol === 'http:');
  return allowed ? url.href : null;
}

export function resolveLinks(env: LinkEnv, isDev = false): SiteLinks {
  const web = { allowHttp: isDev };
  return {
    app: sanitizeUrl(env.VITE_APP_URL, web) ?? APP_FALLBACK,
    login: sanitizeUrl(env.VITE_LOGIN_URL, web),
    contact: sanitizeUrl(env.VITE_CONTACT_URL, { ...web, allowMailto: true }),
    privacy: sanitizeUrl(env.VITE_PRIVACY_URL, web),
    terms: sanitizeUrl(env.VITE_TERMS_URL, web),
  };
}

export const links: SiteLinks = resolveLinks(import.meta.env, import.meta.env.DEV);

/** External links (other origins) get `rel="noopener"`; in-page anchors do not. */
export function isExternal(href: string): boolean {
  return /^(https?:|mailto:)/.test(href);
}
