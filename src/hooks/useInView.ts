import { useEffect, useState, type RefObject } from 'react';

const supported = () => typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';

/**
 * Whether the element is in (or near) the viewport.
 * With `once`, it stays `true` after the first intersection. Without IntersectionObserver it is always `true`.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { once = false, rootMargin = '0px' }: { once?: boolean; rootMargin?: string } = {},
): boolean {
  const [inView, setInView] = useState(() => !supported());

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

  return inView;
}
