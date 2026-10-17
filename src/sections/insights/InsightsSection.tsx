import { useRef, type ReactNode } from 'react';
import { MetisAvatar } from '../../components/avatar/MetisAvatar';
import { SampleDataNote } from '../../components/ui/SampleDataNote';
import { SectionIntro } from '../../components/ui/SectionIntro';
import {
  INSIGHTS,
  QUESTION_TIMELINE,
  SECTION_IDS,
  TIMELINE_BLOCK_MINUTES,
  TIMELINE_PEAK_ITEM,
} from '../../content/demo-data';
import { useInView } from '../../hooks/useInView';
import { useI18n } from '../../i18n/useI18n';
import { ConversationReview } from './ConversationReview';
import { AnalysisCarousel } from './AnalysisCarousel';

const SERIES: readonly number[] = QUESTION_TIMELINE;
const PEAK_START = SERIES.indexOf(Math.max(...SERIES)) * TIMELINE_BLOCK_MINUTES;

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
        <AnalysisCarousel />
      </div>
    </section>
  );
}
