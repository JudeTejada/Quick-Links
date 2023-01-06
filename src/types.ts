import { Database } from './types/supabase';

type Bookmark = Database['public']['Tables']['links']['Row'];

type BookmarkList = Bookmark[];
type BookmarkGroup = Database['public']['Tables']['bookmarks']['Row'] & {
  links: BookmarkList;
};

type CategoriesBookmark = BookmarkGroup[];

export type { Bookmark, BookmarkGroup, CategoriesBookmark BookmarkList };
