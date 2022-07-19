type Bookmark = {
  url: string;
  id: string;
};

type BookmarkGroup = {
  title: string;
  id: string;
  bookmarks: Bookmark[];
};

type CategoriesBookmark = BookmarkGroup[];

type AddNewBookmark = {
  id: string;
  url: string;
};

export type { Bookmark, BookmarkGroup, CategoriesBookmark, AddNewBookmark };
