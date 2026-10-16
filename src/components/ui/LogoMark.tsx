/** Square brand mark: ink square with the accent corner, plus the "METIS" wordmark. */
export function LogoMark({ size = 'md' }: { size?: 'md' | 'sm' }) {
  const box = size === 'md' ? 'size-[26px] p-[3px]' : 'size-[20px] p-[2px]';
  const corner = size === 'md' ? 'size-[9px]' : 'size-[7px]';
  const word = size === 'md' ? 'text-[19px]' : 'text-[15px]';
  return (
    <span className="inline-flex items-center gap-2.5">
      <span aria-hidden="true" className={`inline-flex items-end justify-end bg-ink ${box}`}>
        <span className={`bg-accent ${corner}`} />
      </span>
      <span className={`font-extrabold uppercase tracking-[0.01em] [font-stretch:125%] ${word}`}>Metis</span>
    </span>
  );
}
