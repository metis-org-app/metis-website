import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * `false` on the server and during hydration, `true` right after. Lets the prerendered HTML leave out
 * heavy client-only markup (the avatar artwork) without a hydration mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
