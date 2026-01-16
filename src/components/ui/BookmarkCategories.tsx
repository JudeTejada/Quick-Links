import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import X from 'lucide-react/dist/esm/icons/x';
import { useConvexAuth, useMutation } from 'convex/react';

import { useBookmark } from '@/hooks/useBookmark';
import { LinksList } from './LinksList';
import { CreateNewCategory } from './AddNewCategory';
import { CategoryPreferences } from './CategoryPreferences';
import { BookmarkLoader } from './BookmarkLoader';
import type { BookmarkId, BookmarkList, CategoriesBookmark, CategoryId } from '../../types';
import { notify } from '../../lib/notify';
import { api } from '../../../convex/_generated/api';
import { Button } from './button';
import { Input } from './input';
import { cn } from '../../lib/utils';
import { getCategoryDragId } from '../../lib/drag';

const normalizeCategories = (categories: CategoriesBookmark) =>
  [...categories]
    .sort((a, b) => (a.sortIndex ?? a.createdAt) - (b.sortIndex ?? b.createdAt))
    .map((category) => ({
      ...category,
      links: [...category.links].sort(
        (a, b) => (a.sortIndex ?? a.createdAt) - (b.sortIndex ?? b.createdAt),
      ),
    }));

const clampIndex = (value: number, max: number) => Math.max(0, Math.min(value, max));

type DragState =
  | { type: 'category'; categoryId: CategoryId }
  | { type: 'link'; linkId: BookmarkId; categoryId: CategoryId }
  | null;

type LinkOrigin = { categoryId: CategoryId; index: number } | null;

