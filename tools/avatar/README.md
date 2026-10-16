# Metis avatar generator

Turns the raster illustration into the animated, themable SVG used by `src/components/avatar/`.
It is **not** part of the site build: its output is committed, and it has its own `package.json`
and lockfile so its dependencies never enter the site's dependency tree.

```
source/avatar.png ──trace.cjs──▶ parts.json ──assemble.cjs──▶ out/ ──emit.mjs──▶ src/components/avatar/*.generated.*
                                                 raster.cjs ──▶ src/assets/metis-thumb.png, public/og-image.png, icons
```

| Step | Needs `npm ci` here? | What it does |
|---|---|---|
| `trace.cjs` | yes (pngjs, potrace) | Splits the PNG into colour layers (ink, gold, gold-dark, gray, paper) and animatable parts (owl, laurel leaves, sparkles, books, eyes, brows, mouth) and traces each one. Writes `parts.json`. Only re-run when the source art changes. |
| `assemble.cjs` | no | Builds the SVG fragment, the six expressions (happy, listening, thinking, reviewing, guiding, celebrating), accessories and the avatar CSS into `out/` (also `out/expressions.html` for a visual check). |
| `emit.mjs` | no | Rounds path coordinates to integers and converts the fragment into `MetisAvatarArt.generated.tsx` plus `metis-avatar.generated.css`. |
| `raster.cjs` | yes (pngjs) | Generates the grayscale thumbnail, the Open Graph image and the PNG icons. |

From the repo root: `npm run avatar:build` (assemble + emit). For tracing or rasters: `npm --prefix tools/avatar ci` first.

Security note: `potrace` depends on an old `jimp`, which pulls `phin` (5 **moderate** advisories, 0 high). It is a local, offline dev tool fed only with our own image, and it is isolated from the deployed site. Check with `npm --prefix tools/avatar audit`.
