import { links } from '../../config/links';
import { useI18n } from '../../i18n/useI18n';
import { LogoMark } from '../ui/LogoMark';

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  const { m } = useI18n();
  const legal = [
    { href: links.privacy, label: m.footer.privacy },
    { href: links.terms, label: m.footer.terms },
    { href: links.contact, label: m.footer.contact },
  ].filter((item): item is { href: string; label: string } => item.href !== null);

  return (
    <footer className="bg-bg">
      <div className="container-page label-mono flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-6 text-xs text-soft">
        <span className="text-ink">
          <LogoMark size="sm" />
        </span>
        {legal.length > 0 && (
          <nav aria-label={m.a11y.legalNav} className="flex flex-wrap gap-5">
            {legal.map((item) => (
              <a key={item.label} href={item.href} className="py-2 transition-colors hover:text-accent">
                {item.label}
              </a>
            ))}
          </nav>
        )}
        <span>{m.footer.copyright(YEAR)}</span>
      </div>
    </footer>
  );
}
