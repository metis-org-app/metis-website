/**
 * Browser APIs that jsdom does not implement, with small controls for tests.
 * Installed for every test file by `setup.ts`.
 */

type MqlListener = (event: MediaQueryListEvent) => void;

let reducedMotion = false;
const motionListeners = new Set<MqlListener>();

/** Emulates `prefers-reduced-motion: reduce` and notifies subscribers. */
export function mockReducedMotion(value: boolean): void {
  reducedMotion = value;
  for (const listener of motionListeners) {
    listener({ matches: value, media: '(prefers-reduced-motion: reduce)' } as MediaQueryListEvent);
  }
}

/** `(min-width: …)` queries match against the jsdom window width (1024 px unless a test changes it). */
function minWidthMatches(query: string): boolean {
  const found = /\(min-width:\s*([\d.]+)(px|rem)\)/.exec(query);
  if (!found) return false;
  const px = Number(found[1]) * (found[2] === 'rem' ? 16 : 1);
  return window.innerWidth >= px;
}

function matchMedia(query: string): MediaQueryList {
  const isMotion = query.includes('prefers-reduced-motion');
  return {
    get matches() {
      return isMotion ? reducedMotion : minWidthMatches(query);
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: MqlListener) => {
      if (isMotion) motionListeners.add(listener);
    },
    removeEventListener: (_type: string, listener: MqlListener) => {
      motionListeners.delete(listener);
    },
    addListener: (listener: MqlListener) => {
      if (isMotion) motionListeners.add(listener);
    },
    removeListener: (listener: MqlListener) => {
      motionListeners.delete(listener);
    },
    dispatchEvent: () => false,
  } as unknown as MediaQueryList;
}

let defaultIntersecting = true;
const observers = new Set<MockIntersectionObserver>();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [0];
  readonly scrollMargin = '0px';
  private readonly targets = new Set<Element>();
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    observers.add(this);
  }

  observe(target: Element): void {
    this.targets.add(target);
    this.emit(target, defaultIntersecting);
  }

  unobserve(target: Element): void {
    this.targets.delete(target);
  }

  disconnect(): void {
    this.targets.clear();
    observers.delete(this);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  emit(target: Element, isIntersecting: boolean): void {
    if (!this.targets.has(target)) return;
    const entry = {
      target,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
    } as IntersectionObserverEntry;
    this.callback([entry], this);
  }
}

/** Whether newly observed elements start as visible (default: true). */
export function setDefaultIntersecting(value: boolean): void {
  defaultIntersecting = value;
}

/** Reports a visibility change for an observed element. */
export function triggerIntersection(target: Element, isIntersecting: boolean): void {
  for (const observer of observers) observer.emit(target, isIntersecting);
}

export function installBrowserMocks(): void {
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: matchMedia });
  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: MockIntersectionObserver,
  });
}

export function resetBrowserMocks(): void {
  reducedMotion = false;
  motionListeners.clear();
  defaultIntersecting = true;
  observers.clear();
}
