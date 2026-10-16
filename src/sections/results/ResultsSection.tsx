import { useRef } from 'react';
import { MetisAvatar } from '../../components/avatar/MetisAvatar';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { SectionIntro } from '../../components/ui/SectionIntro';
import { HISTOGRAM_BINS, HISTOGRAM_LOW_MAX, ITEM_ACCURACY, KPI, SECTION_IDS } from '../../content/demo-data';
import { useCountUp } from '../../hooks/useCountUp';
import { useInView } from '../../hooks/useInView';
import { useI18n } from '../../i18n/useI18n';

function Kpi({ label, children, final }: { label: string; children: React.ReactNode; final: string }) {
  return (
    <div className="flex flex-col gap-1 border-line p-5 [&:not(:last-child)]:border-r">
      <dt className="label-mono text-xs text-soft">{label}</dt>
      <dd className="m-0">
        <span aria-hidden="true" className="display-type text-[52px] leading-none tracking-[-0.04em]">
          {children}
        </span>
        <span className="sr-only">{final}</span>
      </dd>
    </div>
  );
}

function KpiRow({ active }: { active: boolean }) {
  const { m } = useI18n();
  const copy = m.results;
  const submissions = useCountUp(KPI.submissions, { active });
  const accuracy = useCountUp(KPI.accuracy, { active });
  const hints = useCountUp(KPI.hints, { active });
  return (
    <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] border-y border-ink">
      <Kpi label={copy.kpis.submissions} final={`${KPI.submissions}/${KPI.enrolled}`}>
        {submissions}
        <span className="text-[28px] text-soft">/{KPI.enrolled}</span>
      </Kpi>
      <Kpi label={copy.kpis.accuracy} final={copy.percent(KPI.accuracy)}>
        {copy.percent(accuracy)}
      </Kpi>
      <Kpi label={copy.kpis.hints} final={String(KPI.hints)}>
        {hints}
      </Kpi>
      <Kpi label={copy.kpis.revealed} final={String(KPI.revealed)}>
        <span className="text-accent">{KPI.revealed}</span>
      </Kpi>
    </dl>
  );
}

const BINS = HISTOGRAM_BINS.map((count, score) => ({ count, score }));

function Histogram({ active }: { active: boolean }) {
  const { m } = useI18n();
  return (
    <figure className="m-0 flex flex-col gap-3 lg:col-span-6">
      <figcaption className="label-mono text-xs text-soft">{m.results.histogramCaption}</figcaption>
      <svg viewBox="0 0 560 240" role="img" aria-label={m.results.histogramLabel} className="h-auto w-full">
        {BINS.map(({ count, score }) => {
          const h = count * 38;
          return (
            <rect
              key={score}
              x={6 + score * 50}
              y={210 - h}
              width={38}
              height={h}
              className={`origin-bottom [transform-box:fill-box] ${score <= HISTOGRAM_LOW_MAX ? 'fill-accent' : 'fill-ink'} ${active ? 'motion-safe:animate-bar-y' : ''}`}
              style={{ animationDelay: `${score * 0.05}s` }}
            />
          );
        })}
        <line x1={0} y1={210} x2={560} y2={210} className="stroke-ink" strokeWidth={1} />
        {BINS.map(({ score }) => (
          <text
            key={score}
            x={25 + score * 50}
            y={230}
            textAnchor="middle"
            className="fill-soft font-mono text-[12px]"
          >
            {score}
          </text>
        ))}
      </svg>
    </figure>
  );
}

function ItemAccuracy({ active }: { active: boolean }) {
  const { m } = useI18n();
  return (
    <div className="flex flex-col gap-3 lg:col-span-6">
      <h3 className="label-mono m-0 text-xs font-normal text-soft">{m.results.accuracyCaption}</h3>
      <ol className="m-0 flex list-none flex-col border-t border-ink p-0">
        {ITEM_ACCURACY.map((item, i) => {
          const flagged = i === 0;
          return (
            <li
              key={item.num}
              className="grid grid-cols-[44px_minmax(0,1.4fr)_minmax(0,1fr)_56px] items-center gap-3 border-b border-line py-[11px]"
            >
              <span className="font-mono text-[13px] text-soft">{item.num}</span>
              <span className="inline-flex flex-wrap items-center gap-2 font-semibold">
                {m.topics[item.topic]}
                {flagged && (
                  <span className="label-mono bg-accent px-1.5 py-0.5 text-[11px] text-accent-fg">
                    {m.results.review}
                  </span>
                )}
              </span>
              <span aria-hidden="true" className="h-2 bg-line2">
                <span
                  className={`block h-full origin-left ${flagged ? 'bg-accent' : 'bg-ink'} ${active ? 'motion-safe:animate-bar-x' : ''}`}
                  style={{ width: `${item.pct}%`, animationDelay: `${i * 0.08}s` }}
                />
              </span>
              <span className="text-right font-mono text-sm">{m.results.percent(item.pct)}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ResultsSection() {
  const { m } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, rootMargin: '-80px 0px' });

  return (
    <section
      id={SECTION_IDS.results}
      aria-labelledby="results-title"
      className="border-b border-ink bg-surface"
    >
      <div ref={ref} className="container-page flex flex-col gap-10 py-[clamp(56px,7vw,88px)]">
        <SectionIntro id="results-title" title={m.results.title} className="max-w-[820px]" />
        <KpiRow active={inView} />
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
          <Histogram active={inView} />
          <ItemAccuracy active={inView} />
        </div>
        <div className="flex flex-wrap items-center gap-4 border border-ink bg-bg px-4 py-3.5">
          <span className="h-[122px] w-[124px] shrink-0 border border-ink bg-surface p-1.5">
            <MetisAvatar expression="reviewing" label={m.results.avatarLabel} />
          </span>
          <div className="flex flex-[1_1_320px] flex-col gap-0.5">
            <span className="label-mono text-[11px] tracking-[0.08em] text-accent">
              {m.results.summaryLabel}
            </span>
            <p className="m-0 text-[17px]">{m.results.summary}</p>
          </div>
          <ButtonLink href={`#${SECTION_IDS.insights}`} variant="outline" size="sm">
            {m.results.seeConversations}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