export function BookmarkCategories() {
  const { categories, isLoading } = useBookmark();
  const { isAuthenticated } = useConvexAuth();
  const reorderCategories = useMutation(api.bookmarks.reorder);
  const moveLink = useMutation(api.links.move);
  const reorderLinks = useMutation(api.links.reorder);
  const [draftCategories, setDraftCategories] = useState<CategoriesBookmark>(() =>
    normalizeCategories(categories),
  );
  const [activeDrag, setActiveDrag] = useState<DragState>(null);
  const [linkOrigin, setLinkOrigin] = useState<LinkOrigin>(null);
  const [overCategoryId, setOverCategoryId] = useState<CategoryId | null>(null);
  const isDraggingRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (isDraggingRef.current) return;
    setDraftCategories(normalizeCategories(categories));
  }, [categories]);

  const categoryDragIds = useMemo(
    () => draftCategories.map((category) => getCategoryDragId(category._id)),
    [draftCategories],
  );
  const linkPositionMap = useMemo(() => {
    const map = new Map<BookmarkId, { categoryId: CategoryId; index: number }>();
    for (const category of draftCategories) {
      category.links.forEach((link, index) => {
        map.set(link._id, { categoryId: category._id, index });
      });
    }
    return map;
  }, [draftCategories]);

  if (isLoading) {
    return <BookmarkLoader />;
  }

  const findLinkPosition = (linkId: BookmarkId) => linkPositionMap.get(linkId) ?? null;

  const updateCategoryOrder = (nextCategories: CategoriesBookmark) =>
    nextCategories.map((category, index) => ({
      ...category,
      sortIndex: index,
    }));

  const updateLinkOrder = (links: BookmarkList) =>
    links.map((link, index) => ({
      ...link,
      sortIndex: index,
    }));

  const moveLinkInState = (
    current: CategoriesBookmark,
    linkId: string,
    fromCategoryId: CategoryId,
    toCategoryId: CategoryId,
    targetIndex: number,
  ) => {
    const sourceIndex = current.findIndex((category) => category._id === fromCategoryId);
    const destinationIndex = current.findIndex((category) => category._id === toCategoryId);
    if (sourceIndex === -1 || destinationIndex === -1) return current;

    const next = current.map((category) => ({
      ...category,
      links: [...category.links],
    }));
    const source = next[sourceIndex];
    const destination = next[destinationIndex];
    const linkIndex = source.links.findIndex((link) => link._id === linkId);
    if (linkIndex === -1) return current;

    const [link] = source.links.splice(linkIndex, 1);
    const insertIndex = clampIndex(targetIndex, destination.links.length);
    const movedLink =
      fromCategoryId === toCategoryId ? link : { ...link, categoryId: toCategoryId };
    destination.links.splice(insertIndex, 0, movedLink);

    source.links = updateLinkOrder(source.links);
    destination.links = updateLinkOrder(destination.links);

    return next;
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current as DragState;
    if (!data || !('type' in data)) return;

    isDraggingRef.current = true;
    setActiveDrag(data);
    setOverCategoryId(null);

    if (data.type === 'link') {
      const origin = findLinkPosition(data.linkId);
      setLinkOrigin(origin ? { categoryId: origin.categoryId, index: origin.index } : null);
    } else {
      setLinkOrigin(null);
    }
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeData = active.data.current as DragState;
    const overData = over.data.current as DragState;

    if (!activeData || activeData.type !== 'link' || !overData) return;

    const currentPosition = findLinkPosition(activeData.linkId);
    if (!currentPosition) return;

    const toCategoryId = overData.categoryId;
    setOverCategoryId(toCategoryId);

    const sourceCategoryId = currentPosition.categoryId;
    const targetCategory = draftCategories.find((category) => category._id === toCategoryId);
    if (!targetCategory) return;

    const overIndex =
      overData.type === 'link'
        ? targetCategory.links.findIndex((link) => link._id === overData.linkId)
        : targetCategory.links.length;

    if (overIndex < 0) return;

    const isSameCategory = sourceCategoryId === toCategoryId;
    if (isSameCategory && currentPosition.index === overIndex) return;

    setDraftCategories((prev) =>
      moveLinkInState(prev, activeData.linkId, sourceCategoryId, toCategoryId, overIndex),
    );
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    isDraggingRef.current = false;
    setOverCategoryId(null);

    if (!over || !activeDrag || !isAuthenticated) {
      setDraftCategories(normalizeCategories(categories));
      setActiveDrag(null);
      setLinkOrigin(null);
      return;
    }

    const activeData = active.data.current as DragState;
    const overData = over.data.current as DragState;

    if (!activeData || !overData) {
      setDraftCategories(normalizeCategories(categories));
      setActiveDrag(null);
      setLinkOrigin(null);
      return;
    }

    if (activeData.type === 'category' && overData.type === 'category') {
      const activeIndex = draftCategories.findIndex(
        (category) => category._id === activeData.categoryId,
      );
      const overIndex = draftCategories.findIndex(
        (category) => category._id === overData.categoryId,
      );

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        setActiveDrag(null);
        return;
      }

      const reordered = updateCategoryOrder(arrayMove(draftCategories, activeIndex, overIndex));
      setDraftCategories(reordered);

      try {
        await reorderCategories({
          orderedIds: reordered.map((category) => category._id),
        });
        notify({ status: 'success', title: 'Category order updated' });
      } catch (error) {
        notify({
          status: 'danger',
          title: 'Error!',
          description: 'Failed to reorder categories. Please try again.',
        });
        setDraftCategories(normalizeCategories(categories));
      } finally {
        setActiveDrag(null);
        setLinkOrigin(null);
      }

      return;
    }

    if (activeData.type !== 'link') {
      setActiveDrag(null);
      setLinkOrigin(null);
      return;
    }

    const finalPosition = findLinkPosition(activeData.linkId);
    if (!finalPosition || !linkOrigin) {
      setDraftCategories(normalizeCategories(categories));
      setActiveDrag(null);
      setLinkOrigin(null);
      return;
    }

    if (
      finalPosition.categoryId === linkOrigin.categoryId &&
      finalPosition.index === linkOrigin.index
    ) {
      setActiveDrag(null);
      setLinkOrigin(null);
      return;
    }

    try {
      if (finalPosition.categoryId !== linkOrigin.categoryId) {
        await moveLink({
          linkId: activeData.linkId,
          toCategoryId: finalPosition.categoryId,
          targetIndex: finalPosition.index,
        });
        notify({ status: 'success', title: 'Link moved' });
      } else {
        const category = draftCategories.find((item) => item._id === finalPosition.categoryId);
        if (!category) {
          setActiveDrag(null);
          return;
        }

        await reorderLinks({
          categoryId: finalPosition.categoryId,
          orderedIds: category.links.map((link) => link._id),
        });
        notify({ status: 'success', title: 'Links reordered' });
      }
    } catch (error) {
      notify({
        status: 'danger',
        title: 'Error!',
        description: 'Failed to move the link. Please try again.',
      });
      setDraftCategories(normalizeCategories(categories));
    } finally {
      setActiveDrag(null);
      setLinkOrigin(null);
    }
  };

  const handleDragCancel = () => {
    isDraggingRef.current = false;
    setActiveDrag(null);
    setOverCategoryId(null);
    setLinkOrigin(null);
    setDraftCategories(normalizeCategories(categories));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={categoryDragIds} strategy={verticalListSortingStrategy}>
        <ul className="list-none space-y-8 p-0">
          {draftCategories.map((category) => (
            <CategoryItem
              key={category._id}
              categoryId={category._id}
              title={category.title}
              links={category.links}
              isDropTarget={overCategoryId === category._id && activeDrag?.type === 'link'}
            />
          ))}

          <li className="pt-2">
            <CreateNewCategory />
          </li>
        </ul>
      </SortableContext>

      <DragOverlay>
        {activeDrag?.type === 'category' ? (
          <CategoryGhost
            title={
              draftCategories.find((category) => category._id === activeDrag.categoryId)?.title ??
              ''
            }
          />
        ) : null}
        {activeDrag?.type === 'link' ? (
          <LinkGhost
            url={
              draftCategories
                .flatMap((category) => category.links)
                .find((link) => link._id === activeDrag.linkId)?.url ?? ''
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

interface CategoryItemProps {
  categoryId: CategoryId;
  title: string;
  links: BookmarkList;
  isDropTarget: boolean;
}

function CategoryItem(props: CategoryItemProps) {
  const { isAuthenticated } = useConvexAuth();
  const updateTitle = useMutation(api.bookmarks.updateTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [linksIsEditing, setLinksIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(props.title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: getCategoryDragId(props.categoryId),
    data: { type: 'category', categoryId: props.categoryId },
  });

  useEffect(() => {
    if (!props.links?.length && linksIsEditing) setLinksIsEditing(false);
  }, [linksIsEditing, props.links?.length]);

  useEffect(() => {
    if (isEditing) {
      setDraftTitle(props.title);
      inputRef.current?.focus();
    }
  }, [isEditing, props.title]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isEditing) {
        setDraftTitle(props.title);
        setIsEditing(false);
      }
      if (linksIsEditing) setLinksIsEditing(false);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEditing, linksIsEditing, props.title]);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(props.title);
    }
  }, [isEditing, props.title]);

  const commitTitle = async (text: string) => {
    if (!isAuthenticated) return;
    if (isSaving) return;

    const trimmedTitle = text.trim();
    if (!trimmedTitle) {
      notify({
        status: 'danger',
        title: 'Error!',
        description: 'please enter a category',
      });
      return;
    }

    if (trimmedTitle === props.title) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateTitle({
        title: trimmedTitle,
        categoryId: props.categoryId,
      });
      setIsEditing(false);
    } catch (error) {
      notify({
        status: 'danger',
        title: 'Error!',
        description:
          error instanceof Error ? error.message : 'Failed to edit existing category title.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        'group relative rounded-2xl  px-3 py-3 transition-[background-color] duration-200 hover:bg-slate-50',
        props.isDropTarget && 'bg-sky-50/70',
        isDragging && 'opacity-70',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            className="grid h-7 w-7 cursor-grab place-items-center rounded-full bg-slate-100 text-slate-400 opacity-70 transition group-hover:opacity-100 pointer-coarse:opacity-100 active:cursor-grabbing"
            aria-label="Drag category"
          >
            <GripVertical size={14} />
          </span>

          {isEditing ? (
            <Input
              ref={inputRef}
              nativeInput
              className="h-8 w-56 rounded-md border border-slate-200 bg-white px-2 text-xl font-semibold text-slate-900 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitTitle(draftTitle);
                }
                if (event.key === 'Escape') {
                  event.preventDefault();
                  setDraftTitle(props.title);
                  setIsEditing(false);
                }
              }}
              onBlur={() => commitTitle(draftTitle)}
            />
          ) : (
            <button
              type="button"
              className="truncate text-xl font-semibold tracking-tight text-slate-900 transition-colors hover:text-slate-700"
              onClick={() => setIsEditing(true)}
            >
              {props.title}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {linksIsEditing ? (
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-6 w-6 rounded-full border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Stop editing links"
              onClick={() => setLinksIsEditing(false)}
            >
              <X size={14} />
            </Button>
          ) : null}

          {!isEditing ? (
            <CategoryPreferences
              isLinksEditing={linksIsEditing}
              links={props.links}
              onToggleLinksEdit={setLinksIsEditing}
              categoryId={props.categoryId}
              categoryTitle={props.title}
            />
          ) : null}
        </div>
      </div>

      <div className="mt-3 ps-8">
        <LinksList
          list={props.links}
          categoryId={props.categoryId}
          isLinksEditing={linksIsEditing}
        />
      </div>
    </li>
  );
}

function CategoryGhost({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2.5">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-400">
        <GripVertical size={14} />
      </span>
      <span className="text-base font-semibold text-slate-800">{title || 'Untitled'}</span>
    </div>
  );
}

function LinkGhost({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/95 px-2.5 py-1.5">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">
        {url ? url.slice(0, 2).toUpperCase() : 'QL'}
      </span>
      <span className="max-w-[200px] truncate text-sm text-slate-700">{url || 'Quick Link'}</span>
    </div>
  );
}
