import Resend from '@auth/core/providers/resend';
import { convexAuth } from '@convex-dev/auth/server';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Resend({
      from: process.env.AUTH_EMAIL ?? 'Quick Links <onboarding@resend.dev>',
    }),
  ],
});
