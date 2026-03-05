type MatchMediaListener = (event: MediaQueryListEvent) => void;

export interface MatchMediaMockController {
  dispatch: (matches: boolean) => void;
  restore: () => void;
}

export function installMatchMediaMock(
  initialMatches: boolean = false,
): MatchMediaMockController {
  const listeners: MatchMediaListener[] = [];
  let matches = initialMatches;

  const originalMatchMedia = window.matchMedia;

  const mediaQueryList: MediaQueryList = {
    get matches() {
      return matches;
    },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject | null,
    ) => {
      if (type !== 'change' || !listener) {
        return;
      }

      if (typeof listener === 'function') {
        listeners.push(listener as MatchMediaListener);
      }
    },
    removeEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject | null,
    ) => {
      if (type !== 'change' || !listener || typeof listener !== 'function') {
        return;
      }

      const index = listeners.indexOf(listener as MatchMediaListener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    },
    addListener: (listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null) => {
      if (listener) {
        listeners.push(listener as MatchMediaListener);
      }
    },
    removeListener: (
      listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null,
    ) => {
      if (!listener) {
        return;
      }

      const index = listeners.indexOf(listener as MatchMediaListener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    },
    dispatchEvent: () => true,
  };

  const matchMediaSpy = jasmine
    .createSpy('matchMedia')
    .and.callFake(() => mediaQueryList);
  window.matchMedia = matchMediaSpy;

  return {
    dispatch: (nextMatches: boolean) => {
      matches = nextMatches;
      const event = { matches } as MediaQueryListEvent;

      for (const listener of listeners) {
        listener(event);
      }
    },
    restore: () => {
      window.matchMedia = originalMatchMedia;
    },
  };
}
