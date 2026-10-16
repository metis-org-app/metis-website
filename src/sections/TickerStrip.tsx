import { useI18n } from '../i18n/useI18n';

/** Black band of sample events scrolling sideways. Decorative: the same facts appear in Results. */
export function TickerStrip() {
  const { m } = useI18n();
  // Two identical halves make the loop seamless (the animation moves by -50%).
  const items = [0, 1].flatMap((half) => m.ticker.map((text) => ({ key: `${half}-${text}`, text })));
  return (
    <div
      aria-hidden="true"
      className="label-mono overflow-hidden border-b border-ink bg-ink py-3 text-[13px] text-bg"
    >
      <div className="flex w-max gap-9 whitespace-nowrap hover:[animation-play-state:paused] motion-safe:animate-ticker">
        {items.map((item) => (
          <span key={item.key} className="inline-flex items-center gap-9">
            {item.text}
            <span className="inline-block size-2 bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
