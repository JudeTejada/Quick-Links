import React, { createContext, useContext } from 'react';
import { useQuery } from 'convex/react';

import { api } from '../../convex/_generated/api';
import type { CategoriesBookmark } from '../types';
import { BookmarkLoader } from '../components/ui/BookmarkLoader';
import { useAuth } from '../components/auth';

type BookmarkContextValue = {
  categories: CategoriesBookmark;
};

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within BookmarkProvider');
  }

  return context;
}

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const categories = useQuery(api.bookmarks.listByUser, user ? { userId: user.id } : 'skip');

  if (!categories) return <BookmarkLoader />;

  return <BookmarkContext.Provider value={{ categories }}>{children}</BookmarkContext.Provider>;
}
