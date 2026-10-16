import { useRef } from 'react';
import { useInView } from '../../hooks/useInView';
import { expressionClass, type Expression } from './expressions';
import { MetisAvatarArt } from './MetisAvatarArt.generated';

interface MetisAvatarProps {
  expression: Expression;
  /** Accessible name. Without it the avatar is decorative (`aria-hidden`). */
  label?: string;
  /** Show the static drawing (no idle loops), for avatars that only decorate a card. */
  still?: boolean;
  className?: string;
}

/**
 * Animated vector avatar of Metis. The expression only switches a root class;
 * animations pause while the avatar is off-screen to save paint work.
 */
export function MetisAvatar({ expression, label, still = false, className = '' }: MetisAvatarProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { rootMargin: '120px' });
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : { 'aria-hidden': true as const };

  return (
    <svg
      ref={ref}
      viewBox="0 0 1192 1168"
      className={`${expressionClass(expression)} ${className}`}
      data-expression={expression}
      data-paused={inView ? undefined : ''}
      data-still={still ? '' : undefined}
      focusable="false"
      {...a11y}
    >
      <MetisAvatarArt />
    </svg>
  );
}
