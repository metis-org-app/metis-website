import { useId, type CSSProperties } from 'react';
import { AUDIT, AUDIT_CATEGORIES, INTEGRITY, type AuditCategory } from '../../../content/demo-data';
import { useHydrated } from '../../../hooks/useHydrated';
import { useI18n } from '../../../i18n/useI18n';
import { ChartData } from './ChartData';

const COLUMNS = 8;
const CELL = 22;
const GAP = 4;

/** One square per Metis reply, in category order: categories differ by fill, hatching and outline. */
const CELLS = AUDIT_CATEGORIES.flatMap((category) =>
  Array.from({ length: AUDIT[category] }, (_, n) => ({ id: `${category}-${n}`, category })),
);
const TOTAL = CELLS.length;
const ROWS = Math.ceil(TOTAL / COLUMNS);
const SIZE = (n: number) => n * CELL + (n - 1) * GAP;

function Swatch({ category, hatch }: { category: AuditCategory; hatch: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 14" width="14" height="14" className="shrink-0">
      <Cell category={category} x={0} y={0} size={14} hatch={hatch} />
    </svg>
  );
}

function Cell({
  category,
  x,
  y,
  size,
  hatch,
  className = '',
  style,
}: {
  category: AuditCategory;
  x: number;
  y: number;
  size: number;
  hatch: string;
  className?: string;
  style?: CSSProperties;
}) {
  const common = { x, y, width: size, height: size, style };
  if (category === 'cited') return <rect {...common} className={`fill-ink ${className}`} />;
  if (category === 'followed')
    return (
      <rect {...common} fill={`url(#${hatch})`} className={`stroke-ink ${className}`} strokeWidth={1.5} />
    );
  if (category === 'offMode')
    return <rect {...common} className={`fill-surface stroke-ink ${className}`} strokeWidth={1.5} />;
  return <rect {...common} className={`fill-accent ${className}`} />;
}

/**
 * Integrity: every reply Metis sent, audited against the instructor's rules (waffle chart, as UI/UX Pro
 * Max recommends for part-to-whole with few categories), plus the integrity counters.
 */
export function AuditWaffle({ active }: { active: boolean }) {
  const { m } = useI18n();
  const copy = m.insights.analyses.integrity;
  // Pattern ids go inside url(#…), so keep them to plain characters.
  const hatch = `hatch-${useId().replace(/[^\w-]/g, '')}`;
  const hydrated = useHydrated();
  const summary = copy.summary(TOTAL, AUDIT.cited, AUDIT.followed, AUDIT.offMode, AUDIT.revealed);

  return (
    <figure className="m-0 flex flex-col gap-4">
      <figcaption className="label-mono text-xs text-soft">{copy.caption}</figcaption>
      <div className="flex flex-wrap items-start gap-6">
        <svg
          viewBox={`0 0 ${SIZE(COLUMNS)} ${SIZE(ROWS)}`}
          role="img"
          aria-label={summary}
          className="h-auto w-full max-w-[232px] shrink-0"
        >
          <defs>
            <pattern
              id={hatch}
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="5" height="5" className="fill-surface" />
              <rect width="2" height="5" className="fill-ink" />
            </pattern>
          </defs>
          {CELLS.map(({ id, category }, i) => (
            <Cell
              key={id}
              category={category}
              x={(i % COLUMNS) * (CELL + GAP)}
              y={Math.floor(i / COLUMNS) * (CELL + GAP)}
              size={CELL}
              hatch={hatch}
              className={`origin-center [transform-box:fill-box] ${active ? 'motion-safe:animate-ignite' : ''}`}
              style={hydrated ? { animationDelay: `${i * 12}ms` } : undefined}
            />
          ))}
        </svg>
        <ul className="m-0 flex min-w-[220px] flex-1 list-none flex-col gap-2.5 p-0">
          {AUDIT_CATEGORIES.map((category) => (
            <li key={category} className="flex items-center gap-2.5 text-sm">
              <Swatch category={category} hatch={hatch} />
              <span className="flex-1">{copy.legend[category]}</span>
              <span className={`font-mono ${category === 'revealed' ? 'text-accent' : ''}`}>
                {AUDIT[category]}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <dl className="m-0 grid grid-cols-1 border-y border-ink sm:grid-cols-3">
        <div className="flex flex-col gap-1 border-line py-3 sm:pr-4 sm:[&:not(:last-child)]:border-r">
          <dt className="label-mono text-xs text-soft">{copy.revealed}</dt>
          <dd className="display-type m-0 text-[28px] leading-none">
            {copy.revealedValue(AUDIT.revealed, TOTAL)}
          </dd>
        </div>
        <div className="flex flex-col gap-1 border-line py-3 sm:px-4 sm:[&:not(:last-child)]:border-r">
          <dt className="label-mono text-xs text-soft">{copy.attempts}</dt>
          <dd className="m-0 flex items-baseline gap-2">
            <span className="display-type text-[28px] leading-none">{INTEGRITY.extractionAttempts}</span>
            <span className="text-sm text-soft">{copy.attemptsNote(INTEGRITY.resisted)}</span>
          </dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:pl-4">
          <dt className="label-mono text-xs text-soft">{copy.copied}</dt>
          <dd className="display-type m-0 text-[28px] leading-none">{INTEGRITY.copiedAnswers}</dd>
        </div>
      </dl>
      <ChartData
        caption={copy.caption}
        columns={[copy.columns.category, copy.columns.replies]}
        rows={AUDIT_CATEGORIES.map((category) => [copy.legend[category], AUDIT[category]])}
      />
    </figure>
  );
}
