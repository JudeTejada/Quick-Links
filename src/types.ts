import type { Id } from '../convex/_generated/dataModel';

export type UserId = Id<'users'>;
export type BookmarkId = Id<'links'>;
export type CategoryId = Id<'bookmarks'>;

export type Bookmark = {
  _id: BookmarkId;
  url: string;
  categoryId: CategoryId;
  userId: UserId;
  createdAt: number;
  sortIndex?: number;
  updatedAt?: number;
};

export type BookmarkList = Bookmark[];

export type BookmarkCategory = {
  _id: CategoryId;
  title: string;
  userId: UserId;
  createdAt: number;
  sortIndex?: number;
  updatedAt?: number;
};

export type BookmarkGroup = BookmarkCategory & {
  links: BookmarkList;
};

export type CategoriesBookmark = BookmarkGroup[];
