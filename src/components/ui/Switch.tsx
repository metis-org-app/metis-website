/** On/off control rendered as the design's square switch (`role="switch"`). */
export function Switch({
  checked,
  onChange,
  label,
  className = '',
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex min-h-11 w-full items-center justify-between gap-3 bg-transparent text-left font-semibold text-ink ${className}`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`relative inline-block h-[26px] w-12 shrink-0 border border-ink transition-colors ${checked ? 'bg-ink' : 'bg-transparent'}`}
      >
        <span
          className={`absolute top-[3px] size-[18px] transition-[left] duration-150 ${checked ? 'left-[25px] bg-accent' : 'left-[3px] bg-ink'}`}
        />
      </span>
    </button>
  );
}
