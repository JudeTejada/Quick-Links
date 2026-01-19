import { create } from 'zustand';

import type { CategoriesBookmark } from '@/types';
import type { Id } from '../../convex/_generated/dataModel';

type BookmarkState = {
  userId: Id<'users'> | null;
  categories: CategoriesBookmark | null;
  setCategoriesForUser: (userId: Id<'users'>, categories: CategoriesBookmark) => void;
  clear: () => void;
};

export const useBookmarkStore = create<BookmarkState>((set) => ({
  userId: null,
  categories: null,
  setCategoriesForUser: (userId, categories) => set({ userId, categories }),
  clear: () => set({ userId: null, categories: null }),
}));
