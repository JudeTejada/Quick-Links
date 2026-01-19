import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SignIn } from './SignIn';

const signInMock = vi.fn();

vi.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({
    signIn: signInMock,
  }),
}));

vi.mock('@/lib/notify', () => ({
  notify: vi.fn(),
}));

describe('SignIn', () => {
  beforeEach(() => {
    signInMock.mockReset();
  });

  it('submits the email to the resend provider', async () => {
    signInMock.mockResolvedValue({ signingIn: false });

    render(<SignIn />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@example.com' },
    });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const form = submitButton.closest('form');
    if (!form) {
      throw new Error('Form not found');
    }
    fireEvent.submit(form);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalled();
    });

    const [provider, params] = signInMock.mock.calls[0];
    expect(provider).toBe('resend');
    const entries = Object.fromEntries((params as FormData).entries());
    expect(entries).toEqual({ email: 'user@example.com', redirectTo: '/' });
  });
});
