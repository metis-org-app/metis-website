import { Segmented } from '../../components/ui/Segmented';
import { Switch } from '../../components/ui/Switch';
import { ToggleGroup } from '../../components/ui/ToggleGroup';
import { useDemo } from '../../features/guide/demo-context';
import { HELP_MODES, type MaxHints } from '../../features/guide/types';
import { useI18n } from '../../i18n/useI18n';

export const MAX_HINT_OPTIONS: readonly MaxHints[] = [1, 2, 3];

export function RulesPanel() {
  const { m } = useI18n();
  const { state, dispatch } = useDemo();
  const { rules } = state;
  const copy = m.guide.rules;

  return (
    <div className="flex flex-col border-t border-ink lg:col-span-4">
      <h3 className="label-mono m-0 border-b border-line py-3 text-xs font-normal text-soft">
        {copy.heading}
      </h3>

      <div className="flex items-center justify-between gap-3 border-b border-line py-4">
        <span className="inline-flex items-center gap-2.5 font-bold">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          >
            <rect x="5" y="11" width="14" height="10" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          {copy.locked}
        </span>
        <span className="label-mono shrink-0 bg-ink px-1.5 py-[3px] text-[11px] whitespace-nowrap text-bg">
          {copy.alwaysOn}
        </span>
      </div>

      <ToggleGroup label={copy.helpStyle} hideLabel={false} className="border-b border-line py-4">
        <div className="flex flex-col gap-1.5">
          {HELP_MODES.map((mode) => {
            const on = rules.mode === mode;
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={on}
                onClick={() => dispatch({ type: 'rules/setMode', mode })}
                className={`flex min-h-14 items-start gap-3 border px-3 py-2.5 text-left text-ink transition-colors ${on ? 'border-ink bg-bg' : 'border-line bg-transparent hover:border-ink'}`}
              >
                <span
                  aria-hidden="true"
                  className="mt-[3px] inline-flex size-4 shrink-0 items-center justify-center border border-ink"
                >
                  <span className={`size-2 ${on ? 'bg-accent' : 'bg-transparent'}`} />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold">{copy.modes[mode].label}</span>
                  <span className="text-[13px] text-soft">{copy.modes[mode].desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </ToggleGroup>

      <div className="flex items-center justify-between gap-3 border-b border-line py-4">
        <span aria-hidden="true" className="font-semibold">
          {copy.maxHints}
        </span>
        <Segmented
          label={copy.maxHints}
          options={MAX_HINT_OPTIONS}
          value={rules.maxHints}
          onChange={(value) => dispatch({ type: 'rules/setMaxHints', value })}
        />
      </div>

      <Switch
        className="border-b border-line py-4"
        label={copy.cite}
        checked={rules.cite}
        onChange={(on) => dispatch({ type: 'rules/setCite', on })}
      />

      <p className="label-mono m-0 flex items-center gap-2 py-4 text-xs text-soft">
        {copy.applies}
        <span aria-hidden="true" className="inline-block text-accent motion-safe:animate-nudge">
          →
        </span>
      </p>
    </div>
  );
}
