import { useConvexAuth, useQuery } from 'convex/react';

import { api } from '../../convex/_generated/api';
import type { CategoriesBookmark } from '@/types';

export function useBookmark() {
  const { isAuthenticated } = useConvexAuth();
  const queryCategories = useQuery(api.bookmarks.listByUser, isAuthenticated ? {} : 'skip');
  const categories = (queryCategories ?? []) as CategoriesBookmark;
  const isLoading = isAuthenticated && queryCategories === undefined;

  return { categories, isLoading };
}
