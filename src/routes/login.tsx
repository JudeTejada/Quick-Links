import React, { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { SignIn, useAuth } from '../components/auth';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: '/' });
    }
  }, [isLoading, navigate, user]);

  return <SignIn />;
}
