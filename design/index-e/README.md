# Design reference — "E · Index (institutional & precise)"

This folder keeps the approved design for the Metis landing page so the implementation never depends on a temporary location.

| File | What it is |
|---|---|
| `Indice.dc.html` | The approved prototype (a Design Component). Markup, copy (English), interactions and animations; the logic lives in the `Component` class at the bottom (`renderVals()`). `@@MT_INNER@@` marks where the avatar SVG is inlined and `/*@@MT_CSS@@*/` where the avatar CSS goes. |
| `MetisAvatar.dc.html` | Spec board for the vector avatar: the six expressions and where each one is used. |
| `metis-avatar.reference.svg` | Standalone animated avatar. Open it in any browser to see the original motion. |
| `glossary.es.md` | English → Spanish terms and tone, taken from the Spanish version of the prototype. |

The prototype is **normative for layout, copy, interactions and motion**. It is not production code: the site re-implements it in React + Tailwind (`src/`).

## Intentional deviations in the implementation

1. Vermilion is the only accent; the prototype's palette switch is not shipped.
2. Small avatar thumbnails (24–46 px) use a generated 96 px grayscale PNG instead of the full raster.
3. Results KPIs and bars animate when the section enters the viewport, not on page load.
4. The "Watch demo" steps chain off each finished reply instead of fixed 5.2 s offsets, so no step is dropped.
5. "Log in" and the "ES / EN" switch live in the top strip, which stays visible on mobile.
6. Every button is at least 44 px tall (some were 36–40 px).
7. Turning the AI guide off cancels any pending reply and the demo.
8. The hero Metis card is a labelled group, not an `<aside>`.
9. The travelling square in the pipeline animates `transform` instead of `left`.
10. "See the hint log" links to the guide section.
11. Unused keyframes from the prototype (scan, corner, say) are dropped.
12. The brand is "Metis" (no "Campus").
