# Metis website

Marketing site for **Metis**: AI-generated assessments from class material, shared through a link, with
results by item, student and topic, and Metis, an AI guide in the student link that gives hints and
never the answer.

It is a single page built from the approved design **"E · Index (institutional & precise)"**
(`design/index-e/`), in Spanish and English, with interactive demos of the guide chat, the
configurator, the results and the saved conversations.

## Requirements

- Node 24 (see `.nvmrc`; `engines` asks for `>=24.15`). Vitest 5 and jsdom 30 need it.
- npm (the lockfile is committed; use `npm ci`).

```bash
npm ci
npm run dev
```

## Scripts

| Script                  | What it does                                                                     |
| ----------------------- | -------------------------------------------------------------------------------- |
| `npm run dev`           | Vite dev server.                                                                 |
| `npm run build`         | Type-checks (`tsc -b`) and builds to `dist/`.                                    |
| `npm run preview`       | Serves `dist/` with the same security headers as production (CSP included).      |
| `npm run typecheck`     | TypeScript 7 (`tsc -b` over `tsconfig.app.json` and `tsconfig.node.json`).       |
| `npm run lint`          | oxlint (React, hooks, jsx-a11y, Vitest rules); warnings fail.                    |
| `npm run format`        | Prettier write (`format:check` only checks).                                     |
| `npm test`              | Vitest + Testing Library + axe-core (unit and integration, ES and EN).           |
| `npm run test:coverage` | Coverage for the pure logic (`features/`, `i18n/`, `config/`, `hooks/`).         |
| `npm run size`          | Bundle budgets after a build: JS ≤ 135 KB gz, avatar ≤ 34 KB gz, CSS ≤ 20 KB gz. |
| `npm run audit`         | `npm audit --audit-level=high`: fails on high or critical vulnerabilities.       |
| `npm run avatar:build`  | Regenerates the avatar component from `tools/avatar/` (see below).               |
| **`npm run verify`**    | Everything CI runs: format check → lint → tests → build → size → audit.          |

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run verify` on every pull request and on pushes to
`main`.

## Environment variables

Copy `.env.example` to `.env.local`. Every variable is optional; links are validated (only `https:`,
plus `mailto:` for contact) and a missing or invalid one never becomes a dead `#` link.

| Variable           | Used for                              | When missing or invalid                       |
| ------------------ | ------------------------------------- | --------------------------------------------- |
| `VITE_APP_URL`     | "Create assessment" buttons           | Points to the in-page configurator            |
| `VITE_LOGIN_URL`   | "Log in" in the header                | Not rendered                                  |
| `VITE_CONTACT_URL` | "Talk to our team" and footer contact | Not rendered                                  |
| `VITE_PRIVACY_URL` | Footer                                | Not rendered                                  |
| `VITE_TERMS_URL`   | Footer                                | Not rendered                                  |
| `VITE_SITE_URL`    | Canonical and Open Graph URLs         | Netlify's `URL`, then `http://localhost:5173` |

On Netlify, set them under Site configuration → Environment variables.

## Structure

```
design/index-e/        approved prototype, avatar board, Spanish glossary, deviations (README.md)
tools/avatar/          offline generator for the vector avatar (own package.json; not in the site build)
scripts/               bundle budget check and the headers test
src/
  App.tsx              page composition (sections in order)
  config/links.ts      env links, validated
  content/demo-data.ts language-independent sample numbers and ids
  i18n/                language detection, provider, messages/en.ts and messages/es.ts
  features/guide/      pure chat + rules reducer, intent classifier, copy, selectors, timers
  features/configure/  configurator preview rows
  hooks/               reduced motion, in-view, interval, count-up, typewriter, hover/focus
  components/avatar/   <MetisAvatar expression label?> and the generated artwork
  components/ui|layout header, footer, skip link, buttons, toggles, switch
  sections/            hero, guide, configure, results, insights, spec, cta
  test/                setup (browser mocks), axe helper, render with providers
```

Sections in page order, with their anchors (English in both languages): `#home` (hero), `#guide` (AI
guide chat), `#configure`, `#results`, `#insights` (saved conversations), `#spec` (spec sheet), then the
call to action.

## Text and languages

- English is the base: `src/i18n/messages/en.ts` defines the `Messages` type, and `es.ts` is typed with
  it, so a missing or extra key fails the build. `messages.test.ts` also checks both files have the same
  shape and that no text is empty or contains HTML.
- Leaves are plain strings or small functions for interpolation. Never HTML: emphasis and line breaks
  are composed in JSX.
- Spanish uses informal "tú" and the terms in `design/index-e/glossary.es.md`.
- Language detection: stored choice (`localStorage["metis-lang"]`) → `navigator.languages` → Spanish.
  The provider keeps `<html lang>`, the title and the description in sync.

## Metis avatar

`MetisAvatar` renders the vector Metis with one of six expressions (`happy`, `listening`, `thinking`,
`reviewing`, `guiding`, `celebrating`); switching expression only changes a class on the root `<svg>`.
Its colours follow the site accent, and every instance pauses its animations while off-screen.
Small thumbnails use a 96 px PNG (`MetisThumb`) instead of the SVG.

The artwork is generated, not hand-edited: see `tools/avatar/README.md`. After changing the generator,
run `npm run avatar:build` and commit the regenerated `*.generated.*` files.

## Motion and accessibility

- All CSS animation is `motion-safe:`; with reduced motion the hero carousel stays still, the chat
  types instantly and the numbers show their final values.
- The hero carousel pauses on hover or focus, off-screen, and with its pause button. Other decorative
  motion runs a few times and stops; only loading indicators (typing, "thinking") loop.
- No text is smaller than 12 px; SVG chart labels are resized with `useSvgTextSize` to stay that size.
- The header is sticky; `html { scroll-padding-top }` keeps anchors and focused elements below it.
- Live regions announce each Metis reply once; animated numbers expose their final value to screen
  readers; the chat is `inert` while the guide is off; touch targets are at least 44 px.
- `App.a11y.test.tsx` runs axe-core over the whole page in both languages and checks landmarks, heading
  order and that every in-page link resolves.

## Deploy

Netlify builds with `npm run build` and publishes `dist/` (`netlify.toml`, Node 24).

- Security headers (strict CSP with `'self'` only, `nosniff`, referrer and permissions policies,
  `frame-ancestors 'none'`, COOP) live in `netlify.toml` and are mirrored in `vite.config.ts` for
  `npm run preview`; `scripts/headers.test.ts` fails if the two drift apart.
- Fonts are self-hosted (Fontsource), so no third-party origins are needed.
- `/assets/*` is served with an immutable cache. There is no SPA catch-all redirect, so unknown paths
  return a real 404.
