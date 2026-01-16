import { useMemo, useState } from 'react';
import X from 'lucide-react/dist/esm/icons/x';
import { useConvexAuth, useMutation } from 'convex/react';
import { useDndContext } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Bookmark, CategoryId } from '../../types';
import { removeHttp } from '../../util';
import { CreateBookmark } from './AddNewBookmark';
import { api } from '../../../convex/_generated/api';
import { Button } from './button';
import { cn } from '../../lib/utils';
import { getLinkDragId } from '../../lib/drag';

interface LinkListProps {
  list: Bookmark[];
  categoryId: CategoryId;
  isLinksEditing: boolean;
}

export function LinksList(props: LinkListProps) {
  const items = useMemo(
    () => props.list.map((bookmark) => getLinkDragId(bookmark._id)),
    [props.list],
  );

  return (
    <SortableContext items={items} strategy={rectSortingStrategy}>
      <ul className="list-none flex min-h-[40px] flex-wrap items-center  gap-y-3 p-0">
        {props.list.map((bookmark) => (
          <BookmarkLink
            key={bookmark._id}
            {...bookmark}
            categoryId={props.categoryId}
            isLinksEditing={props.isLinksEditing}
          />
        ))}

        {!props.isLinksEditing ? (
          <li>
            <CreateBookmark categoryId={props.categoryId} />
          </li>
        ) : null}
      </ul>
    </SortableContext>
  );
}

interface BookmarkLinkProps extends Bookmark {
  isLinksEditing: boolean;
  categoryId: CategoryId;
}

function BookmarkLink(props: BookmarkLinkProps) {
  const [imageError, setImageError] = useState(false);
  const { isAuthenticated } = useConvexAuth();
  const removeLink = useMutation(api.links.remove);
  const iconSizeClass = props.isLinksEditing ? 'h-[34px] w-[34px]' : 'h-6 w-6';
  const dragId = getLinkDragId(props._id);
  const { active } = useDndContext();
  const { setNodeRef, listeners, attributes, transform, transition, isDragging, isOver } =
    useSortable({
      id: dragId,
      data: { type: 'link', linkId: props._id, categoryId: props.categoryId },
    });
  const isLinkDrag = active?.data.current?.type === 'link';
  const showInsert = isLinkDrag && isOver && active?.id !== dragId;

  const handleDeleteLink = async (linkId: Bookmark['_id']) => {
    if (!isAuthenticated) return;

    try {
      await removeLink({ linkId });
    } catch (error) {
      console.error(error);
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
        'group relative rounded-full bg-slate-50/70 p-0.5 transition-[background-color] duration-200',
        showInsert && 'bg-sky-50',
        isDragging && 'opacity-60',
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute -top-2 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-sky-300/0 transition-opacity duration-200',
          showInsert && 'bg-sky-300/80',
        )}
      />
      <div
        {...listeners}
        {...attributes}
        className="flex items-center rounded-full p-1 transition hover:bg-slate-100/80 cursor-grab active:cursor-grabbing"
        aria-label="Drag link"
      >
        <a href={props.url} target="_blank" rel="noreferrer" className="inline-flex items-center">
          {!imageError ? (
            <img
              className={`${iconSizeClass} rounded-full object-cover`}
              src={`https://icon.horse/icon/${removeHttp(props.url)}`}
              onError={() => setImageError(true)}
              alt={props.url}
            />
          ) : (
            <span
              className={`${iconSizeClass} grid place-items-center rounded-full bg-black text-[10px] text-white`}
            >
              404
            </span>
          )}
        </a>
      </div>

      {props.isLinksEditing ? (
        <Button
          variant="destructive"
          size="icon-xs"
          className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-transparent p-0 text-white shadow-sm"
          aria-label="Delete current link"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            handleDeleteLink(props._id);
          }}
        >
          <X size={10} />
        </Button>
      ) : null}
    </li>
  );
}
