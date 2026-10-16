import { links } from '../../config/links';
import { SECTION_IDS } from '../../content/demo-data';
import { useI18n } from '../../i18n/useI18n';
import { ButtonLink } from '../ui/ButtonLink';
import { LogoMark } from '../ui/LogoMark';
import { LangSwitch } from './LangSwitch';

export function SiteHeader() {
  const { m } = useI18n();
  const nav = [
    { href: `#${SECTION_IDS.guide}`, label: m.header.nav.guide },
    { href: `#${SECTION_IDS.configure}`, label: m.header.nav.configure },
    { href: `#${SECTION_IDS.results}`, label: m.header.nav.results },
    { href: `#${SECTION_IDS.insights}`, label: m.header.nav.insights },
    { href: `#${SECTION_IDS.spec}`, label: m.header.nav.spec },
  ];

  return (
    <header className="border-b border-ink bg-bg">
      <div className="container-page">
        <div className="label-mono flex items-center justify-between gap-4 border-b border-line text-xs text-soft">
          <span className="hidden py-2 lg:inline">{m.header.tagline}</span>
          <div className="ml-auto flex items-center gap-3">
            {links.login && (
              <a href={links.login} className="flex min-h-11 items-center px-1 text-soft hover:text-ink">
                {m.header.login}
              </a>
            )}
            <LangSwitch />
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 py-4">
          <a
            href={`#${SECTION_IDS.home}`}
            aria-label={m.a11y.home}
            className="flex min-h-11 items-center text-ink no-underline"
          >
            <LogoMark />
          </a>
          <nav aria-label={m.a11y.mainNav} className="label-mono hidden gap-7 text-[13px] lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-2 no-underline transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <ButtonLink href={links.app} size="sm" className="whitespace-nowrap">
            {m.header.cta}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
