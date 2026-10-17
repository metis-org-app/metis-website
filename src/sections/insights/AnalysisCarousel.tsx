import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useHoverOrFocus } from '../../hooks/useHoverOrFocus';
import { useInterval } from '../../hooks/useInterval';
import { useInView } from '../../hooks/useInView';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useI18n } from '../../i18n/useI18n';
import { AuditWaffle } from './charts/AuditWaffle';
import { MaterialHeatmap } from './charts/MaterialHeatmap';
import { MisconceptionBars } from './charts/MisconceptionBars';
import { RelianceTrend } from './charts/RelianceTrend';

/** Time per slide; keep in sync with `--animate-slide` in index.css (the tab's progress bar). */
export const SLIDE_MS = 9000;
/**
 * Auto-advance only where the carousel fits on screen (the `lg` breakpoint). On phones it is taller than
 * the viewport, and a slide changing while someone reads further down is disorienting.
 */
const AUTOPLAY_QUERY = '(min-width: 60rem)';

const SLIDES = ['integrity', 'semantic', 'evidence', 'longitudinal'] as const;
type SlideId = (typeof SLIDES)[number];

const CHARTS: Record<SlideId, (props: { active: boolean }) => ReactNode> = {
  integrity: AuditWaffle,
  semantic: MaterialHeatmap,
  evidence: MisconceptionBars,
  longitudinal: RelianceTrend,
};

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="square" />
    </svg>
  );
}

const CONTROL =
  'inline-flex size-11 items-center justify-center border border-ink text-ink transition-colors hover:bg-ink hover:text-bg';

/**
 * Advanced analyses as a tabbed carousel (WAI-ARIA APG pattern). On wide screens it moves on its own
 * every SLIDE_MS while visible. In its automatic mode it waits while the pointer or focus is inside; the
 * pause button and picking a slide stop it, and the play button restarts it even under the pointer.
 * Reduced motion turns rotation off. All slides share one grid cell, so the height never jumps; inactive
 * slides are invisible and inert. Every slide is in the prerendered HTML.
 */
export function AnalysisCarousel() {
  const { m } = useI18n();
  const copy = m.insights.analyses;
  const ref = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const [index, setIndex] = useState(0);
  /** auto: rotates unless hovered or focused · paused: stopped by the user · playing: restarted by the user. */
  const [mode, setMode] = useState<'auto' | 'paused' | 'playing'>('auto');
  const paused = mode === 'paused';
  const reduced = useReducedMotion();
  const autoplay = useMediaQuery(AUTOPLAY_QUERY) && !reduced;
  const inView = useInView(ref);
  const seen = useInView(ref, { once: true, rootMargin: '-80px 0px' });
  const held = useHoverOrFocus(ref);
  const running = autoplay && inView && (mode === 'playing' || (mode === 'auto' && !held));

  useInterval(() => setIndex((i) => (i + 1) % SLIDES.length), running ? SLIDE_MS : null);

  /** Showing a slide on request stops the rotation (APG); the play button starts it again. */
  const show = (next: number, focusTab = false) => {
    const wrapped = (next + SLIDES.length) % SLIDES.length;
    setIndex(wrapped);
    setMode('paused');
    if (focusTab) tabs.current[wrapped]?.focus();
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: SLIDES.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    show(next, true);
  };

  const id = (part: string, i: number) => `${baseId}-${part}-${i}`;

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription={copy.carousel}
      aria-labelledby={`${baseId}-title`}
      className="flex flex-col border border-ink bg-surface"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink px-4 py-3">
        <h3 id={`${baseId}-title`} className="m-0 text-[19px] leading-tight font-bold">
          {copy.heading}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={copy.previous}
            onClick={() => show(index - 1)}
            className={CONTROL}
          >
            <ArrowIcon direction="left" />
          </button>
          {autoplay && (
            <button
              type="button"
              aria-label={paused ? copy.play : copy.pause}
              onClick={() => setMode(paused ? 'playing' : 'paused')}
              className={CONTROL}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                {paused ? <path d="M7 5v14l12-7z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
              </svg>
            </button>
          )}
          <button type="button" aria-label={copy.next} onClick={() => show(index + 1)} className={CONTROL}>
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <div
        role="tablist"
        aria-label={copy.tabsLabel}
        className="grid grid-cols-2 border-b border-ink lg:grid-cols-4"
      >
        {SLIDES.map((slide, i) => {
          const selected = i === index;
          return (
            <button
              key={slide}
              ref={(element) => {
                tabs.current[i] = element;
              }}
              type="button"
              role="tab"
              id={id('tab', i)}
              aria-selected={selected}
              aria-controls={id('panel', i)}
              tabIndex={selected ? 0 : -1}
              onClick={() => show(i)}
              onKeyDown={onTabKey}
              className={`flex min-h-12 flex-col justify-between gap-2 border-line px-4 pt-3 text-left transition-colors max-lg:odd:border-r max-lg:[&:nth-child(-n+2)]:border-b lg:[&:not(:last-child)]:border-r ${selected ? 'bg-bg text-ink' : 'text-soft hover:text-ink'}`}
            >
              <span className="label-mono text-xs">
                {String(i + 1).padStart(2, '0')} · {copy.slides[slide].tab}
              </span>
              {/* Progress through the current slide while it rotates; a full bar marks the slide when paused. */}
              <span aria-hidden="true" className="block h-[3px] overflow-hidden bg-line2">
                {selected && (
                  <span
                    key={`${index}-${running}`}
                    className={`block h-full origin-left ${running ? 'bg-accent motion-safe:animate-slide' : 'bg-ink'}`}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div aria-live={running ? 'off' : 'polite'} className="grid">
        {SLIDES.map((slide, i) => {
          const active = i === index;
          const text = copy.slides[slide];
          const Chart = CHARTS[slide];
          return (
            <div
              key={slide}
              role="tabpanel"
              id={id('panel', i)}
              aria-labelledby={id('tab', i)}
              aria-roledescription={copy.slide}
              aria-label={copy.position(i + 1, SLIDES.length)}
              inert={!active}
              className={`grid grid-cols-1 content-start gap-x-8 gap-y-6 p-4 [grid-area:1/1] sm:p-6 lg:grid-cols-12 lg:content-stretch ${active ? '' : 'invisible'}`}
            >
              <div
                className={`flex flex-col gap-4 lg:col-span-5 ${active && seen ? 'motion-safe:animate-fade-up' : ''}`}
              >
                <span className="label-mono text-xs text-accent">{text.kicker}</span>
                <h4 className="display-type m-0 text-[clamp(24px,2.4vw,32px)] leading-[1.05] text-balance">
                  {text.title}
                </h4>
                <div className="flex flex-col gap-2">
                  <h5 className="label-mono m-0 text-xs font-normal text-soft">{copy.computes}</h5>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {text.points.map((point) => (
                      <li key={point} className="flex gap-2.5 text-[15px] leading-snug">
                        <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 bg-ink" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="label-mono m-0 mt-auto border-t border-line pt-3 text-xs text-soft">
                  {text.method}
                </p>
              </div>
              <div className="min-w-0 lg:col-span-7">
                <Chart active={active && seen} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
