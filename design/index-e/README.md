# Design reference — "E · Index (institutional & precise)"

This folder keeps the approved design for the Metis landing page so the implementation never depends on a temporary location.

| File | What it is |
|---|---|
| `Index.dc.html` | The approved prototype (a Design Component). Markup, copy (English), interactions and animations; the logic lives in the `Component` class at the bottom (`renderVals()`). `@@MT_INNER@@` marks where the avatar SVG is inlined and `/*@@MT_CSS@@*/` where the avatar CSS goes. |
| `MetisAvatar.dc.html` | Spec board for the vector avatar: the six expressions and where each one is used. |
| `metis-avatar.reference.svg` | Standalone animated avatar. Open it in any browser to see the original motion. |
| `glossary.es.md` | English → Spanish terms and tone, taken from the Spanish version of the prototype. |

The prototype is **normative for layout, copy, interactions and motion**. It is not production code: the site re-implements it in React + Tailwind (`src/`).

## Intentional deviations in the implementation

1. Vermilion is the only accent; the prototype's palette switch is not shipped.
2. Small avatar thumbnails (24–46 px) use a generated 96 px grayscale PNG instead of the full raster.
3. Results KPIs and bars animate when the section enters the viewport, not on page load.
4. The "Watch demo" steps chain off each finished reply instead of fixed 5.2 s offsets, so no step is dropped.
5. The header is a single sticky row. Below 1280 px the navigation, "Log in" and the "ES / EN" switch move into a menu button, so the CTA stays in reach while scrolling.
6. Every button is at least 44 px tall (some were 36–40 px).
7. Turning the AI guide off cancels any pending reply and the demo.
8. The hero Metis card is a labelled group, not an `<aside>`.
9. The travelling square in the pipeline animates `transform` instead of `left`.
10. The results summary links to the new conversation-insights section ("See the conversations"), which is not in the prototype.
11. Unused keyframes from the prototype (scan, corner, say) are dropped.
12. The brand is "Metis" (no "Campus").
13. The hero card cycles through Metis's six expressions on its own, with a pause button and progress segments, instead of expression buttons.
14. A "Conversation insights" section follows Results: saved student chats, a Metis trend note and the advanced-analyses carousel (see 26).
15. The scrolling ticker band under the hero is removed: it repeated the Results figures and added constant motion next to the hero carousel.
16. Section anchors are in English (`#guide`, `#configure`, `#results`, `#insights`, `#spec`) instead of the prototype's Spanish ids (`#guia`, `#configurar`…), for both languages.
17. The header tagline ("AI assessments · for instructors and students") is removed.
18. The numbered section labels ("01 — Platform" through "07 — Get started") are removed; each section opens with its heading.
19. Below 960 px the guide chat comes before the instructor rules (the reading order keeps the rules first).
20. No text is smaller than 12 px; chart labels are resized so they stay 12 px on narrow screens.
21. Decorative motion runs a few times and stops (pipeline, status dots, "ready" cursor, rule arrow); only loading indicators loop. The Metis avatars in Results and Insights are still drawings.
22. Results and Insights carry a "Sample data" note.
23. In charts the accent marks only what needs attention (low scores, the flagged item, the question peak), with a legend on the histogram; the "0 answers revealed" figure and the top intent bar are ink.
24. The hero text is readable from the first frame: it only slides into place (no fade or blur), so the headline and the buttons do not wait for an animation.
25. Canvas LMS is not mentioned: the hero label above the headline is gone, and the spec sheet's "Integration" row became "Export" (PDF and Word).
26. The insights section ends with a carousel of four advanced analyses, each with what Metis calculates and a chart chosen with UI/UX Pro Max: an audit waffle (integrity), a material heat map (semantic), ranked misconception bars with quotes (evidence) and a reliance trend with a middle-50% band (longitudinal). It rotates every 9 s on wide screens only, pauses on hover, focus or the pause button, and each chart has a "See the data" table.
