import type { BookmarkId, CategoryId } from '@/types';

export type DragData =
  | { type: 'category'; categoryId: CategoryId }
  | { type: 'link'; linkId: BookmarkId; categoryId: CategoryId };

export const getCategoryDragId = (categoryId: CategoryId) => `category:${categoryId}`;
export const getLinkDragId = (linkId: BookmarkId) => `link:${linkId}`;

export const parseCategoryDragId = (id: string) =>
  id.startsWith('category:') ? (id.replace('category:', '') as CategoryId) : null;
export const parseLinkDragId = (id: string) =>
  id.startsWith('link:') ? (id.replace('link:', '') as BookmarkId) : null;
