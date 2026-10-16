import {
  CONFIG_LIMITS,
  ITEM_TYPES,
  LEVEL_OFFSETS,
  LEVELS,
  TOPIC_IDS,
  type ItemType,
  type Level,
  type TopicId,
} from '../../content/demo-data';
import type { ConfigState } from '../guide/types';

export interface PreviewRow {
  num: string;
  type: ItemType;
  topic: TopicId;
  level: 1 | 2 | 3;
  page: string;
}

export const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export function activeTypes(types: Record<ItemType, boolean>): ItemType[] {
  return ITEM_TYPES.filter((type) => types[type]);
}

function levelIndex(level: Level): number {
  return LEVELS.indexOf(level) + 1;
}

/**
 * Rows of the configurator preview (same formulas as the approved prototype). `topics` narrows the
 * topics to the ones found in the dropped files; by default it is the whole sample material.
 */
export function previewRows(config: ConfigState, topics: readonly TopicId[] = TOPIC_IDS): PreviewRow[] {
  const pool = topics.length ? topics : TOPIC_IDS;
  const active = activeTypes(config.types);
  const base = levelIndex(config.level);
  const visible = Math.min(config.count, CONFIG_LIMITS.visibleRows);
  return Array.from({ length: visible }, (_, i) => {
    const level = Math.max(1, Math.min(3, base + LEVEL_OFFSETS[i % LEVEL_OFFSETS.length]!)) as 1 | 2 | 3;
    return {
      num: pad2(i + 1),
      type: active[i % active.length]!,
      topic: pool[(i * 7) % pool.length]!,
      level,
      page: pad2(2 + ((i * 5) % 14)),
    };
  });
}

/** Items beyond the visible preview rows. */
export function moreCount(config: ConfigState): number {
  return Math.max(0, config.count - CONFIG_LIMITS.visibleRows);
}
