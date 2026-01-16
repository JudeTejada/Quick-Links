import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useConvexAuth, useQuery } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';

import { BookmarkCategories } from '@/components/ui/BookmarkCategories';
import { BookmarkLoader } from '@/components/ui/BookmarkLoader';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '../../convex/_generated/api';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : 'skip');
  const navigate = useNavigate();
  const isCheckingSession = isLoading || (isAuthenticated && user === undefined);
  const isRedirecting = !isLoading && !isAuthenticated;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isCheckingSession || isRedirecting) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 md:p-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
          <div className="mt-10">
            <BookmarkLoader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 md:p-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900 md:text-4xl">
              Quick Links
            </h1>
            <p className="mt-1 text-sm text-slate-500">{user?.email ?? 'Signed in'}</p>
          </div>
          <Button
            type="button"
            size="sm"
            className="border-transparent bg-[#0EA5B7] text-white shadow-sm hover:bg-[#0B8EA0]"
            onClick={() => void signOut()}
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
    <div className="mt-10 w-full">
      <BookmarkCategories />
    </div>
  );
}
