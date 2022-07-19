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
