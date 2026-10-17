import { act, render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSvgTextSize } from './useSvgTextSize';

function Chart() {
  const ref = useRef<SVGSVGElement>(null);
  const size = useSvgTextSize(ref, 560);
  return <svg ref={ref} data-size={size} />;
}

const drawnSize = () => Number(document.querySelector('svg')!.dataset.size);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useSvgTextSize', () => {
  it('uses the nominal size when the chart is drawn at viewBox width (or cannot be measured)', () => {
    render(<Chart />);
    expect(drawnSize()).toBe(12);
  });

  it('grows the viewBox font size as the chart is drawn narrower, so text stays 12 px', () => {
    let report: ResizeObserverCallback | undefined;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          report = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    render(<Chart />);
    act(() => report?.([{ contentRect: { width: 280 } } as ResizeObserverEntry], {} as ResizeObserver));
    expect(drawnSize()).toBe(24);
  });
});
