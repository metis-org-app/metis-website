import { HEATMAP_ITEMS, HEATMAP_PAGES, MATERIAL_HEATMAP, MEANING_CLUSTERS } from '../../../content/demo-data';
import { useHydrated } from '../../../hooks/useHydrated';
import { useI18n } from '../../../i18n/useI18n';
import { ChartData } from './ChartData';

const TOTAL = MATERIAL_HEATMAP.flat().reduce((sum, n) => sum + n, 0);
const MAX = Math.max(...MATERIAL_HEATMAP.flat());
const MAX_ROW = MATERIAL_HEATMAP.findIndex((row) => row.includes(MAX));
const MAX_COL = MATERIAL_HEATMAP[MAX_ROW]!.indexOf(MAX);

/** Five ink steps; the busiest cell uses the accent, which on this site marks what needs attention. */
const STEPS = [
  { label: '0', test: (n: number) => n === 0, cell: 'border border-line2 text-soft' },
  { label: '1–2', test: (n: number) => n <= 2, cell: 'bg-ink/10' },
  { label: '3–5', test: (n: number) => n <= 5, cell: 'bg-ink/30' },
  { label: '6–9', test: (n: number) => n <= 9, cell: 'bg-ink/65 text-bg' },
  { label: '10+', test: () => true, cell: 'bg-ink text-bg' },
] as const;
const stepFor = (n: number) => STEPS.find((step) => step.test(n))!;

/**
 * Semantic: which pages of the material the questions are about, per item (heat map with the value
 * printed in every cell, as UI/UX Pro Max asks), and the largest groups of questions by meaning.
 */
export function MaterialHeatmap({ active }: { active: boolean }) {
  const { m } = useI18n();
  const copy = m.insights.analyses.semantic;
  const hydrated = useHydrated();
  const summary = copy.summary(TOTAL, MAX, HEATMAP_ITEMS[MAX_ROW]!, HEATMAP_PAGES[MAX_COL]!);

  return (
    <figure className="m-0 flex flex-col gap-4">
      <figcaption className="label-mono text-xs text-soft">{copy.caption}</figcaption>
      <div role="img" aria-label={summary} className="overflow-x-auto">
        <div
          aria-hidden="true"
          className="grid min-w-[320px] grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] gap-1 font-mono text-xs"
        >
          <span />
          {HEATMAP_PAGES.map((page) => (
            <span key={page} className="pb-1 text-center text-soft">
              {copy.page(page)}
            </span>
          ))}
          {MATERIAL_HEATMAP.map((row, r) => (
            <div key={HEATMAP_ITEMS[r]} className="contents">
              <span className="flex items-center text-soft">{copy.item(HEATMAP_ITEMS[r]!)}</span>
              {row.map((value, c) => {
                const hottest = r === MAX_ROW && c === MAX_COL;
                return (
                  <span
                    key={HEATMAP_PAGES[c]}
                    className={`flex h-9 items-center justify-center ${hottest ? 'bg-accent font-medium text-accent-fg' : stepFor(value).cell} ${active ? 'motion-safe:animate-fade-up' : ''}`}
                    style={hydrated ? { animationDelay: `${c * 50 + r * 25}ms` } : undefined}
                  >
                    {value}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="label-mono flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-soft">
        <span>{copy.legend}</span>
        {STEPS.map((step) => (
          <span key={step.label} className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className={`inline-block size-3.5 ${step.cell}`} />
            {step.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block size-3.5 bg-accent" />
          {copy.hottest}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h5 className="label-mono m-0 text-xs font-normal text-soft">{copy.clustersTitle}</h5>
        <ol className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-3">
          {MEANING_CLUSTERS.map((cluster) => (
            <li key={cluster.id} className="flex flex-col gap-1.5 border border-ink bg-bg p-3">
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold">{copy.clusters[cluster.id].label}</span>
                <span className="font-mono text-xs whitespace-nowrap text-soft">
                  {copy.questions(cluster.questions)}
                </span>
              </span>
              <q className="text-sm text-soft">{copy.clusters[cluster.id].quote}</q>
            </li>
          ))}
        </ol>
      </div>
      <ChartData
        caption={copy.caption}
        columns={[copy.columns.item, ...HEATMAP_PAGES.map((page) => copy.page(page)), copy.columns.total]}
        rows={MATERIAL_HEATMAP.map((row, r) => [
          copy.item(HEATMAP_ITEMS[r]!),
          ...row,
          row.reduce((sum, n) => sum + n, 0),
        ])}
      />
    </figure>
  );
}
