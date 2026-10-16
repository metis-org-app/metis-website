import { MetisThumb } from '../../components/avatar/MetisThumb';
import { useI18n } from '../../i18n/useI18n';

/** Static classes (not inline styles) so the prerendered HTML stays within the CSP. */
const STEP_DELAYS = ['', '[animation-delay:1.5s]', '[animation-delay:3s]', '[animation-delay:4.5s]'];

/** A → D steps, highlighted in sequence, with a square travelling along the base line. */
export function Pipeline() {
  const { m } = useI18n();
  return (
    <div className="mt-auto flex flex-col gap-3">
      <ol
        aria-label={m.hero.pipelineLabel}
        className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] border-t border-l border-ink p-0"
      >
        {m.hero.pipeline.map((step, i) => (
          <li
            key={step.key}
            className={`flex min-h-[120px] flex-col gap-1.5 border-r border-b border-ink bg-surface px-4 py-3.5 motion-safe:animate-highlight ${STEP_DELAYS[i] ?? ''}`}
          >
            <span aria-hidden="true" className="font-mono text-xs text-soft">
              {step.key}
            </span>
            <span className="flex items-center gap-2 text-xl font-bold tracking-[-0.01em]">
              {step.title}
              {step.key === 'C' && <MetisThumb size={24} />}
            </span>
            <span className="mt-auto font-mono text-xs text-soft">{step.note}</span>
          </li>
        ))}
      </ol>
      {/* The moving layer translates by its own width; the track clips it so it never widens the page. */}
      <div aria-hidden="true" className="relative h-2.5 overflow-hidden">
        <div className="absolute inset-x-0 top-1 h-px bg-line" />
        <div className="absolute inset-y-0 right-2.5 left-0 motion-safe:animate-travel">
          <span className="absolute top-0 left-0 size-2.5 bg-accent" />
        </div>
      </div>
    </div>
  );
}
