import { describe, expect, it } from 'vitest';

import { isUrl, removeHttp } from './util';

describe('isUrl', () => {
  it('returns true for absolute URLs', () => {
    expect(isUrl('https://example.com')).toBe(true);
    expect(isUrl('http://example.com/path')).toBe(true);
  });

  it('returns false for invalid values', () => {
    expect(isUrl('example.com')).toBe(false);
    expect(isUrl('not-a-url')).toBe(false);
  });
});

describe('removeHttp', () => {
  it('strips http and https prefixes', () => {
    expect(removeHttp('https://example.com')).toBe('example.com');
    expect(removeHttp('http://example.com')).toBe('example.com');
  });

  it('leaves non-http schemes intact', () => {
    expect(removeHttp('ftp://example.com')).toBe('ftp://example.com');
  });
});
