import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockReducedMotion } from '../test/mocks';
import { useCountUp } from './useCountUp';

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout', 'clearTimeout'],
  });
});
afterEach(() => {
  vi.useRealTimers();
});

describe('useCountUp', () => {
  it('stays at zero until active', () => {
    const { result } = renderHook(() => useCountUp(74, { active: false }));
    act(() => vi.advanceTimersByTime(2000));
    expect(result.current).toBe(0);
  });

  it('counts up to the target with an ease-out', () => {
    const { result } = renderHook(() => useCountUp(74, { active: true, durationMs: 1500 }));
    act(() => vi.advanceTimersByTime(300));
    const early = result.current;
    expect(early).toBeGreaterThan(0);
    expect(early).toBeLessThan(74);
    act(() => vi.advanceTimersByTime(1300));
    expect(result.current).toBe(74);
  });

  it('shows the final value immediately under reduced motion', () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useCountUp(26, { active: false }));
    expect(result.current).toBe(26);
  });

  it('cancels its animation frame on unmount', () => {
    const { unmount } = renderHook(() => useCountUp(11, { active: true }));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
