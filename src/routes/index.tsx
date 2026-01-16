import React, { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useAuth } from '../components/auth';
import { BookmarkProvider } from '../context/BookmarkProvider';
import { BookmarkCategories } from '../components/ui';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Button } from '../components/ui/button';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login' });
    }
  }, [isLoading, navigate, user]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen  p-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6  md:p-14">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl text-slate-900 md:text-4xl">Quick Links</h1>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>
          <Button
            type="button"
            size="sm"
            className="border-transparent bg-[#0EA5B7] text-white shadow-sm hover:bg-[#0B8EA0]"
            onClick={signOut}
          >
            Sign out
          </Button>
        </div>

        <BookmarkContent />
      </div>
    </div>
  );
}

function BookmarkContent() {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
        It appears you are not connected in the internet
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col items-start">
      <BookmarkProvider>
        <BookmarkCategories />
      </BookmarkProvider>
    </div>
  );
}
