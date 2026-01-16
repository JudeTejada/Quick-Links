import React, { useState } from 'react';

import { notify } from '../../lib/notify';
import { useAuth } from './AuthProvider';
import { Button } from '../ui/button';
import { Field, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

export function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email);

      notify({
        status: 'success',
        title: 'Success',
        description: 'You are now signed in.',
      });
      setEmail('');
    } catch (error: any) {
      notify({
        status: 'danger',
        title: 'Something went wrong',
        description: error?.message || 'Unable to sign in.',
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
            <p className="mt-2 text-sm text-slate-500">Easily sign in with using a magic link.</p>
          </div>
          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                id="email"
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
