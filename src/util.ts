export const isUrl = (value: string): boolean => {
  try {
    return Boolean(new URL(value));
  } catch (error) {
    return false;
  }
};

export function removeHttp(url: string) {
  return url.replace(/^https?:\/\//, '');
}
