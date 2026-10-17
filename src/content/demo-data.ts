/**
 * Language-independent sample data for the interactive demos.
 * Numbers come from the approved prototype (design/index-e/Index.dc.html).
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

/** Section anchors for in-page links (`#guide`, `#insights`…), the same in every language. */
export const SECTION_IDS = {
  home: 'home',
  guide: 'guide',
  configure: 'configure',
  results: 'results',
  insights: 'insights',
  spec: 'spec',
} as const;

/** Conversation insights: what students asked Metis during the assessment (Quiz 02, 45 minutes). */
export const INSIGHTS = { studentsAsked: 17, students: 26, questions: 64 } as const;
/** Questions to Metis per 5-minute block of the exam (sums to INSIGHTS.questions). */
export const QUESTION_TIMELINE = [3, 5, 6, 9, 17, 11, 7, 4, 2] as const;
export const TIMELINE_BLOCK_MINUTES = 5;
/** The item students were on when questions peaked. */
export const TIMELINE_PEAK_ITEM = '05';
/** Saved conversations shown in the review panel (their text lives in the messages). */
export const SESSION_IDS = ['s07', 's12', 's19', 's23'] as const;
export type SessionId = (typeof SESSION_IDS)[number];
export const SESSIONS: ReadonlyArray<{
  id: SessionId;
  student: string;
  item: string;
  topic: TopicId;
  minute: number;
}> = [
  { id: 's07', student: '07', item: '05', topic: 'surplus', minute: 21 },
  { id: 's12', student: '12', item: '03', topic: 'equilibrium', minute: 14 },
  { id: 's19', student: '19', item: '05', topic: 'surplus', minute: 23 },
  { id: 's23', student: '23', item: '01', topic: 'demand', minute: 4 },
];

/*
 * Advanced analyses of the conversations (insights carousel). Sample data, consistent with the rest of
 * the page: Quiz 02, 26 students, 64 questions to Metis, item 05 (consumer surplus) with 46% accuracy.
 */

/** Integrity: every Metis reply checked by a second model against the instructor's rules. */
export const AUDIT_CATEGORIES = ['cited', 'followed', 'offMode', 'revealed'] as const;
export type AuditCategory = (typeof AUDIT_CATEGORIES)[number];
export const AUDIT: Record<AuditCategory, number> = { cited: 52, followed: 9, offMode: 3, revealed: 0 };
export const INTEGRITY = { extractionAttempts: 14, resisted: 14, copiedAnswers: 2 } as const;

/** Semantic: questions linked to each item (rows) and page of Lesson 4 (columns). Sums to 64. */
export const HEATMAP_ITEMS = ['01', '02', '03', '04', '05', '06'] as const;
export const HEATMAP_PAGES = ['02', '04', '06', '08', '10', '12', '14'] as const;
export const MATERIAL_HEATMAP: ReadonlyArray<readonly number[]> = [
  [2, 2, 0, 0, 0, 0, 0],
  [0, 2, 1, 0, 0, 0, 0],
  [0, 1, 7, 4, 0, 0, 0],
  [0, 0, 0, 0, 6, 2, 0],
  [0, 0, 2, 17, 5, 1, 0],
  [0, 0, 0, 0, 1, 6, 5],
];
/** Largest groups of questions by meaning (their labels and example quotes live in the messages). */
export const MEANING_CLUSTERS = [
  { id: 'surplus', questions: 21 },
  { id: 'table', questions: 12 },
  { id: 'prompt', questions: 6 },
] as const;
export type MeaningClusterId = (typeof MEANING_CLUSTERS)[number]['id'];

/** Evidence: beliefs behind the wrong answers on item 05 (students), named ones first, largest first. */
export const ITEM05_INCORRECT = 14;
export const MISCONCEPTIONS = [
  { id: 'pricePaid', students: 6 },
  { id: 'wholeArea', students: 3 },
  { id: 'quantities', students: 2 },
  { id: 'unclear', students: 3 },
] as const;
export type MisconceptionId = (typeof MISCONCEPTIONS)[number]['id'];

/** Longitudinal: questions to Metis per student in each quiz of the course (median and middle 50%). */
export const RELIANCE: ReadonlyArray<{ quiz: string; median: number; p25: number; p75: number }> = [
  { quiz: '01', median: 3, p25: 1, p75: 5 },
  { quiz: '02', median: 2, p25: 0, p75: 4 },
  { quiz: '03', median: 1.5, p25: 0, p75: 3 },
  { quiz: '04', median: 1, p25: 0, p75: 2 },
];
export const CURRENT_QUIZ = '02';
export const LONGITUDINAL = {
  answerRequestsFrom: 31,
  answerRequestsTo: 12,
  transfer: 71,
  earlyWarning: 3,
} as const;
