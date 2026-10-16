/**
 * Language-independent sample data for the interactive demos.
 * Numbers and ids come from the approved prototype (design/index-e/Indice.dc.html).
 */

export const ITEM_TYPES = ['mc', 'tf', 'short', 'match'] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export const LEVELS = ['basic', 'medium', 'advanced'] as const;
export type Level = (typeof LEVELS)[number];

export const TOPIC_IDS = [
  'demand',
  'supply',
  'equilibrium',
  'elasticity',
  'surplus',
  'shifts',
  'substitutes',
  'complements',
  'ceilings',
  'shortage',
] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

/** Configurator defaults and limits. */
export const CONFIG_LIMITS = { min: 4, max: 20, defaultCount: 8, visibleRows: 8 } as const;
/** Difficulty offsets applied per row around the chosen level (clamped to 1..3). */
export const LEVEL_OFFSETS = [0, 0, 1, -1, 0, 1, 0, -1] as const;

/** Price table shown in the guide's item card (Lesson 4, p. 06). */
export const PRICE_ROWS = [
  { price: 20, supplied: 10, demanded: 50 },
  { price: 30, supplied: 20, demanded: 40 },
  { price: 40, supplied: 30, demanded: 30 },
  { price: 50, supplied: 40, demanded: 20 },
] as const;
export type HighlightPrice = (typeof PRICE_ROWS)[number]['price'];

/** Results: KPIs, score histogram (students per score 0–10) and accuracy per item. */
export const KPI = { submissions: 26, enrolled: 28, accuracy: 74, hints: 11, revealed: 0 } as const;
export const HISTOGRAM_BINS = [0, 0, 1, 1, 2, 3, 4, 5, 5, 3, 2] as const;
/** Scores at or below this value are drawn with the accent colour. */
export const HISTOGRAM_LOW_MAX = 4;
export const ITEM_ACCURACY: ReadonlyArray<{ num: string; topic: TopicId; pct: number }> = [
  { num: '05', topic: 'surplus', pct: 46 },
  { num: '03', topic: 'equilibrium', pct: 62 },
  { num: '04', topic: 'elasticity', pct: 71 },
  { num: '06', topic: 'shifts', pct: 78 },
  { num: '02', topic: 'supply', pct: 88 },
  { num: '01', topic: 'demand', pct: 93 },
];

/** Section anchors (kept from the design). */
export const SECTION_IDS = {
  home: 'inicio',
  guide: 'guia',
  configure: 'configurar',
  results: 'resultados',
  spec: 'ficha',
} as const;
