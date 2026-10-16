import { MetisThumb } from '../../components/avatar/MetisThumb';
import { SectionIntro } from '../../components/ui/SectionIntro';
import { SECTION_IDS } from '../../content/demo-data';
import { useI18n } from '../../i18n/useI18n';

export function SpecSection() {
  const { m } = useI18n();
  return (
    <section id={SECTION_IDS.spec} aria-labelledby="spec-title" className="border-b border-ink">
      <div className="container-page grid grid-cols-1 gap-x-6 gap-y-10 py-[clamp(56px,7vw,88px)] lg:grid-cols-12">
        <SectionIntro id="spec-title" kicker={m.spec.kicker} title={m.spec.title} className="lg:col-span-4" />
        <dl className="m-0 border-t border-ink lg:col-span-8">
          {m.spec.rows.map((row, i) => (
            <div
              key={row.id}
              className="grid grid-cols-[minmax(120px,1fr)_minmax(0,2.4fr)] gap-4 border-b border-line py-4 motion-safe:animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <dt className="label-mono pt-0.5 text-[13px] text-soft">{row.k}</dt>
              <dd className="m-0 flex items-center gap-3 text-lg">
                {row.id === 'guide' && <MetisThumb size={30} />}
                <span>{row.v}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
