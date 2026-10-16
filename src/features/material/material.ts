import { TOPIC_IDS, type TopicId } from '../../content/demo-data';

/**
 * File-drop demo: which files were added and what "Metis found" in them. Nothing is uploaded or read;
 * only the name and size are used, and the topics come from the sample material.
 */

export const MATERIAL_EXTENSIONS = ['pdf', 'docx', 'pptx', 'txt', 'md'] as const;
export type MaterialKind = 'pdf' | 'docx' | 'pptx' | 'text';
/** A demo limit (not a product limit), to keep the list readable. */
export const MAX_DEMO_FILES = 5;
/** Simulated reading time per file, plus a stagger so several files finish one after another. */
export const READ_MS = 1400;
export const READ_STAGGER_MS = 450;

export interface MaterialFile {
  id: number;
  name: string;
  size: number;
  kind: MaterialKind | null;
  status: 'reading' | 'ready' | 'error';
  /** Position among accepted files; picks which sample topics this file "contains". */
  slot: number;
  topics: TopicId[];
}

export interface MaterialState {
  files: MaterialFile[];
  nextId: number;
  nextSlot: number;
  /** Files that did not fit under MAX_DEMO_FILES in the last add. */
  overflow: number;
  /** Changes whenever the set of ready topics changes, to replay the preview animation. */
  version: number;
}

export type MaterialAction =
  | { type: 'add'; files: ReadonlyArray<{ name: string; size: number }>; instant: boolean }
  | { type: 'ready'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clear' };

export const initialMaterial: MaterialState = { files: [], nextId: 1, nextSlot: 0, overflow: 0, version: 0 };

export function materialKind(name: string): MaterialKind | null {
  const ext = name.toLowerCase().split('.').pop() ?? '';
  if (ext === 'pdf' || ext === 'docx' || ext === 'pptx') return ext;
  if (ext === 'txt' || ext === 'md') return 'text';
  return null;
}

/** Sample topics for the n-th accepted file: five or six consecutive topics, shifted per file. */
export function topicsForSlot(slot: number): TopicId[] {
  const count = 5 + (slot % 2);
  return Array.from({ length: count }, (_, k) => TOPIC_IDS[(slot * 4 + k) % TOPIC_IDS.length]!);
}

export function materialReducer(state: MaterialState, action: MaterialAction): MaterialState {
  switch (action.type) {
    case 'add': {
      const room = Math.max(0, MAX_DEMO_FILES - state.files.length);
      const accepted = action.files.slice(0, room);
      let { nextId, nextSlot } = state;
      const added = accepted.map((file): MaterialFile => {
        const kind = materialKind(file.name);
        const slot = kind ? nextSlot++ : -1;
        return {
          id: nextId++,
          name: file.name,
          size: file.size,
          kind,
          status: kind ? (action.instant ? 'ready' : 'reading') : 'error',
          slot,
          topics: kind ? topicsForSlot(slot) : [],
        };
      });
      const anyReady = added.some((file) => file.status === 'ready');
      return {
        files: [...state.files, ...added],
        nextId,
        nextSlot,
        overflow: action.files.length - accepted.length,
        version: anyReady ? state.version + 1 : state.version,
      };
    }
    case 'ready': {
      const file = state.files.find((f) => f.id === action.id);
      if (!file || file.status !== 'reading') return state;
      return {
        ...state,
        files: state.files.map((f) => (f.id === action.id ? { ...f, status: 'ready' } : f)),
        version: state.version + 1,
      };
    }
    case 'remove': {
      const file = state.files.find((f) => f.id === action.id);
      if (!file) return state;
      return {
        ...state,
        files: state.files.filter((f) => f.id !== action.id),
        overflow: 0,
        version: file.status === 'ready' ? state.version + 1 : state.version,
      };
    }
    case 'clear':
      return state.files.length
        ? { ...initialMaterial, nextId: state.nextId, version: state.version + 1 }
        : state;
  }
}

/** Topics found in the ready files, in the order of the sample material, without repeats. */
export function readyTopics(state: MaterialState): TopicId[] {
  const found = new Set(state.files.filter((f) => f.status === 'ready').flatMap((f) => f.topics));
  return TOPIC_IDS.filter((topic) => found.has(topic));
}

export function readyFiles(state: MaterialState): MaterialFile[] {
  return state.files.filter((f) => f.status === 'ready');
}

/** "2.4 MB" / "2,4 MB" (decimal units, like most file managers). */
export function formatSize(bytes: number, locale: string): string {
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  if (bytes >= 1_000_000) return `${number.format(bytes / 1_000_000)} MB`;
  return `${number.format(Math.max(1, Math.round(bytes / 1000)))} KB`;
}
