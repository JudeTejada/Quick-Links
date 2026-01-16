import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useConvexAuth } from 'convex/react';

import { SignIn } from '@/components/auth/SignIn';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return <SignIn />;
}
