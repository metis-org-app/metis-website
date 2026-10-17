import { useEffect, useEffectEvent, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface Options {
  /** Animate only while true; otherwise the full text is shown. */
  active: boolean;
  /** Characters revealed per tick. */
  step?: number;
  intervalMs?: number;
  /** Called when the full text is visible. May run more than once (StrictMode); keep it idempotent. */
  onDone?: () => void;
}

/** Reveals `text` progressively. Under reduced motion the text appears at once. */
export function useTypewriter(text: string, { active, step = 3, intervalMs = 20, onDone }: Options) {
  const reduced = useReducedMotion();
  const animate = active && !reduced;
  const [count, setCount] = useState(0);
  const shown = animate ? Math.min(count, text.length) : text.length;
  const finished = shown >= text.length;
  const notifyDone = useEffectEvent(() => onDone?.());

  useEffect(() => {
    if (!animate || finished) return;
    const id = window.setInterval(() => setCount((c) => c + step), intervalMs);
    return () => window.clearInterval(id);
  }, [animate, finished, step, intervalMs]);

  useEffect(() => {
    if (finished) notifyDone();
  }, [finished]);

  return { text: text.slice(0, shown), done: finished };
}
