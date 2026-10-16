import { SectionIntro } from '../../components/ui/SectionIntro';
import { SECTION_IDS } from '../../content/demo-data';
import { useI18n } from '../../i18n/useI18n';
import { ChatPanel } from './ChatPanel';
import { PresenceCard } from './PresenceCard';
import { RulesPanel } from './RulesPanel';

export function GuideSection() {
  const { m } = useI18n();
  return (
    <section id={SECTION_IDS.guide} aria-labelledby="guide-title" className="border-b border-ink bg-surface">
      <div className="container-page flex flex-col gap-10 py-[clamp(56px,7vw,88px)]">
        <div className="grid grid-cols-1 items-end gap-x-6 gap-y-10 lg:grid-cols-12">
          <SectionIntro id="guide-title" title={m.guide.title} className="lg:col-span-7">
            <p className="m-0 max-w-[620px] text-soft text-pretty">{m.guide.lead}</p>
          </SectionIntro>
          <PresenceCard />
        </div>
        <div className="grid grid-cols-1 items-stretch gap-x-6 gap-y-10 lg:grid-cols-12">
          <RulesPanel />
          <ChatPanel />
        </div>
      </div>
    </section>
  );
}
