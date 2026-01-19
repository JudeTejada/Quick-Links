import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QuickLinksInput } from './QuickLinksInput';

describe('QuickLinksInput', () => {
  it('prefills https:// for bookmark inputs', () => {
    render(
      <QuickLinksInput
        type="bookmark"
        errorText="invalid url"
        placeholder="url"
        onSuccessHandler={() => {}}
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('https://');
  });

  it('normalizes repeated protocols while typing', () => {
    render(
      <QuickLinksInput
        type="bookmark"
        errorText="invalid url"
        placeholder="url"
        onSuccessHandler={() => {}}
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'https://https://example.com' } });

    expect(input.value).toBe('https://example.com');
  });

  it('calls onSuccessHandler with a valid bookmark URL', () => {
    const onSuccessHandler = vi.fn();
    render(
      <QuickLinksInput
        type="bookmark"
        errorText="invalid url"
        placeholder="url"
        onSuccessHandler={onSuccessHandler}
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSuccessHandler).toHaveBeenCalledWith('https://example.com');
  });

  it('shows an error for invalid bookmark URLs', () => {
    render(
      <QuickLinksInput
        type="bookmark"
        errorText="invalid url"
        placeholder="url"
        onSuccessHandler={() => {}}
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
