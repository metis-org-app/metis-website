import { useRef, type ReactNode } from 'react';
import { MetisAvatar } from '../../components/avatar/MetisAvatar';
import { SampleDataNote } from '../../components/ui/SampleDataNote';
import { SectionIntro } from '../../components/ui/SectionIntro';
import {
  INSIGHTS,
  INTENT_SHARES,
  QUESTION_TIMELINE,
  SECTION_IDS,
  TIMELINE_BLOCK_MINUTES,
  TIMELINE_PEAK_ITEM,
} from '../../content/demo-data';
import { useInView } from '../../hooks/useInView';
import { useI18n } from '../../i18n/useI18n';
import { ConversationReview } from './ConversationReview';
import { QuestionTimeline } from './QuestionTimeline';

const SERIES: readonly number[] = QUESTION_TIMELINE;
const PEAK_START = SERIES.indexOf(Math.max(...SERIES)) * TIMELINE_BLOCK_MINUTES;
const TOP_SHARE = Math.max(...INTENT_SHARES.map((s) => s.pct));

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-2 border-line p-4 [&:not(:last-child)]:border-r">
      <dt className="label-mono text-xs text-soft">{label}</dt>
      <dd className="display-type m-0 text-[40px] leading-none tracking-[-0.04em] whitespace-nowrap">
        {children}
      </dd>
    </div>
  );
}

function Stats() {
  const { m } = useI18n();
  const copy = m.insights.stats;
  return (
    <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] self-end border-y border-ink lg:col-span-5">
      <Stat label={copy.asked}>
        {INSIGHTS.studentsAsked}
        <span className="text-[22px] text-soft">/{INSIGHTS.students}</span>
      </Stat>
      <Stat label={copy.questions}>{INSIGHTS.questions}</Stat>
      <Stat label={copy.peak(TIMELINE_PEAK_ITEM)}>
        <span className="text-accent">
          {PEAK_START}–{PEAK_START + TIMELINE_BLOCK_MINUTES}
        </span>
        <span className="text-[22px] text-soft"> {copy.minutes}</span>
      </Stat>
    </dl>
  );
}

function IntentShares({ active }: { active: boolean }) {
  const { m } = useI18n();
  const copy = m.insights.intents;
  return (
    <div className="flex flex-col gap-3 lg:col-span-6">
      <h3 className="label-mono m-0 border-b border-ink pb-3 text-xs font-normal text-soft">
        {copy.heading}
      </h3>
      <ol className="m-0 flex list-none flex-col p-0">
        {INTENT_SHARES.map(({ intent, pct }, i) => (
          <li key={intent} className="flex flex-col gap-2 border-b border-line py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="inline-flex flex-wrap items-center gap-2 font-semibold">
                {copy.names[intent]}
                {intent === 'answer' && (
                  <span className="label-mono border border-ink px-1.5 py-0.5 text-xs font-normal">
                    {copy.withheld}
                  </span>
                )}
              </span>
              <span className="shrink-0 font-mono text-sm whitespace-nowrap">{m.results.percent(pct)}</span>
            </div>
            <span aria-hidden="true" className="h-2 bg-line2">
              <span
                className={`block h-full origin-left bg-ink ${active ? 'motion-safe:animate-bar-x' : ''}`}
                style={{ width: `${(pct / TOP_SHARE) * 100}%`, animationDelay: `${i * 0.08}s` }}
              />
            </span>
            <q className="font-mono text-[13px] text-soft">{copy.examples[intent]}</q>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TrendCard() {
  const { m } = useI18n();
  const copy = m.insights.trend;
  return (
    <div className="flex flex-col border border-ink bg-bg sm:flex-row lg:col-span-4 lg:flex-col">
      <span className="flex shrink-0 items-center justify-center border-b border-ink bg-surface p-4 sm:w-[200px] sm:border-r sm:border-b-0 lg:w-auto lg:border-r-0 lg:border-b">
        <span className="block aspect-square w-full max-w-[200px]">
          <MetisAvatar expression="thinking" label={copy.avatarLabel} still />
        </span>
      </span>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="label-mono text-xs tracking-[0.08em] text-accent">{copy.label}</span>
        <p className="m-0 text-[17px] text-pretty">{copy.text}</p>
        <span className="label-mono mt-auto pt-2 text-xs text-soft">{copy.basis}</span>
      </div>
    </div>
  );
}

/**
 * Conversation insights: every student chat with Metis is saved with the results, so the instructor can
 * read any of them and see what the class asked, when, and what that suggests teaching next.
 */
export function InsightsSection() {
  const { m } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, rootMargin: '-80px 0px' });

  return (
    <section id={SECTION_IDS.insights} aria-labelledby="insights-title" className="border-b border-ink">
      <div ref={ref} className="container-page flex flex-col gap-10 py-[clamp(56px,7vw,88px)]">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12">
          <SectionIntro id="insights-title" title={m.insights.title} className="lg:col-span-7">
            <p className="m-0 max-w-[620px] text-soft text-pretty">{m.insights.lead}</p>
            <SampleDataNote />
          </SectionIntro>
          <Stats />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <ConversationReview active={inView} />
          <TrendCard />
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
          <IntentShares active={inView} />
          <QuestionTimeline active={inView} />
        </div>
      </div>
    </section>
  );
}
