import type { ReactNode } from 'react';

/**
 * Semantic wrapper for a set of related toggle buttons (`aria-pressed`).
 * Uses <fieldset>/<legend> so the group is announced with its label.
 */
export function ToggleGroup({
  label,
  hideLabel = true,
  className = '',
  children,
}: {
  label: string;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className={`m-0 min-w-0 border-0 p-0 ${className}`}>
      <legend className={hideLabel ? 'sr-only' : 'mb-2.5 p-0 font-semibold'}>{label}</legend>
      {children}
    </fieldset>
  );
}
