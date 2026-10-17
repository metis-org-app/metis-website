import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockReducedMotion } from '../test/mocks';
import { useTypewriter } from './useTypewriter';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('useTypewriter', () => {
  it('reveals the text step by step and reports when done', () => {
    const onDone = vi.fn<() => void>();
    const { result } = renderHook(() =>
      useTypewriter('Hello world', { active: true, step: 3, intervalMs: 20, onDone }),
    );
    expect(result.current.text).toBe('');
    act(() => vi.advanceTimersByTime(20));
    expect(result.current.text).toBe('Hel');
    expect(onDone).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(60));
    expect(result.current).toEqual({ text: 'Hello world', done: true });
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('shows the full text when not active', () => {
    const { result } = renderHook(() => useTypewriter('Done already', { active: false }));
    expect(result.current).toEqual({ text: 'Done already', done: true });
  });

  it('skips the animation under reduced motion', () => {
    mockReducedMotion(true);
    const onDone = vi.fn<() => void>();
    const { result } = renderHook(() => useTypewriter('Instant', { active: true, onDone }));
    expect(result.current.text).toBe('Instant');
    expect(onDone).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cleans up its timer on unmount', () => {
    const { unmount } = renderHook(() => useTypewriter('A long sentence to type', { active: true }));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
