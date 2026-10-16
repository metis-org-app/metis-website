import type { HighlightPrice, ItemType, Level } from '../../content/demo-data';

export const HELP_MODES = ['socratic', 'hints', 'example'] as const;
export type HelpMode = (typeof HELP_MODES)[number];

/** What the student is asking for, inferred from free text or a preset prompt. */
export type Kind = 'answer' | 'start' | 'check' | 'other';

/** Preset student prompts (language independent; rendered from the active messages). */
export type Preset = 'initial' | 'answer' | 'start' | 'check40';

export type MaxHints = 1 | 2 | 3;

export type Notice =
  | { t: 'mode'; mode: HelpMode }
  | { t: 'maxHints'; value: MaxHints }
  | { t: 'cite'; on: boolean }
  | { t: 'guide'; on: boolean };

export type MetisBody =
  | { t: 'hint'; kind: Kind; mode: HelpMode; num: string | null; cite: boolean; hint: number; max: number }
  | { t: 'limit'; max: number };

export type ChatMessage =
  | { id: number; from: 'student'; preset: Preset }
  | { id: number; from: 'student'; text: string }
  | { id: number; from: 'metis'; body: MetisBody }
  | { id: number; from: 'system'; notice: Notice };

export type Phase = 'idle' | 'thinking' | 'writing';

export interface ConfigState {
  count: number;
  types: Record<ItemType, boolean>;
  level: Level;
  /** Bumped on every configuration change; replays the preview's sweep and stagger. */
  regen: number;
}

export interface RulesState {
  enabled: boolean;
  maxHints: MaxHints;
  mode: HelpMode;
  cite: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  used: number;
  phase: Phase;
  pending: { kind: Kind; num: string | null } | null;
  writingId: number | null;
  highlight: HighlightPrice | null;
  demo: { queue: Preset[] } | null;
  nextId: number;
}

export interface DemoState {
  config: ConfigState;
  rules: RulesState;
  chat: ChatState;
}

export type Action =
  | { type: 'config/setCount'; count: number }
  | { type: 'config/toggleType'; itemType: ItemType }
  | { type: 'config/setLevel'; level: Level }
  | { type: 'rules/setEnabled'; enabled: boolean }
  | { type: 'rules/setMaxHints'; value: MaxHints }
  | { type: 'rules/setMode'; mode: HelpMode }
  | { type: 'rules/setCite'; on: boolean }
  | { type: 'chat/send'; text: string }
  | { type: 'chat/sendPreset'; preset: Exclude<Preset, 'initial'> }
  | { type: 'chat/reply' }
  | { type: 'chat/writeDone'; id: number }
  | { type: 'chat/reset' }
  | { type: 'chat/startDemo' }
  | { type: 'chat/demoNext' };
