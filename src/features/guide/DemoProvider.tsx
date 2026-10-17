import { useMemo, useReducer, type ReactNode } from 'react';
import { DemoContext } from './demo-context';
import { createInitialState, reducer } from './reducer';
import { useGuideTimers } from './useGuideTimers';

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  useGuideTimers(state, dispatch);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <DemoContext value={value}>{children}</DemoContext>;
}
