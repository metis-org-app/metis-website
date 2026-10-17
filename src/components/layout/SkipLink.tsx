import { useI18n } from '../../i18n/useI18n';

export function SkipLink() {
  const { m } = useI18n();
  return (
    <a
      href="#main"
      className="label-mono sr-only z-50 bg-ink px-4 py-3 text-[13px] text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      {m.a11y.skipToContent}
    </a>
  );
}
