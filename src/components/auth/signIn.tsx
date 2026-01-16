import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';

import { notify } from '@/lib/notify';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function SignIn() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      formData.set('redirectTo', '/');
      const result = await signIn('resend', formData);

      notify({
        status: 'success',
        title: 'Success',
        description: result.signingIn
          ? 'You are now signed in.'
          : 'Check your email for a magic link to finish signing in.',
      });
      setEmail('');
    } catch (error) {
      notify({
        status: 'danger',
        title: 'Something went wrong',
        description: error instanceof Error ? error.message : 'Unable to send a magic link.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4e7d2] via-[#e2f0de] to-[#c7dcc5] p-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
          <div className="text-center">
            <h1 className="font-display text-3xl text-slate-900">Welcome</h1>
            <p className="mt-2 text-sm text-slate-500">Easily sign in using a magic link.</p>
          </div>
          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                id="email"
                name="email"
                placeholder="johndoe@gmail.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
