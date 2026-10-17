import { useEffect, useState, type RefObject } from 'react';

/** `true` while the pointer is over the element or focus is inside it (used to pause auto-play). */
export function useHoverOrFocus(ref: RefObject<HTMLElement | null>): boolean {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    const focusIn = () => setFocused(true);
    const focusOut = (event: FocusEvent) => {
      if (!element.contains(event.relatedTarget as Node | null)) setFocused(false);
    };
    element.addEventListener('pointerenter', enter);
    element.addEventListener('pointerleave', leave);
    element.addEventListener('focusin', focusIn);
    element.addEventListener('focusout', focusOut);
    return () => {
      element.removeEventListener('pointerenter', enter);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('focusin', focusIn);
      element.removeEventListener('focusout', focusOut);
    };
  }, [ref]);

  return hovered || focused;
}
