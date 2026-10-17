import type { AnchorHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'accent' | 'outline-on-dark';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'border-ink bg-ink text-bg hover:border-accent hover:bg-accent hover:text-accent-fg',
  outline: 'border-ink bg-transparent text-ink hover:border-accent hover:bg-accent hover:text-accent-fg',
  accent: 'border-accent bg-accent text-accent-fg hover:border-bg hover:bg-bg hover:text-ink',
  'outline-on-dark': 'border-bg bg-transparent text-bg hover:bg-bg hover:text-ink',
};

const SIZES = {
  md: 'px-5 py-3.5 text-sm',
  sm: 'px-4 py-2.5 text-[13px]',
} as const;

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: keyof typeof SIZES;
}

/** A link styled as the design's square, mono-label button. Always a real `<a href>`. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={`label-mono inline-flex min-h-11 items-center justify-center gap-2 border text-center no-underline transition-colors duration-150 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
