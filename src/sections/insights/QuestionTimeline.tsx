import { useRef } from 'react';
import { QUESTION_TIMELINE, TIMELINE_BLOCK_MINUTES, TIMELINE_PEAK_ITEM } from '../../content/demo-data';
import { useSvgTextSize } from '../../hooks/useSvgTextSize';
import { useI18n } from '../../i18n/useI18n';

// Chart geometry (viewBox units). Each value sits at the middle of its 5-minute block.
const W = 440;
const H = 220;
const PLOT = { left: 30, right: 430, top: 34, bottom: 182 };
const Y_MAX = 20;
const SERIES: readonly number[] = QUESTION_TIMELINE;
const BLOCK_W = (PLOT.right - PLOT.left) / SERIES.length;
const x = (i: number) => PLOT.left + (i + 0.5) * BLOCK_W;
const y = (v: number) => PLOT.bottom - (v / Y_MAX) * (PLOT.bottom - PLOT.top);

const POINTS = SERIES.map((v, i) => ({ i, cx: x(i), cy: y(v) }));
const LINE = POINTS.map((p) => `${p.i ? 'L' : 'M'}${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`).join(' ');
const AREA = `${LINE} L${x(SERIES.length - 1).toFixed(1)} ${PLOT.bottom} L${x(0).toFixed(1)} ${PLOT.bottom} Z`;
const PEAK = SERIES.indexOf(Math.max(...SERIES));
const PEAK_POINT = POINTS[PEAK]!;
/** Axis ticks every three blocks (0, 15, 30, 45 min), on block boundaries. */
const TICKS = [0, 3, 6, 9].map((block) => ({
  block,
  tx: PLOT.left + block * BLOCK_W,
  anchor: (block === 0 ? 'start' : block === SERIES.length ? 'end' : 'middle') as 'start' | 'end' | 'middle',
}));
const DRAW_S = 1.6;

/**
 * Questions to Metis over the exam: the line draws itself once the section is in view, the points light
 * up as it passes, and the peak block is marked with the item students were on.
 */
export function QuestionTimeline({ active }: { active: boolean }) {
  const { m } = useI18n();
  const copy = m.insights.timeline;
  const animate = (cls: string) => (active ? cls : '');
  const svgRef = useRef<SVGSVGElement>(null);
  // Labels stay at 12–13 px on screen whatever the chart width.
  const label = useSvgTextSize(svgRef, W);
  const peakLabel = useSvgTextSize(svgRef, W, 13);

  return (
    <figure className="m-0 flex flex-col gap-3 lg:col-span-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink pb-3">
        <span className="label-mono text-xs text-soft">{copy.heading}</span>
        <span className="label-mono text-xs text-soft">{copy.caption}</span>
      </figcaption>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={copy.label}
        className="h-auto w-full"
      >
        {/* Peak block */}
        <rect
          x={PLOT.left + PEAK * BLOCK_W}
          y={PLOT.top - 14}
          width={BLOCK_W}
          height={PLOT.bottom - PLOT.top + 14}
          className={`fill-tint ${animate('motion-safe:animate-fade-up')}`}
          style={{ animationDelay: `${DRAW_S * 0.6}s` }}
        />
        {[10, 20].map((v) => (
          <g key={v}>
            <line x1={PLOT.left} x2={PLOT.right} y1={y(v)} y2={y(v)} className="stroke-line2" />
            <text
              x={PLOT.left - 8}
              y={y(v) + label / 3}
              textAnchor="end"
              className="fill-soft font-mono"
              style={{ fontSize: label }}
            >
              {v}
            </text>
          </g>
        ))}
        <path d={AREA} className={`fill-ink/6 ${animate('motion-safe:animate-fade-up')}`} />
        <path
          d={LINE}
          pathLength={1}
          strokeDasharray="1"
          className={`fill-none stroke-ink ${animate('motion-safe:animate-draw')}`}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {POINTS.map((p) => {
          const peak = p.i === PEAK;
          const size = peak ? 10 : 6;
          return (
            <rect
              key={p.i}
              x={p.cx - size / 2}
              y={p.cy - size / 2}
              width={size}
              height={size}
              className={`origin-center [transform-box:fill-box] ${peak ? 'fill-accent' : 'fill-surface stroke-ink'} ${animate('motion-safe:animate-ignite')}`}
              strokeWidth={peak ? 0 : 1.5}
              style={{ animationDelay: `${(p.i / (SERIES.length - 1)) * DRAW_S * 0.9}s` }}
            />
          );
        })}
        <text
          x={PEAK_POINT.cx + 11}
          y={PEAK_POINT.cy + peakLabel / 3}
          className={`fill-accent font-mono font-medium ${animate('motion-safe:animate-fade-up')}`}
          style={{ fontSize: peakLabel, animationDelay: `${DRAW_S * 0.7}s` }}
        >
          {copy.peak(TIMELINE_PEAK_ITEM, SERIES[PEAK]!)}
        </text>
        <line x1={PLOT.left} x2={PLOT.right} y1={PLOT.bottom} y2={PLOT.bottom} className="stroke-ink" />
        {TICKS.map((t) => (
          <g key={t.block}>
            <line x1={t.tx} x2={t.tx} y1={PLOT.bottom} y2={PLOT.bottom + 5} className="stroke-ink" />
            <text
              x={t.tx}
              y={PLOT.bottom + 8 + label}
              textAnchor={t.anchor}
              className="fill-soft font-mono"
              style={{ fontSize: label }}
            >
              {copy.axis(t.block * TIMELINE_BLOCK_MINUTES)}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
