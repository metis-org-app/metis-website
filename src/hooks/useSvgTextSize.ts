import { useEffect, useState, type RefObject } from 'react';

/**
 * Font size, in viewBox units, that renders as `px` CSS pixels however wide the SVG is drawn.
 * SVG text scales with the viewBox, so a 12-unit label in a 560-unit chart drawn 340 px wide would
 * show at about 7 px on a phone. Without ResizeObserver it assumes the chart is drawn at viewBox size.
 */
export function useSvgTextSize(ref: RefObject<SVGSVGElement | null>, viewBoxWidth: number, px = 12): number {
  const [width, setWidth] = useState(viewBoxWidth);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver !== 'function') return;
    const observer = new ResizeObserver(([entry]) => {
      const drawn = entry?.contentRect.width;
      if (drawn) setWidth(drawn);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return (px * viewBoxWidth) / width;
}
