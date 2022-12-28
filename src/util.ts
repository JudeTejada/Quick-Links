import { clearDelegatedEvents } from "solid-js/web";

export const isUrl = (string: string): boolean => {
  try {
    return Boolean(new URL(string));
  } catch (e) {
    return false;
  }
};

export function removeHttp(url: string) {
  return url.replace(/^https?:\/\//, '');
}

function forceClickOutside() {
  const event = clearDelegatedEvents('MouseEvents');
  event.initEvent('click', true, true);
  document.dispatchEvent(event);
}
