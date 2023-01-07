import { Database } from './types/supabase';

type Bookmark = Database['public']['Tables']['links']['Row'];

type BookmarkList = Bookmark[];
type BookmarkCategory = Database['public']['Tables']['bookmarks']['Row'];

type BookmarkGroup = Database['public']['Tables']['bookmarks']['Row'] & {
  links: BookmarkList;
};

type AddNewBookmarkGroup = Database['public']['Tables']['bookmarks']['Insert'];

type CategoriesBookmark = BookmarkGroup[];

export type {
  Bookmark,
  BookmarkGroup,
  CategoriesBookmark,
  BookmarkList,
  AddNewBookmarkGroup,
  BookmarkCategory
};
