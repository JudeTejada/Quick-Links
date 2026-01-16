import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;
const MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

let mediaQueryList: MediaQueryList | null = null;
let isListening = false;
const listeners = new Set<() => void>();

const getMediaQueryList = () => {
  if (typeof window === 'undefined') return null;
  return window.matchMedia(MEDIA_QUERY);
};

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  if (typeof window !== 'undefined') {
    if (!mediaQueryList) {
      mediaQueryList = getMediaQueryList();
    }
    if (mediaQueryList && !isListening) {
      mediaQueryList.addEventListener('change', notify);
      isListening = true;
    }
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && mediaQueryList && isListening) {
      mediaQueryList.removeEventListener('change', notify);
      isListening = false;
    }
  };
};

const getSnapshot = () => {
  if (!mediaQueryList) {
    mediaQueryList = getMediaQueryList();
  }
  return mediaQueryList ? mediaQueryList.matches : false;
};

const getServerSnapshot = () => false;

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
