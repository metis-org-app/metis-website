import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;

/**
 * Counts from 0 to `target` with an ease-out once `active` becomes true.
 * Under reduced motion the final value is shown immediately.
 */
export function useCountUp(
  target: number,
  { active, durationMs = 1500 }: { active: boolean; durationMs?: number },
): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduced, target, durationMs]);

  return reduced ? target : value;
}
