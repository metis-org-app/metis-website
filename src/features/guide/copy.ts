import type { Messages } from '../../i18n/messages/en';
import type { ChatMessage, MetisBody, Notice } from './types';

/** Text of a Metis reply in the active language. */
export function replyText(body: MetisBody, m: Messages): string {
  const chat = m.guide.chat;
  if (body.t === 'limit') return chat.limit(body.max);
  const reply = chat.replies[body.kind][body.mode];
  const at = body.num ? `$${body.num}` : chat.thatPrice;
  const text = typeof reply === 'function' ? reply(at) : reply;
  return body.cite ? `${text} ${chat.source}` : text;
}

/** Rule tag shown under a Metis reply, e.g. "SOCRATIC · HINT 2/3 · SOURCE P. 06 · ANSWER WITHHELD". */
export function tagText(body: MetisBody, m: Messages): string {
  const tag = m.guide.chat.tag;
  if (body.t === 'limit') return `${tag.limit} · ${tag.withheld}`;
  return [
    m.guide.rules.modes[body.mode].tag,
    tag.hint(body.hint, body.max),
    body.cite ? tag.source : null,
    tag.withheld,
  ]
    .filter((part): part is string => part !== null)
    .join(' · ');
}

export function noticeText(notice: Notice, m: Messages): string {
  const notices = m.guide.chat.notices;
  switch (notice.t) {
    case 'mode':
      return notices.mode(m.guide.rules.modes[notice.mode].label);
    case 'maxHints':
      return notices.maxHints(notice.value);
    case 'cite':
      return notices.cite(notice.on);
    case 'guide':
      return notices.guide(notice.on);
  }
}

export function studentText(message: Extract<ChatMessage, { from: 'student' }>, m: Messages): string {
  return 'preset' in message ? m.guide.chat.prompts[message.preset] : message.text;
}
