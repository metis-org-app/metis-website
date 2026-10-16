import type { ReactNode } from 'react';

/** Mono kicker ("02 — AI guide") followed by the section's h2. */
export function SectionIntro({
  id,
  kicker,
  title,
  className = '',
  children,
}: {
  /** Id of the h2, referenced by the section's `aria-labelledby`. */
  id: string;
  kicker: string;
  title: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      <span className="label-mono text-[13px]">{kicker}</span>
      <h2 id={id} className="display-type text-[clamp(32px,3.6vw,52px)] leading-none text-balance">
        {title}
      </h2>
      {children}
    </div>
  );
}
