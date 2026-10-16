import { createContext, useContext, type Dispatch } from 'react';
import type { Action, DemoState } from './types';

export interface DemoValue {
  state: DemoState;
  dispatch: Dispatch<Action>;
}

export const DemoContext = createContext<DemoValue | null>(null);

/** Shared state of the AI guide chat and the configurator (they share the guide rules). */
export function useDemo(): DemoValue {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo must be used inside <DemoProvider>');
  return value;
}
