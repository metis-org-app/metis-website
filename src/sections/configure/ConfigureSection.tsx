import { useId } from 'react';
import { MetisThumb } from '../../components/avatar/MetisThumb';
import { Segmented } from '../../components/ui/Segmented';
import { SectionIntro } from '../../components/ui/SectionIntro';
import { Switch } from '../../components/ui/Switch';
import { ToggleGroup } from '../../components/ui/ToggleGroup';
import { CONFIG_LIMITS, ITEM_TYPES, LEVELS, SECTION_IDS } from '../../content/demo-data';
import { activeTypes, moreCount, pad2, previewRows } from '../../features/configure/preview';
import { useDemo } from '../../features/guide/demo-context';
import { useI18n } from '../../i18n/useI18n';
import { MAX_HINT_OPTIONS } from '../guide/RulesPanel';

function Controls() {
  const { m } = useI18n();
  const { state, dispatch } = useDemo();
  const { config, rules } = state;
  const copy = m.configure;
  const rangeId = useId();
  const onlyOne = activeTypes(config.types).length === 1;

  return (
    <div className="flex flex-col border-t border-ink lg:col-span-4">
      <div className="flex flex-col gap-2 border-b border-line py-[18px]">
        <label htmlFor={rangeId} className="flex justify-between font-semibold">
          <span>{copy.count}</span>
          <span className="font-mono">{pad2(config.count)}</span>
        </label>
        <input
          id={rangeId}
          type="range"
          min={CONFIG_LIMITS.min}
          max={CONFIG_LIMITS.max}
          step={1}
          value={config.count}
          aria-valuetext={copy.countValueText(config.count)}
          onChange={(event) => dispatch({ type: 'config/setCount', count: Number(event.target.value) })}
          className="h-7 w-full"
        />
      </div>

      <ToggleGroup label={copy.types} hideLabel={false} className="border-b border-line py-[18px]">
        <div className="flex flex-col gap-1.5">
          {ITEM_TYPES.map((type) => {
            const on = config.types[type];
            const locked = on && onlyOne;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={on}
                aria-disabled={locked || undefined}
                onClick={() => dispatch({ type: 'config/toggleType', itemType: type })}
                className={`flex min-h-11 items-center gap-3 border px-2.5 py-2 text-left text-ink transition-colors ${on ? 'border-ink bg-surface' : 'border-line bg-transparent hover:border-ink'}`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-flex size-[18px] shrink-0 items-center justify-center border border-ink text-bg ${on ? 'bg-ink' : 'bg-transparent'}`}
                >
                  {on && (
                    <svg
                      viewBox="0 0 24 24"
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="square"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </span>
                {copy.typeNames[type]}
                {locked && <span className="sr-only">({copy.minOneType})</span>}
              </button>
            );
          })}
        </div>
      </ToggleGroup>

      <div className="flex flex-col gap-2.5 border-b border-line py-[18px]">
        <span aria-hidden="true" className="font-semibold">
          {copy.difficulty}
        </span>
        <Segmented
          label={copy.difficulty}
          options={LEVELS}
          value={config.level}
          getLabel={(level) => copy.levels[level]}
          onChange={(level) => dispatch({ type: 'config/setLevel', level })}
          buttonClassName="min-h-11"
        />
      </div>

      <div className="flex flex-col gap-3 border-b border-line py-[18px]">
        <Switch
          label={copy.metisToggle}
          checked={rules.enabled}
          onChange={(enabled) => dispatch({ type: 'rules/setEnabled', enabled })}
        />
        {rules.enabled && (
          <div className="flex items-center justify-between gap-3">
            <span aria-hidden="true" className="text-[15px] text-soft">
              {copy.maxHints}
            </span>
            <Segmented
              label={copy.maxHints}
              options={MAX_HINT_OPTIONS}
              value={rules.maxHints}
              onChange={(value) => dispatch({ type: 'rules/setMaxHints', value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Preview() {
  const { m } = useI18n();
  const { state } = useDemo();
  const { config, rules } = state;
  const copy = m.configure;
  const rows = previewRows(config);
  const more = moreCount(config);
  const summary = copy.summary(
    pad2(config.count),
    activeTypes(config.types).length,
    copy.levels[config.level],
    rules.enabled,
  );

  return (
    <div className="flex min-w-0 flex-col border border-ink bg-surface lg:col-span-8">
      <div className="relative flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 overflow-hidden border-b border-ink px-[18px] py-4">
        <span
          key={config.regen}
          aria-hidden="true"
          className="absolute -bottom-px left-[-30%] h-0.5 w-[30%] bg-accent motion-safe:animate-sweep"
        />
        <h3 className="m-0 text-[19px] font-bold">{copy.previewTitle}</h3>
        <output className="label-mono text-xs text-soft">{summary}</output>
      </div>
      <div role="region" aria-label={copy.previewLabel} tabIndex={0} className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-base">
          <thead>
            <tr className="label-mono text-left text-xs text-soft">
              <th scope="col" className="w-16 border-b border-line px-[18px] py-2.5 font-medium">
                {copy.columns.no}
              </th>
              <th scope="col" className="border-b border-line px-3 py-2.5 font-medium">
                {copy.columns.type}
              </th>
              <th scope="col" className="border-b border-line px-3 py-2.5 font-medium">
                {copy.columns.topic}
              </th>
              <th scope="col" className="w-[90px] border-b border-line px-3 py-2.5 font-medium">
                {copy.columns.level}
              </th>
              <th
                scope="col"
                className="w-[90px] border-b border-line px-[18px] py-2.5 text-right font-medium"
              >
                {copy.columns.source}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={`${config.regen}-${row.num}`}
                className="motion-safe:animate-fade-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <td className="border-b border-line2 px-[18px] py-3 font-mono text-soft">{row.num}</td>
                <td className="border-b border-line2 px-3 py-3 font-semibold">{copy.typeNames[row.type]}</td>
                <td className="border-b border-line2 px-3 py-3">{m.topics[row.topic]}</td>
                <td className="border-b border-line2 px-3 py-3">
                  <span role="img" aria-label={copy.levelAria(row.level)} className="inline-flex gap-[3px]">
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        aria-hidden="true"
                        className={`size-3 border border-ink ${n <= row.level ? 'bg-ink' : 'bg-transparent'}`}
                      />
                    ))}
                  </span>
                </td>
                <td className="border-b border-line2 px-[18px] py-3 text-right font-mono text-soft">
                  {copy.page(row.page)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {more > 0 && (
        <p className="m-0 border-b border-line2 px-[18px] py-3 font-mono text-[13px] text-soft">
          {copy.more(pad2(more))}
        </p>
      )}
      <div className="label-mono mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-ink px-[18px] py-3 text-xs tracking-[0.04em]">
        <span className="inline-flex items-center gap-2.5">
          <MetisThumb size={26} className={rules.enabled ? '' : 'opacity-35'} />
          {copy.guideLine(rules.enabled, rules.maxHints)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-soft">
          {copy.ready}
          <span
            aria-hidden="true"
            className="inline-block h-3.5 w-2 bg-accent motion-safe:animate-blink-brief"
          />
        </span>
      </div>
    </div>
  );
}

export function ConfigureSection() {
  const { m } = useI18n();
  return (
    <section id={SECTION_IDS.configure} aria-labelledby="configure-title" className="border-b border-ink">
      <div className="container-page flex flex-col gap-10 py-[clamp(56px,7vw,88px)]">
        <div className="grid grid-cols-1 items-end gap-x-6 gap-y-6 lg:grid-cols-12">
          <SectionIntro id="configure-title" title={m.configure.title} className="lg:col-span-8" />
          <p className="m-0 text-soft text-pretty lg:col-span-4">{m.configure.lead}</p>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
          <Controls />
          <Preview />
        </div>
      </div>
    </section>
  );
}
