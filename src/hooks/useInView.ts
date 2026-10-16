import { useEffect, useState, type RefObject } from 'react';
import { useHydrated } from './useHydrated';

const supported = () => typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';

/**
 * Whether the element is in (or near) the viewport.
 * With `once`, it stays `true` after the first intersection. Without IntersectionObserver it turns `true`
 * after mounting.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { once = false, rootMargin = '0px' }: { once?: boolean; rootMargin?: string } = {},
): boolean {
  // Starts false everywhere (server, hydration), so the prerendered HTML and the first client render match.
  const [inView, setInView] = useState(false);
  const hydrated = useHydrated();

  useEffect(() => {
    const element = ref.current;
    if (!element || !supported()) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, once, rootMargin]);

  // Without IntersectionObserver everything counts as visible once the page is interactive.
  return supported() ? inView : hydrated;
}
