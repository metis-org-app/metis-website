import { CONFIG_LIMITS, ITEM_TYPES, PRICE_ROWS, type HighlightPrice } from '../../content/demo-data';
import { classify, type Classified } from './classify';
import type { Action, ChatMessage, ChatState, DemoState, Notice, Preset } from './types';

/** Older messages are dropped beyond this many. */
export const MAX_MESSAGES = 30;

const DEMO_SCRIPT: Exclude<Preset, 'initial'>[] = ['answer', 'start', 'check40'];

const PRESET_INTENT: Record<Exclude<Preset, 'initial'>, Classified> = {
  answer: { kind: 'answer', num: null },
  start: { kind: 'start', num: null },
  check40: { kind: 'check', num: '40' },
};

const HIGHLIGHTS = new Set<number>(PRICE_ROWS.map((row) => row.price));

export function createInitialState(): DemoState {
  return {
    config: {
      count: CONFIG_LIMITS.defaultCount,
      types: { mc: true, tf: true, short: true, match: false },
      level: 'medium',
      regen: 0,
    },
    rules: { enabled: true, maxHints: 3, mode: 'socratic', cite: true },
    chat: {
      messages: [
        { id: 1, from: 'student', preset: 'initial' },
        {
          id: 2,
          from: 'metis',
          body: { t: 'hint', kind: 'answer', mode: 'socratic', num: null, cite: true, hint: 1, max: 3 },
        },
      ],
      used: 1,
      phase: 'idle',
      pending: null,
      writingId: null,
      highlight: null,
      demo: null,
      nextId: 3,
    },
  };
}

type NewMessage =
  | { from: 'student'; preset: Preset }
  | { from: 'student'; text: string }
  | { from: 'metis'; body: Extract<ChatMessage, { from: 'metis' }>['body'] }
  | { from: 'system'; notice: Notice };

function append(chat: ChatState, message: NewMessage): ChatState {
  const withId = { ...message, id: chat.nextId } as ChatMessage;
  return {
    ...chat,
    messages: [...chat.messages, withId].slice(-MAX_MESSAGES),
    nextId: chat.nextId + 1,
  };
}

function withNotice(state: DemoState, notice: Notice): DemoState {
  return { ...state, chat: append(state.chat, { from: 'system', notice }) };
}

function bumpConfig(state: DemoState): DemoState['config'] {
  return { ...state.config, regen: state.config.regen + 1 };
}

function canSend(state: DemoState): boolean {
  return state.rules.enabled && state.chat.phase === 'idle';
}

function startTurn(state: DemoState, message: NewMessage, intent: Classified): DemoState {
  const chat = append(state.chat, message);
  return { ...state, chat: { ...chat, phase: 'thinking', pending: intent } };
}

function toHighlight(num: string | null): HighlightPrice | null {
  if (!num) return null;
  const value = Number(num.replace(',', '.'));
  return HIGHLIGHTS.has(value) ? (value as HighlightPrice) : null;
}

function emptyChat(chat: ChatState): ChatState {
  return {
    ...chat,
    messages: [],
    used: 0,
    phase: 'idle',
    pending: null,
    writingId: null,
    highlight: null,
    demo: null,
  };
}

export function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'config/setCount': {
      const count = Math.max(CONFIG_LIMITS.min, Math.min(CONFIG_LIMITS.max, Math.round(action.count)));
      if (count === state.config.count) return state;
      return { ...state, config: { ...bumpConfig(state), count } };
    }
    case 'config/toggleType': {
      const on = state.config.types[action.itemType];
      const activeCount = ITEM_TYPES.filter((t) => state.config.types[t]).length;
      if (on && activeCount === 1) return state; // at least one type stays selected
      return {
        ...state,
        config: { ...bumpConfig(state), types: { ...state.config.types, [action.itemType]: !on } },
      };
    }
    case 'config/setLevel': {
      if (action.level === state.config.level) return state;
      return { ...state, config: { ...bumpConfig(state), level: action.level } };
    }
    case 'rules/setEnabled': {
      if (action.enabled === state.rules.enabled) return state;
      const next: DemoState = {
        ...state,
        config: bumpConfig(state),
        rules: { ...state.rules, enabled: action.enabled },
        // Turning the guide off cancels anything in flight.
        chat: action.enabled
          ? state.chat
          : { ...state.chat, phase: 'idle', pending: null, writingId: null, demo: null },
      };
      return withNotice(next, { t: 'guide', on: action.enabled });
    }
    case 'rules/setMaxHints': {
      if (action.value === state.rules.maxHints) return state;
      const next = { ...state, config: bumpConfig(state), rules: { ...state.rules, maxHints: action.value } };
      return withNotice(next, { t: 'maxHints', value: action.value });
    }
    case 'rules/setMode': {
      if (action.mode === state.rules.mode) return state;
      return withNotice(
        { ...state, rules: { ...state.rules, mode: action.mode } },
        { t: 'mode', mode: action.mode },
      );
    }
    case 'rules/setCite': {
      if (action.on === state.rules.cite) return state;
      return withNotice(
        { ...state, rules: { ...state.rules, cite: action.on } },
        { t: 'cite', on: action.on },
      );
    }
    case 'chat/send': {
      const text = action.text.trim();
      if (!text || !canSend(state)) return state;
      return startTurn(state, { from: 'student', text }, classify(text));
    }
    case 'chat/sendPreset': {
      if (!canSend(state)) return state;
      return startTurn(state, { from: 'student', preset: action.preset }, PRESET_INTENT[action.preset]);
    }
    case 'chat/reply': {
      const { chat, rules } = state;
      if (chat.phase !== 'thinking' || !chat.pending) return state;
      const atLimit = chat.used >= rules.maxHints;
      const { kind, num } = chat.pending;
      const body = atLimit
        ? ({ t: 'limit', max: rules.maxHints } as const)
        : ({
            t: 'hint',
            kind,
            mode: rules.mode,
            num,
            cite: rules.cite,
            hint: chat.used + 1,
            max: rules.maxHints,
          } as const);
      const withReply = append(chat, { from: 'metis', body });
      const highlight = !atLimit && kind === 'check' ? (toHighlight(num) ?? chat.highlight) : chat.highlight;
      return {
        ...state,
        chat: {
          ...withReply,
          used: atLimit ? chat.used : chat.used + 1,
          phase: 'writing',
          pending: null,
          writingId: chat.nextId,
          highlight,
        },
      };
    }
    case 'chat/writeDone': {
      if (state.chat.writingId !== action.id) return state; // idempotent
      return { ...state, chat: { ...state.chat, phase: 'idle', writingId: null } };
    }
    case 'chat/reset':
      return { ...state, chat: emptyChat(state.chat) };
    case 'chat/startDemo':
      return {
        ...state,
        rules: { ...state.rules, enabled: true },
        chat: { ...emptyChat(state.chat), demo: { queue: [...DEMO_SCRIPT] } },
      };
    case 'chat/demoNext': {
      const { demo } = state.chat;
      if (!demo || !canSend(state)) return state;
      const [head, ...rest] = demo.queue;
      if (!head) return { ...state, chat: { ...state.chat, demo: null } };
      const next = startTurn(state, { from: 'student', preset: head }, PRESET_INTENT[head]);
      return { ...next, chat: { ...next.chat, demo: { queue: rest } } };
    }
  }
}
