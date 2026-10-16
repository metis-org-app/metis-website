import { useState, type FormEvent } from 'react';
import { MetisThumb } from '../../components/avatar/MetisThumb';
import { PRICE_ROWS } from '../../content/demo-data';
import { noticeText, studentText } from '../../features/guide/copy';
import { useDemo } from '../../features/guide/demo-context';
import { hintSquares } from '../../features/guide/selectors';
import type { Preset } from '../../features/guide/types';
import { useI18n } from '../../i18n/useI18n';
import { MetisMessage } from './MetisMessage';

const PRESETS: Exclude<Preset, 'initial'>[] = ['answer', 'start', 'check40'];

function ChatHeader() {
  const { m } = useI18n();
  const { state, dispatch } = useDemo();
  const chat = m.guide.chat;
  const { phase } = state.chat;
  const busy = phase !== 'idle';
  const squares = hintSquares(state).map((lit, n) => ({ lit, key: `${n}-${lit}` }));
  const used = squares.filter((square) => square.lit).length;
  const status =
    phase === 'thinking'
      ? chat.status.thinking
      : phase === 'writing'
        ? chat.status.writing
        : chat.status.idle;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink bg-surface px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <MetisThumb size={46} corner />
        <div className="flex min-w-0 flex-col gap-[3px]">
          <span className="text-[17px] leading-tight font-bold">
            {chat.name} <span className="font-normal text-soft">· {chat.role}</span>
          </span>
          <span className="label-mono inline-flex items-center gap-2 text-[11px] text-soft">
            <span
              aria-hidden="true"
              className={`size-[7px] bg-accent ${busy ? 'motion-safe:animate-beacon' : ''}`}
            />
            {status}
          </span>
          <span aria-hidden="true" className="relative block h-0.5 w-[120px] overflow-hidden bg-line2">
            {busy && <span className="absolute top-0 h-0.5 bg-accent motion-safe:animate-think" />}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div role="img" aria-label={chat.hintsAria(used, squares.length)} className="flex items-center gap-2">
          <span aria-hidden="true" className="label-mono text-[11px] text-soft">
            {chat.hints}
          </span>
          {squares.map(({ lit, key }) => (
            <span
              key={key}
              aria-hidden="true"
              className={`size-3.5 border border-ink ${lit ? 'bg-accent motion-safe:animate-ignite' : 'bg-transparent'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'chat/reset' })}
          className="label-mono min-h-11 border border-ink bg-transparent px-3 text-xs text-ink transition-colors hover:bg-ink hover:text-bg"
        >
          {chat.reset}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'chat/startDemo' })}
          className="label-mono inline-flex min-h-11 items-center gap-1.5 border border-ink bg-ink px-3 text-xs text-bg transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
            <path d="M7 5v14l12-7z" />
          </svg>
          {chat.demo}
        </button>
      </div>
    </div>
  );
}

function ItemContext() {
  const { m } = useI18n();
  const { state } = useDemo();
  const item = m.guide.chat.item;
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-line px-4 py-3.5">
      <div className="flex flex-[1_1_240px] flex-col gap-1">
        <span className="label-mono text-[11px] text-accent">{item.label}</span>
        <span className="font-semibold">{item.prompt}</span>
      </div>
      <table className="border-collapse border border-ink font-mono text-xs">
        <caption className="sr-only">{item.caption}</caption>
        <thead>
          <tr className="bg-surface">
            <th scope="col" className="border-b border-ink px-2.5 py-1.5 text-left font-medium">
              {item.price}
            </th>
            <th scope="col" className="border-b border-ink px-2.5 py-1.5 text-right font-medium">
              {item.supplied}
            </th>
            <th scope="col" className="border-b border-ink px-2.5 py-1.5 text-right font-medium">
              {item.demanded}
            </th>
          </tr>
        </thead>
        <tbody>
          {PRICE_ROWS.map((row) => {
            const hl = state.chat.highlight === row.price;
            return (
              <tr
                key={row.price}
                className={`transition-colors duration-300 ${hl ? 'bg-tint font-bold' : ''}`}
              >
                <th scope="row" className="border-b border-line2 px-2.5 py-1 text-left font-[inherit]">
                  ${row.price}
                  {hl && <span className="sr-only"> {item.checking}</span>}
                </th>
                <td className="border-b border-line2 px-2.5 py-1 text-right">{row.supplied}</td>
                <td className="border-b border-line2 px-2.5 py-1 text-right">{row.demanded}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MessageLog() {
  const { m } = useI18n();
  const { state } = useDemo();
  const chat = m.guide.chat;
  return (
    // The live region wraps the list: role="log" on the <ol> itself would drop its list semantics.
    <div
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label={chat.log}
      className="h-[430px] overflow-hidden px-4 py-[18px] [mask-image:linear-gradient(to_bottom,transparent_0,#000_52px)]"
    >
      <ol className="m-0 flex h-full list-none flex-col justify-end gap-3.5 p-0">
        {state.chat.messages.map((message) => {
          if (message.from === 'system') {
            return (
              <li
                key={message.id}
                className="label-mono flex shrink-0 items-center gap-2.5 text-[11px] tracking-[0.08em] motion-safe:animate-flash"
              >
                <span aria-hidden="true" className="h-px flex-1 bg-accent" />
                <span className="border border-accent px-2 py-[3px] text-ink">
                  {noticeText(message.notice, m)}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-accent" />
              </li>
            );
          }
          if (message.from === 'student') {
            return (
              <li
                key={message.id}
                className="flex max-w-[78%] shrink-0 flex-col items-end gap-1 self-end motion-safe:animate-in-right"
              >
                <span className="label-mono text-[10.5px] tracking-[0.08em] text-soft">{chat.student}</span>
                <p className="m-0 bg-ink px-3.5 py-[11px] text-[15px] leading-snug text-bg">
                  {studentText(message, m)}
                </p>
              </li>
            );
          }
          return <MetisMessage key={message.id} id={message.id} body={message.body} />;
        })}
        {state.chat.phase === 'thinking' && (
          <li className="flex shrink-0 items-center gap-2.5 self-start motion-safe:animate-in-left">
            <MetisThumb size={32} />
            <span
              role="img"
              aria-label={chat.thinkingAria}
              className="inline-flex gap-[5px] border border-ink bg-surface px-3.5 py-[13px]"
            >
              {[0, 0.15, 0.3].map((delay) => (
                <span
                  key={delay}
                  aria-hidden="true"
                  className="inline-block size-[7px] bg-ink motion-safe:animate-dot"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </span>
          </li>
        )}
      </ol>
    </div>
  );
}

function Composer({ disabled }: { disabled: boolean }) {
  const { m } = useI18n();
  const { state, dispatch } = useDemo();
  const [draft, setDraft] = useState('');
  const chat = m.guide.chat;
  const busy = state.chat.phase !== 'idle';

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || !draft.trim()) return;
    dispatch({ type: 'chat/send', text: draft });
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-2.5 border-t border-ink bg-surface px-4 pt-3 pb-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={disabled}
            aria-disabled={busy || undefined}
            onClick={() => {
              if (!busy) dispatch({ type: 'chat/sendPreset', preset });
            }}
            className="min-h-11 border border-ink bg-transparent px-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-bg disabled:opacity-50"
          >
            {chat.prompts[preset]}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex border border-ink bg-bg">
        <label htmlFor="metis-message" className="sr-only">
          {chat.inputLabel}
        </label>
        <input
          id="metis-message"
          type="text"
          autoComplete="off"
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={chat.placeholder}
          className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-base text-ink placeholder:text-soft focus-visible:outline-offset-[-2px]"
        />
        <button
          type="submit"
          disabled={disabled}
          aria-disabled={busy || undefined}
          className="label-mono min-h-12 border-l border-ink bg-ink px-[18px] text-[13px] text-bg transition-colors hover:bg-accent hover:text-accent-fg disabled:opacity-50"
        >
          {chat.send}
        </button>
      </form>
    </div>
  );
}

export function ChatPanel() {
  const { m } = useI18n();
  const { state, dispatch } = useDemo();
  const off = !state.rules.enabled;

  return (
    <div className="relative flex min-w-0 flex-col border border-ink bg-bg lg:col-span-8">
      <ChatHeader />
      <ItemContext />
      <div className="relative">
        <div inert={off}>
          <MessageLog />
        </div>
        {off && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 bg-bg/95 p-6 text-center">
            <span className="label-mono text-xs text-soft">{m.guide.chat.off.text}</span>
            <button
              type="button"
              onClick={() => dispatch({ type: 'rules/setEnabled', enabled: true })}
              className="label-mono min-h-11 border border-ink bg-ink px-4 text-[13px] text-bg transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
            >
              {m.guide.chat.off.turnOn}
            </button>
          </div>
        )}
      </div>
      <div inert={off}>
        <Composer disabled={off} />
      </div>
    </div>
  );
}
