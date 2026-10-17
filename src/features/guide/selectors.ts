import type { Expression } from '../../components/avatar/expressions';
import type { Messages } from '../../i18n/messages/en';
import type { DemoState, RulesState } from './types';

export type Presence = 'off' | 'thinking' | 'guiding' | 'reviewing' | 'listening';

/** What Metis is doing right now (drives the live avatar and its headline). */
export function presence(state: DemoState): Presence {
  if (!state.rules.enabled) return 'off';
  if (state.chat.phase === 'thinking') return 'thinking';
  if (state.chat.phase === 'writing') return 'guiding';
  const lastMetis = state.chat.messages.findLast((message) => message.from === 'metis');
  if (lastMetis && lastMetis.from === 'metis' && lastMetis.body.t === 'limit') return 'reviewing';
  return 'listening';
}

const PRESENCE_EXPRESSION: Record<Presence, Expression> = {
  off: 'happy',
  thinking: 'thinking',
  guiding: 'guiding',
  reviewing: 'reviewing',
  listening: 'listening',
};

export function presenceExpression(state: DemoState): Expression {
  return PRESENCE_EXPRESSION[presence(state)];
}

/** One entry per allowed hint; `true` when already used. */
export function hintSquares(state: DemoState): boolean[] {
  const lit = Math.min(state.chat.used, state.rules.maxHints);
  return Array.from({ length: state.rules.maxHints }, (_, i) => i < lit);
}

export function ruleSummary(rules: RulesState, m: Messages): string {
  const presenceCopy = m.guide.presence;
  return [
    m.guide.rules.modes[rules.mode].short,
    presenceCopy.maxHints(rules.maxHints),
    rules.cite ? presenceCopy.cites : presenceCopy.noCites,
  ].join(' · ');
}
