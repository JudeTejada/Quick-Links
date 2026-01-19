import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
let isListening = false;

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  if (!isListening && typeof window !== 'undefined') {
    isListening = true;
    window.addEventListener('online', notify);
    window.addEventListener('offline', notify);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && isListening && typeof window !== 'undefined') {
      window.removeEventListener('online', notify);
      window.removeEventListener('offline', notify);
      isListening = false;
    }
  };
};

const getSnapshot = () => (typeof navigator !== 'undefined' ? navigator.onLine : true);
const getServerSnapshot = () => true;

export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
