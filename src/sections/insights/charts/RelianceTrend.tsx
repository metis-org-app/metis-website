import { useRef } from 'react';
import { CURRENT_QUIZ, LONGITUDINAL, RELIANCE } from '../../../content/demo-data';
import { useHydrated } from '../../../hooks/useHydrated';
import { useSvgTextSize } from '../../../hooks/useSvgTextSize';
import { useI18n } from '../../../i18n/useI18n';
import { ChartData } from './ChartData';

// Geometry in viewBox units.
const W = 440;
const H = 236;
const PLOT = { left: 34, right: 420, top: 40, bottom: 192 };
const Y_MAX = 6;
const INSET = 26;
const x = (i: number) =>
  PLOT.left + INSET + (i * (PLOT.right - PLOT.left - 2 * INSET)) / (RELIANCE.length - 1);
const y = (v: number) => PLOT.bottom - (v / Y_MAX) * (PLOT.bottom - PLOT.top);
const pt = (i: number, v: number) => `${x(i).toFixed(1)} ${y(v).toFixed(1)}`;

const LINE = RELIANCE.map((q, i) => `${i ? 'L' : 'M'}${pt(i, q.median)}`).join(' ');
const BAND = `M${RELIANCE.map((q, i) => pt(i, q.p75)).join(' L')} L${RELIANCE.map((_, i) => {
  const j = RELIANCE.length - 1 - i;
  return pt(j, RELIANCE[j]!.p25);
}).join(' L')} Z`;
const CURRENT = RELIANCE.findIndex((q) => q.quiz === CURRENT_QUIZ);

/**
 * Longitudinal: questions to Metis per student across the course (median line with the middle 50% band,
 * labelled directly, as UI/UX Pro Max suggests for trends with uncertainty), plus three course-level counters.
 */
export function RelianceTrend({ active }: { active: boolean }) {
  const { m, lang } = useI18n();
  const copy = m.insights.analyses.longitudinal;
  const percent = m.results.percent;
  const number = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
  const svgRef = useRef<SVGSVGElement>(null);
  const label = useSvgTextSize(svgRef, W);
  const hydrated = useHydrated();
  const animate = (cls: string) => (active ? cls : '');
  const first = RELIANCE[0]!;
  const last = RELIANCE[RELIANCE.length - 1]!;

  return (
    <figure className="m-0 flex flex-col gap-4">
      <figcaption className="label-mono flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-soft">
        <span>{copy.caption}</span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-5 bg-ink/10" />
          {copy.band}
        </span>
      </figcaption>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={copy.summary(number.format(first.median), number.format(last.median))}
        className="h-auto w-full"
      >
        {[0, 2, 4, 6].map((v) => (
          <g key={v}>
            <line
              x1={PLOT.left}
              x2={PLOT.right}
              y1={y(v)}
              y2={y(v)}
              className={v ? 'stroke-line2' : 'stroke-ink'}
            />
            <text
              x={PLOT.left - 8}
              y={y(v) + label / 3}
              textAnchor="end"
              fontSize={label}
              className="fill-soft font-mono"
            >
              {v}
            </text>
          </g>
        ))}
        {/* The assessment on this page. */}
        <line
          x1={x(CURRENT)}
          x2={x(CURRENT)}
          y1={PLOT.top - 6}
          y2={PLOT.bottom}
          strokeDasharray="3 3"
          className="stroke-soft"
        />
        <text
          x={x(CURRENT)}
          y={PLOT.top - 12}
          textAnchor="middle"
          fontSize={label}
          className="fill-ink font-mono"
        >
          {copy.current}
        </text>
        <path d={BAND} className={`fill-ink/10 ${animate('motion-safe:animate-fade-up')}`} />
        <path
          d={LINE}
          pathLength={1}
          strokeDasharray="1"
          strokeWidth={2.5}
          strokeLinejoin="round"
          className={`fill-none stroke-ink ${animate('motion-safe:animate-draw')}`}
        />
        {RELIANCE.map((q, i) => (
          <g key={q.quiz}>
            <rect
              x={x(i) - 5}
              y={y(q.median) - 5}
              width={10}
              height={10}
              className={`origin-center fill-ink [transform-box:fill-box] ${animate('motion-safe:animate-ignite')}`}
              style={hydrated ? { animationDelay: `${i * 0.35}s` } : undefined}
            />
            <text
              x={x(i) + 9}
              y={y(q.median) - 9}
              fontSize={label}
              className="fill-ink font-mono font-medium"
            >
              {number.format(q.median)}
            </text>
            <text
              x={x(i)}
              y={PLOT.bottom + 8 + label}
              textAnchor="middle"
              fontSize={label}
              className="fill-soft font-mono"
            >
              {copy.quiz(q.quiz)}
            </text>
          </g>
        ))}
      </svg>
      <dl className="m-0 grid grid-cols-1 border-y border-ink sm:grid-cols-3">
        <div className="flex flex-col gap-1 border-line py-3 sm:pr-4 sm:[&:not(:last-child)]:border-r">
          <dt className="label-mono text-xs text-soft">{copy.answerRequests}</dt>
          <dd className="display-type m-0 text-[28px] leading-none whitespace-nowrap">
            {percent(LONGITUDINAL.answerRequestsFrom)} → {percent(LONGITUDINAL.answerRequestsTo)}
          </dd>
        </div>
        <div className="flex flex-col gap-1 border-line py-3 sm:px-4 sm:[&:not(:last-child)]:border-r">
          <dt className="label-mono text-xs text-soft">{copy.transfer}</dt>
          <dd className="display-type m-0 text-[28px] leading-none">{percent(LONGITUDINAL.transfer)}</dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:pl-4">
          <dt className="label-mono text-xs text-soft">{copy.earlyWarning}</dt>
          <dd className="display-type m-0 text-[28px] leading-none text-accent">
            {LONGITUDINAL.earlyWarning}
          </dd>
        </div>
      </dl>
      <ChartData
        caption={copy.caption}
        columns={[copy.columns.quiz, copy.columns.median, copy.columns.range]}
        rows={RELIANCE.map((q) => [
          copy.quiz(q.quiz),
          number.format(q.median),
          `${number.format(q.p25)}–${number.format(q.p75)}`,
        ])}
      />
    </figure>
  );
}
