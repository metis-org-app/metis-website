import { useEffect, type Dispatch } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Action, DemoState } from './types';

/** How long Metis "thinks" before replying. */
export const THINK_MS = 1100;
export const THINK_MS_REDUCED = 250;
/** Demo pacing: first prompt, then a pause after each finished reply. */
export const DEMO_FIRST_MS = 500;
export const DEMO_NEXT_MS = 1600;

/** Drives the time-based parts of the chat. Every timer is cleared on change/unmount. */
export function useGuideTimers(state: DemoState, dispatch: Dispatch<Action>): void {
  const reduced = useReducedMotion();
  const { phase, demo, messages } = state.chat;
  const demoActive = demo !== null;
  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (phase !== 'thinking') return;
    const id = window.setTimeout(
      () => dispatch({ type: 'chat/reply' }),
      reduced ? THINK_MS_REDUCED : THINK_MS,
    );
    return () => window.clearTimeout(id);
  }, [phase, reduced, dispatch]);

  useEffect(() => {
    if (!demoActive || phase !== 'idle') return;
    const id = window.setTimeout(
      () => dispatch({ type: 'chat/demoNext' }),
      isEmpty ? DEMO_FIRST_MS : DEMO_NEXT_MS,
    );
    return () => window.clearTimeout(id);
  }, [demoActive, phase, isEmpty, dispatch]);
}
