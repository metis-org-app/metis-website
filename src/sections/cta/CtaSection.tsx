import { MetisAvatar } from '../../components/avatar/MetisAvatar';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { links } from '../../config/links';
import { useI18n } from '../../i18n/useI18n';

export function CtaSection() {
  const { m } = useI18n();
  return (
    <section aria-labelledby="cta-title" className="on-dark bg-ink text-bg">
      <div className="container-page flex flex-col gap-8 py-[clamp(64px,9vw,120px)]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2
            id="cta-title"
            className="display-type flex-[1_1_560px] text-[clamp(52px,8vw,128px)] leading-[0.9] tracking-[-0.045em] text-balance"
          >
            {m.cta.title}
            <span className="text-accent brightness-[1.35]">.</span>
          </h2>
          <figure className="m-0 flex w-[200px] flex-none flex-col gap-2.5">
            <span className="block size-[200px] border border-bg bg-bg p-2.5">
              <MetisAvatar expression="celebrating" label={m.cta.avatarLabel} />
            </span>
            <figcaption className="label-mono text-xs text-bg/80">{m.cta.metisCaption}</figcaption>
          </figure>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-bg/25 pt-6">
          <span className="label-mono text-[13px] text-bg/80">{m.cta.note}</span>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={links.app} variant="accent">
              {m.cta.primary}
            </ButtonLink>
            {links.contact && (
              <ButtonLink href={links.contact} variant="outline-on-dark">
                {m.cta.secondary}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
