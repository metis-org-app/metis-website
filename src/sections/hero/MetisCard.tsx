import { useRef, useState } from 'react';
import { EXPRESSIONS } from '../../components/avatar/expressions';
import { MetisAvatar } from '../../components/avatar/MetisAvatar';
import { ToggleGroup } from '../../components/ui/ToggleGroup';
import { useHoverOrFocus } from '../../hooks/useHoverOrFocus';
import { useInView } from '../../hooks/useInView';
import { useInterval } from '../../hooks/useInterval';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useI18n } from '../../i18n/useI18n';

export const HERO_CYCLE_MS = 3600;

/**
 * Metis portrait cycling through her six expressions.
 * Picking one stops the cycle; hover, focus, reduced motion or being off-screen pause it.
 */
export function MetisCard() {
  const { m } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduced = useReducedMotion();
  const inView = useInView(ref);
  const held = useHoverOrFocus(ref);

  useInterval(
    () => setIndex((i) => (i + 1) % EXPRESSIONS.length),
    auto && !reduced && !held && inView ? HERO_CYCLE_MS : null,
  );

  const expression = EXPRESSIONS[index]!;
  const copy = m.hero.expressions[expression];

  return (
    <section
      ref={ref}
      aria-label={m.hero.card.groupLabel}
      className="flex flex-col border border-ink bg-surface lg:col-span-4"
    >
      <div className="label-mono flex items-center justify-between border-b border-ink px-3.5 py-2.5 text-xs">
        <span>
          {m.hero.card.header} / {copy.label}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-2 bg-accent motion-safe:animate-beacon" />
          {m.hero.card.online}
        </span>
      </div>
      <div className="aspect-square border-b border-ink bg-surface p-[5%]">
        <MetisAvatar expression={expression} label={m.hero.card.aria(copy.label.toLowerCase())} />
      </div>
      <ToggleGroup label={m.hero.card.expressionsLabel}>
        <div className="grid grid-cols-3 border-b border-ink">
          {EXPRESSIONS.map((item, i) => {
            const active = i === index;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setIndex(i);
                  setAuto(false);
                }}
                className={`label-mono min-h-11 px-1 text-[11px] transition-colors ${i % 3 < 2 ? 'border-r border-line' : ''} ${i < 3 ? 'border-b border-line' : ''} ${active ? 'bg-ink text-bg' : 'bg-transparent text-ink hover:bg-tint'}`}
              >
                {m.hero.expressions[item].label}
              </button>
            );
          })}
        </div>
      </ToggleGroup>
      <div className="flex flex-col gap-3 p-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="display-type text-[28px] leading-none">{m.hero.card.name}</span>
          <span className="label-mono text-xs tracking-[0.04em] text-soft">{m.hero.card.inEveryLink}</span>
        </div>
        <p className="m-0 flex min-h-[50px] items-center gap-2.5 border border-line bg-bg px-3.5 py-2 text-base leading-snug font-semibold">
          <span aria-hidden="true" className="size-2 shrink-0 bg-accent" />
          {copy.line}
        </p>
      </div>
    </section>
  );
}
