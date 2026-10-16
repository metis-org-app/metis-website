import { ButtonLink } from '../../components/ui/ButtonLink';
import { links } from '../../config/links';
import { SECTION_IDS } from '../../content/demo-data';
import { useI18n } from '../../i18n/useI18n';
import { MetisCard } from './MetisCard';
import { Pipeline } from './Pipeline';

export function HeroSection() {
  const { m } = useI18n();
  return (
    <section id={SECTION_IDS.home} aria-labelledby="hero-title" className="border-b border-ink">
      <div className="container-page flex flex-col gap-[clamp(28px,3.5vw,40px)] pt-[clamp(40px,5vw,72px)] pb-[clamp(48px,6vw,80px)]">
        <p className="label-mono m-0 text-[13px] text-soft">{m.hero.canvas}</p>
        <div className="grid grid-cols-1 items-stretch gap-x-6 gap-y-10 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <h1
              id="hero-title"
              className="display-type text-[clamp(46px,6.3vw,98px)] leading-[0.93] tracking-[-0.04em] text-balance"
            >
              <span className="inline-block motion-safe:animate-rise">{m.hero.titleLead}</span>{' '}
              <span className="inline-block motion-safe:animate-rise" style={{ animationDelay: '0.06s' }}>
                {m.hero.titleTail}
                <span className="text-accent">.</span>
              </span>
            </h1>
            <div className="flex flex-wrap items-end gap-6">
              <p
                className="m-0 flex-[1.3_1_340px] text-[clamp(18px,1.5vw,20px)] leading-normal text-pretty motion-safe:animate-rise"
                style={{ animationDelay: '0.12s' }}
              >
                {m.hero.lead}
              </p>
              <div
                className="flex flex-[1_1_260px] flex-col gap-2.5 motion-safe:animate-rise"
                style={{ animationDelay: '0.18s' }}
              >
                <ButtonLink href={links.app}>{m.hero.primaryCta}</ButtonLink>
                <ButtonLink href={`#${SECTION_IDS.guide}`} variant="outline">
                  {m.hero.secondaryCta}
                </ButtonLink>
              </div>
            </div>
            <Pipeline />
          </div>
          <MetisCard />
        </div>
      </div>
    </section>
  );
}
