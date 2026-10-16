import { useRef, useState } from 'react';
import { EXPRESSIONS } from '../../components/avatar/expressions';
import { MetisAvatar } from '../../components/avatar/MetisAvatar';
import { useHoverOrFocus } from '../../hooks/useHoverOrFocus';
import { useInView } from '../../hooks/useInView';
import { useInterval } from '../../hooks/useInterval';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useI18n } from '../../i18n/useI18n';

export const HERO_CYCLE_MS = 3600;

/**
 * Metis portrait as an automatic carousel of her six expressions, with a soft transition and a
 * progress indicator. It pauses on hover/focus, off-screen, under reduced motion, or with the
 * pause control (moving content must be pausable — WCAG 2.2.2).
 */
export function MetisCard() {
  const { m } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const reduced = useReducedMotion();
  const inView = useInView(ref);
  const held = useHoverOrFocus(ref);
  const running = !userPaused && !reduced && !held && inView;

  // Next expression, with a soft cross-fade (Web Animations API). It only runs while `running`, which
  // already excludes reduced motion.
  const advance = () => {
    setIndex((i) => (i + 1) % EXPRESSIONS.length);
    const element = portraitRef.current;
    if (!element || typeof element.animate !== 'function') return;
    element.animate(
      [
        { opacity: 0.25, transform: 'scale(0.97)', filter: 'blur(2px)' },
        { opacity: 1, transform: 'none', filter: 'none' },
      ],
      { duration: 520, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
    );
  };
  useInterval(advance, running ? HERO_CYCLE_MS : null);

  const expression = EXPRESSIONS[index]!;
  const copy = m.hero.expressions[expression];

  return (
    <section
      ref={ref}
      aria-label={m.hero.card.groupLabel}
      className="flex flex-col border border-ink bg-surface lg:col-span-4"
    >
      <div className="label-mono flex items-center justify-between gap-2 border-b border-ink py-1 pr-1 pl-3.5 text-xs">
        <span>
          {m.hero.card.header} / {copy.label}
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="size-2 bg-accent motion-safe:animate-beacon" />
            {m.hero.card.online}
          </span>
          {!reduced && (
            <button
              type="button"
              aria-label={userPaused ? m.hero.card.play : m.hero.card.pause}
              onClick={() => setUserPaused((p) => !p)}
              className="inline-flex size-11 items-center justify-center text-ink transition-colors hover:text-accent"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                {userPaused ? <path d="M7 5v14l12-7z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
              </svg>
            </button>
          )}
        </span>
      </div>
      <div className="relative aspect-square border-b border-ink bg-surface p-[5%]">
        <div ref={portraitRef} className="size-full">
          <MetisAvatar expression={expression} label={m.hero.card.aria(copy.label.toLowerCase())} />
        </div>
        {/* Carousel position: one segment per expression; the active one fills over the cycle. */}
        <div aria-hidden="true" className="absolute inset-x-[5%] bottom-3 grid grid-cols-6 gap-1.5">
          {EXPRESSIONS.map((item, i) => (
            <span key={item} className="h-[3px] overflow-hidden bg-line2">
              {i < index && <span className="block size-full bg-ink" />}
              {i === index && (
                <span
                  key={`${index}-${running}`}
                  className={`block size-full origin-left bg-accent ${running ? 'animate-progress' : ''}`}
                  style={running ? { animationDuration: `${HERO_CYCLE_MS}ms` } : undefined}
                />
              )}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 p-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="display-type text-[28px] leading-none">{m.hero.card.name}</span>
          <span className="label-mono text-xs tracking-[0.04em] text-soft">{m.hero.card.inEveryLink}</span>
        </div>
        <p className="m-0 flex min-h-[50px] items-center gap-2.5 border border-line bg-bg px-3.5 py-2 text-base leading-snug font-semibold">
          <span aria-hidden="true" className="size-2 shrink-0 bg-accent" />
          <span key={expression} className="motion-safe:animate-fade-up">
            {copy.line}
          </span>
        </p>
      </div>
    </section>
  );
}
