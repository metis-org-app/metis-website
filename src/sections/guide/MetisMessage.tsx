import { MetisThumb } from '../../components/avatar/MetisThumb';
import { replyText, tagText } from '../../features/guide/copy';
import { useDemo } from '../../features/guide/demo-context';
import type { MetisBody } from '../../features/guide/types';
import { useTypewriter } from '../../hooks/useTypewriter';
import { useI18n } from '../../i18n/useI18n';

/**
 * A Metis reply. While it is being written it types itself out; screen readers get the full text once
 * (the animated copy is hidden from them), and the rule tag appears when typing ends.
 */
export function MetisMessage({ id, body }: { id: number; body: MetisBody }) {
  const { m } = useI18n();
  const { state, dispatch } = useDemo();
  const full = replyText(body, m);
  const writing = state.chat.writingId === id;
  const { text, done } = useTypewriter(full, {
    active: writing,
    onDone: () => dispatch({ type: 'chat/writeDone', id }),
  });

  return (
    <li className="flex max-w-[88%] shrink-0 items-start gap-2.5 self-start motion-safe:animate-in-left">
      <MetisThumb size={32} corner />
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="m-0 border border-l-[3px] border-ink border-l-accent bg-surface px-3.5 py-[11px] text-[15px] leading-normal">
          <span aria-hidden="true">
            {text}
            {!done && (
              <span className="ml-[3px] inline-block h-3.5 w-[7px] translate-y-0.5 bg-ink motion-safe:animate-blink" />
            )}
          </span>
          <span className="sr-only">{full}</span>
        </p>
        {done && (
          <span className="label-mono inline-flex flex-wrap items-center gap-1.5 text-xs tracking-[0.08em] text-soft motion-safe:animate-fade-up">
            <span aria-hidden="true" className="size-1.5 bg-accent" />
            {tagText(body, m)}
          </span>
        )}
      </div>
    </li>
  );
}
