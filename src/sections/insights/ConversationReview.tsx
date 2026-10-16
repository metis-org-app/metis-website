import { useState } from 'react';
import { MetisThumb } from '../../components/avatar/MetisThumb';
import { ToggleGroup } from '../../components/ui/ToggleGroup';
import { SESSIONS, type SessionId } from '../../content/demo-data';
import { useI18n } from '../../i18n/useI18n';

const TRANSCRIPT_ID = 'insights-transcript';

/**
 * Saved conversations as the instructor sees them: pick a student on the left and read their chat with
 * Metis, read-only, with the rule tag each reply was sent under.
 */
export function ConversationReview({ active }: { active: boolean }) {
  const { m } = useI18n();
  const copy = m.insights.sessions;
  const [selected, setSelected] = useState<SessionId>(SESSIONS[0]!.id);
  const session = SESSIONS.find((s) => s.id === selected) ?? SESSIONS[0]!;
  const student = copy.student(session.student);
  const turns = copy.transcripts[session.id];

  return (
    <div className="flex min-w-0 flex-col border border-ink bg-surface lg:col-span-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-ink px-4 py-3">
        <h3 className="m-0 text-[17px] leading-tight font-bold">{copy.heading}</h3>
        <span className="label-mono inline-flex items-center gap-2 text-xs text-soft">
          <span aria-hidden="true" className="size-1.5 bg-accent" />
          {copy.saved}
        </span>
      </div>
      <div className="grid min-w-0 flex-1 grid-cols-1 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
        <ToggleGroup label={copy.listLabel} className="border-b border-ink sm:border-r sm:border-b-0">
          <ul className="m-0 grid list-none grid-cols-2 p-0 sm:grid-cols-1">
            {SESSIONS.map((s) => {
              const pressed = s.id === selected;
              return (
                <li key={s.id} className="border-line not-last:border-b max-sm:odd:border-r">
                  <button
                    type="button"
                    aria-pressed={pressed}
                    aria-controls={TRANSCRIPT_ID}
                    onClick={() => setSelected(s.id)}
                    className={`flex min-h-11 w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors ${pressed ? 'bg-ink text-bg' : 'text-ink hover:bg-bg'}`}
                  >
                    <span className="font-semibold">{copy.student(s.student)}</span>{' '}
                    <span className={`label-mono text-xs ${pressed ? 'text-bg/80' : 'text-soft'}`}>
                      {copy.meta(s.item, s.minute, copy.transcripts[s.id].length)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </ToggleGroup>
        <div id={TRANSCRIPT_ID} className="flex min-w-0 flex-col bg-bg">
          <div className="label-mono flex flex-wrap justify-between gap-x-3 gap-y-1 border-b border-line bg-surface px-4 py-2.5 text-xs">
            <span className="text-accent">{copy.item(session.item, m.topics[session.topic])}</span>
            <span className="text-soft">{student}</span>
          </div>
          {/* Keyed by session so switching replays the entrance. */}
          <ol
            key={session.id}
            aria-label={copy.transcriptLabel(student)}
            className="m-0 flex list-none flex-col gap-3.5 px-4 py-[18px]"
          >
            {turns.map((turn, i) => {
              const motion = active ? 'motion-safe:animate-fade-up' : '';
              const delay = { animationDelay: `${i * 0.14}s` };
              return turn.from === 'student' ? (
                <li
                  key={turn.text}
                  className={`flex max-w-[82%] flex-col items-end gap-1 self-end ${motion}`}
                  style={delay}
                >
                  <span className="label-mono text-xs tracking-[0.08em] text-soft">{student}</span>
                  <p className="m-0 bg-ink px-3.5 py-2.5 text-[15px] leading-snug text-bg">{turn.text}</p>
                </li>
              ) : (
                <li
                  key={turn.text}
                  className={`flex max-w-[90%] items-start gap-2.5 self-start ${motion}`}
                  style={delay}
                >
                  <MetisThumb size={28} corner />
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <span className="sr-only">{m.guide.chat.name}:</span>
                    <p className="m-0 border border-l-[3px] border-ink border-l-accent bg-surface px-3.5 py-2.5 text-[15px] leading-normal">
                      {turn.text}
                    </p>
                    {turn.tag && (
                      <span className="label-mono inline-flex items-center gap-1.5 text-xs tracking-[0.08em] text-soft">
                        <span aria-hidden="true" className="size-1.5 bg-accent" />
                        {turn.tag}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
