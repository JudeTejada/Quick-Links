type Bookmark = {
  url: string;
  image: string;
};

type Categories = {
  title: string;
  bookmarks: Bookmark[];
};

type Bookmarks = Categories[];

export type { Bookmark, Categories, Bookmarks };
