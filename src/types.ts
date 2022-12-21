type Bookmark = {
  url: string;
  id: string;
  category_id: string;
  created_at: string;
};

type BookmarkGroup = {
  title: string;
  id: string;
  bookmarks: Bookmark[];
  user_id: string;
};

type CategoriesBookmark = BookmarkGroup[];

export type { Bookmark, BookmarkGroup, CategoriesBookmark };
