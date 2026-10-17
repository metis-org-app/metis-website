import { ToggleGroup } from './ToggleGroup';

/** A row of mutually exclusive square buttons (`aria-pressed`), e.g. difficulty or max hints. */
export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  getLabel = String,
  buttonClassName = 'min-h-11 min-w-11 px-2',
  className = '',
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  getLabel?: (option: T) => string;
  buttonClassName?: string;
  className?: string;
}) {
  return (
    <ToggleGroup label={label} className={className}>
      <div className="flex border border-ink">
        {options.map((option, i) => {
          const active = option === value;
          return (
            <button
              key={String(option)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option)}
              className={`label-mono flex-1 text-[13px] tracking-[0.04em] transition-colors ${buttonClassName} ${i < options.length - 1 ? 'border-r border-ink' : ''} ${active ? 'bg-ink text-bg' : 'bg-transparent text-ink hover:bg-tint'}`}
            >
              {getLabel(option)}
            </button>
          );
        })}
      </div>
    </ToggleGroup>
  );
}
