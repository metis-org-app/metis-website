import type { ReactNode } from 'react';

/** A section's h2, with optional content (usually the lead) below it. */
export function SectionIntro({
  id,
  title,
  className = '',
  children,
}: {
  /** Id of the h2, referenced by the section's `aria-labelledby`. */
  id: string;
  title: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      <h2 id={id} className="display-type text-[clamp(32px,3.6vw,52px)] leading-none text-balance">
        {title}
      </h2>
      {children}
    </div>
  );
}
