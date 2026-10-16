import { MetisAvatar } from '../../components/avatar/MetisAvatar';
import { useDemo } from '../../features/guide/demo-context';
import { presence, presenceExpression, ruleSummary } from '../../features/guide/selectors';
import { useI18n } from '../../i18n/useI18n';

/** Live Metis: her expression follows the chat (listening → thinking → guiding, reviewing at the limit). */
export function PresenceCard() {
  const { m } = useI18n();
  const { state } = useDemo();
  const now = presence(state);

  return (
    <div className="flex items-center gap-[18px] border border-ink bg-bg py-3.5 pr-[18px] pl-3.5 lg:col-span-5">
      <div className="aspect-[1192/1168] w-[clamp(110px,14vw,168px)] shrink-0">
        <MetisAvatar expression={presenceExpression(state)} />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <span className="label-mono inline-flex items-center gap-2 text-[11px] tracking-[0.08em] text-accent">
          <span aria-hidden="true" className="size-[7px] bg-accent motion-safe:animate-beacon" />
          {m.guide.presence.live}
        </span>
        <output className="block m-0 text-[21px] leading-tight font-bold tracking-[-0.01em]">
          {m.guide.presence.headline[now]}
        </output>
        <span className="label-mono text-[11.5px] text-soft">{ruleSummary(state.rules, m)}</span>
      </div>
    </div>
  );
}
