import { useEffect, useRef, useState } from 'react';
import { links } from '../../config/links';
import { SECTION_IDS } from '../../content/demo-data';
import { useI18n } from '../../i18n/useI18n';
import { ButtonLink } from '../ui/ButtonLink';
import { LogoMark } from '../ui/LogoMark';
import { LangSwitch } from './LangSwitch';

const MENU_ID = 'site-menu';
/** Tailwind's `xl` breakpoint: from here the whole menu fits in the row (Spanish labels are the longest). */
const DESKTOP_QUERY = '(min-width: 80rem)';

/**
 * Sticky header. On wide screens the navigation, language switch and CTA sit in one row; below `xl` the
 * navigation and language switch move into a disclosure menu, so the CTA stays in reach while scrolling.
 */
export function SiteHeader() {
  const { m } = useI18n();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nav = [
    { href: `#${SECTION_IDS.guide}`, label: m.header.nav.guide },
    { href: `#${SECTION_IDS.configure}`, label: m.header.nav.configure },
    { href: `#${SECTION_IDS.results}`, label: m.header.nav.results },
    { href: `#${SECTION_IDS.insights}`, label: m.header.nav.insights },
    { href: `#${SECTION_IDS.spec}`, label: m.header.nav.spec },
  ];

  // An open menu closes on Escape (focus returns to its button), on a click outside the header, and when
  // the layout switches to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onLayout = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    desktop.addEventListener('change', onLayout);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      desktop.removeEventListener('change', onLayout);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-ink bg-bg">
      <div className="container-page relative flex min-h-16 items-center gap-2 py-2.5 sm:gap-3 xl:gap-7">
        <a
          href={`#${SECTION_IDS.home}`}
          aria-label={m.a11y.home}
          className="mr-auto flex min-h-11 items-center text-ink no-underline xl:mr-0"
        >
          <LogoMark />
        </a>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={MENU_ID}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-11 shrink-0 items-center justify-center border border-ink text-ink transition-colors hover:bg-ink hover:text-bg xl:hidden"
        >
          <span className="sr-only">{m.header.menu}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeWidth="2" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" />
            )}
          </svg>
        </button>
        <div
          id={MENU_ID}
          className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col gap-3 border-b border-ink bg-bg px-6 pt-2 pb-4 xl:static xl:flex xl:flex-1 xl:flex-row xl:items-center xl:gap-7 xl:border-0 xl:p-0`}
        >
          <nav aria-label={m.a11y.mainNav} className="xl:flex-1">
            <ul className="label-mono m-0 flex list-none flex-col p-0 text-sm xl:flex-row xl:justify-center xl:gap-7 xl:text-[13px]">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center border-b border-line no-underline transition-colors hover:text-accent xl:min-h-11 xl:border-0"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="label-mono flex items-center justify-between gap-3 text-xs text-soft">
            {links.login && (
              <a href={links.login} className="flex min-h-11 items-center px-1 text-soft hover:text-ink">
                {m.header.login}
              </a>
            )}
            <LangSwitch />
          </div>
        </div>
        <ButtonLink href={links.app} size="sm" className="shrink-0 whitespace-nowrap max-sm:px-3">
          <span className="sm:hidden">{m.header.ctaShort}</span>
          <span className="hidden sm:inline">{m.header.cta}</span>
        </ButtonLink>
      </div>
    </header>
  );
}
